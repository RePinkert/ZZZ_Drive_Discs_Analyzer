"""
ZZZ Drive Discs Analyzer - 全量图片下载器

从米游社百科 (baike.mihoyo.com) 重新下载所有代理人头像和驱动盘套装图标，
统一裁剪、缩放、输出为标准 webp 格式。

用法:
    python scripts/download_images_baike.py          # 全量替换
    python scripts/download_images_baike.py --missing # 仅下载缺失的

依赖:
    pip install playwright Pillow
    python -m playwright install chromium
"""

import argparse
import asyncio
import csv
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_AGENTS = PROJECT_ROOT / "web-ui" / "assets" / "agents"
OUTPUT_SETS = PROJECT_ROOT / "web-ui" / "assets" / "sets"
CSV_AGENTS = PROJECT_ROOT / "web-ui" / "zenlesszonezero.csv"
CSV_SETS = PROJECT_ROOT / "web-ui" / "set_registry.csv"

AGENT_TARGET = (102, 100)
SET_TARGET = (35, 35)
WEBP_QUALITY = 85

BAIKE_DETAIL = "https://baike.mihoyo.com/zzz/wiki/content/{id}/detail?mhy_presentation_style=fullscreen"


def load_csv():
    agents = {}
    with open(CSV_AGENTS, "r", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            agents[row["Agent"].strip()] = int(row["id"].strip())
    sets = {}
    with open(CSV_SETS, "r", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            sets[row["set"].strip()] = int(row["id"].strip())
    return agents, sets


def process_image(raw_bytes, target_size):
    img = Image.open(io.BytesIO(raw_bytes))
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (30, 30, 30))
        bg.paste(img, mask=img.split()[3])
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = 0
    img = img.crop((left, top, left + min_dim, top + min_dim))
    img = img.resize(target_size, Image.Resampling.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=WEBP_QUALITY, method=6)
    return buf.getvalue()


async def fetch_best_image(page, csv_id, img_type="agent"):
    url = BAIKE_DETAIL.format(id=csv_id)
    await page.goto(url, timeout=20000, wait_until="networkidle")
    await asyncio.sleep(1.5)

    imgs = await page.query_selector_all(
        "img[src*='fastcdn'], img[src*='act-upload'], img[src*='upload-bbs']"
    )

    candidates = []
    for img_el in imgs:
        src = await img_el.get_attribute("src") or ""
        box = await img_el.bounding_box()
        if not box or not src:
            continue
        if img_type == "agent":
            if box["width"] > 100:
                candidates.append((src, box["width"] * box["height"]))
        else:
            if 30 < box["width"] < 300 and 30 < box["height"] < 300:
                candidates.append((src, box["width"]))

    if not candidates:
        if img_type == "agent":
            candidates = [(src, 0) for img_el in imgs
                          if (src := await img_el.get_attribute("src") or "")
                          and "fastcdn" in src]
        else:
            for img_el in imgs:
                src = await img_el.get_attribute("src") or ""
                box = await img_el.bounding_box()
                if box and src and box["width"] > 50:
                    candidates.append((src, box["width"]))

    if not candidates:
        return None

    if img_type == "agent":
        candidates.sort(key=lambda x: -x[1])
    else:
        candidates.sort(key=lambda x: -x[1])

    best_src = candidates[0][0]
    resp = await page.request.get(best_src, timeout=15000)
    if resp.ok:
        return await resp.body()
    return None


async def download_all(page, items, output_dir, target_size, img_type, force):
    total = len(items)
    ok = 0
    fail = []

    for i, (name, csv_id) in enumerate(items.items(), 1):
        out_path = output_dir / f"{csv_id}.webp"
        if not force and out_path.exists() and out_path.stat().st_size > 300:
            print(f"  [{i:2d}/{total}] [SKIP] {name} ({csv_id})")
            ok += 1
            continue

        try:
            raw = await fetch_best_image(page, csv_id, img_type)
            if raw and len(raw) > 500:
                processed = process_image(raw, target_size)
                if len(processed) > 100:
                    out_path.write_bytes(processed)
                    size_kb = len(processed) / 1024
                    print(f"  [{i:2d}/{total}] [OK]   {name} ({csv_id}) {size_kb:.1f}KB")
                    ok += 1
                else:
                    fail.append((name, csv_id, "processed too small"))
                    print(f"  [{i:2d}/{total}] [FAIL] {name} ({csv_id}) processed too small")
            else:
                fail.append((name, csv_id, "no image or too small"))
                print(f"  [{i:2d}/{total}] [FAIL] {name} ({csv_id}) no suitable image")
        except Exception as e:
            fail.append((name, csv_id, str(e)))
            print(f"  [{i:2d}/{total}] [FAIL] {name} ({csv_id}) {e}")

        await asyncio.sleep(0.3)

    return ok, fail


async def main():
    parser = argparse.ArgumentParser(description="Download ZZZ images from miyoushe baike")
    parser.add_argument("--missing", action="store_true", help="Only download missing images")
    parser.add_argument("--agents-only", action="store_true", help="Only download agent images")
    parser.add_argument("--sets-only", action="store_true", help="Only download set images")
    args = parser.parse_args()

    force = not args.missing

    OUTPUT_AGENTS.mkdir(parents=True, exist_ok=True)
    OUTPUT_SETS.mkdir(parents=True, exist_ok=True)

    agent_map, set_map = load_csv()

    print(f"CSV: {len(agent_map)} agents, {len(set_map)} sets")
    print(f"Mode: {'FULL REPLACE' if force else 'MISSING ONLY'}")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        agent_ok, agent_fail = 0, []
        set_ok, set_fail = 0, []

        if not args.sets_only:
            print(f"\n{'='*50}")
            print(f"Phase 1: Agent portraits ({len(agent_map)})")
            print(f"{'='*50}")
            agent_ok, agent_fail = await download_all(
                page, agent_map, OUTPUT_AGENTS, AGENT_TARGET, "agent", force
            )

        if not args.agents_only:
            print(f"\n{'='*50}")
            print(f"Phase 2: Drive disc set icons ({len(set_map)})")
            print(f"{'='*50}")
            set_ok, set_fail = await download_all(
                page, set_map, OUTPUT_SETS, SET_TARGET, "set", force
            )

        await browser.close()

    print(f"\n{'='*50}")
    print("RESULT")
    print(f"{'='*50}")
    total_ok = agent_ok + set_ok
    total_fail = len(agent_fail) + len(set_fail)
    total = len(agent_map) + len(set_map)
    print(f"  OK:   {total_ok}/{total}")
    print(f"  FAIL: {total_fail}")
    if agent_fail:
        print("  Agent failures:")
        for n, cid, reason in agent_fail:
            print(f"    - {n} ({cid}): {reason}")
    if set_fail:
        print("  Set failures:")
        for n, cid, reason in set_fail:
            print(f"    - {n} ({cid}): {reason}")


if __name__ == "__main__":
    asyncio.run(main())
