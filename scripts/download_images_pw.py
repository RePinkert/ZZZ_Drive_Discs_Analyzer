"""
ZZZ Drive Discs Analyzer - Playwright Image Downloader

Uses Playwright to bypass Cloudflare on HoneyHunterWorld.
Launches a visible browser for CF verification, then downloads images.

Usage:
    python scripts/download_images_pw.py

Dependencies:
    pip install playwright
    python -m playwright install chromium
"""

import csv
import json
import sys
import asyncio
import time
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

CSV_AGENTS = PROJECT_ROOT / "web-ui" / "zenlesszonezero.csv"
CSV_SETS = PROJECT_ROOT / "web-ui" / "set_registry.csv"
AGENT_NAME_MAP = SCRIPT_DIR / "agent_name_map.json"
SET_NAME_MAP = SCRIPT_DIR / "set_name_map.json"

OUTPUT_AGENTS = PROJECT_ROOT / "web-ui" / "assets" / "agents"
OUTPUT_SETS = PROJECT_ROOT / "web-ui" / "assets" / "sets"

HHW_BASE = "https://zzz.honeyhunterworld.com"
HHW_CHAR_PAGE = f"{HHW_BASE}/{{id}}-char/"
HHW_AGENT_ICON = f"{HHW_BASE}/img/character/{{id}}-char_icon_100.webp"
HHW_SET_ICON = f"{HHW_BASE}/img/art_set/{{id}}-art_set_icon_35.webp"

HHW_AGENT_ID_MIN = 1001
HHW_AGENT_ID_MAX = 2000


def load_csv_agents():
    agents = []
    with open(CSV_AGENTS, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["Agent"].strip()
            csv_id = int(row["id"].strip())
            agents.append((name, csv_id))
    return agents


def load_csv_sets():
    sets = []
    with open(CSV_SETS, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["set"].strip()
            csv_id = int(row["id"].strip())
            sets.append((name, csv_id))
    return sets


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


async def wait_for_cf(page, timeout=60):
    print("Waiting for Cloudflare verification...")
    start = time.time()
    while time.time() - start < timeout:
        title = await page.title()
        if "Just a moment" not in title and "Cloudflare" not in title:
            print(f"CF passed! Page title: {title}")
            return True
        await asyncio.sleep(1)
    print("CF verification timeout!")
    return False


async def discover_hhw_ids(page):
    print("=== Phase 1: Discover HHW agent IDs ===")
    hhw_map = {}

    for hhw_id in range(HHW_AGENT_ID_MIN, HHW_AGENT_ID_MAX + 1, 10):
        url = HHW_CHAR_PAGE.format(id=hhw_id)
        try:
            await page.goto(url, timeout=15000, wait_until="domcontentloaded")
            title = await page.title()

            if "Just a moment" in title:
                if not await wait_for_cf(page):
                    print("Cannot pass CF, aborting discovery")
                    break

            if "404" in title or "Not Found" in title:
                continue

            parts = title.split(" - ")
            if len(parts) >= 2:
                name = parts[0].strip()
                if name and name not in ("ZZZ", "Zenless Zone Zero"):
                    hhw_map[name.lower()] = hhw_id
                    print(f"  [{hhw_id}] {name}")

        except Exception:
            continue

        await asyncio.sleep(0.3)

    print(f"  Found {len(hhw_map)} HHW agents")
    return hhw_map


def match_agent_hhw_id(chinese_name, english_name, hhw_map):
    key = english_name.lower()
    if key in hhw_map:
        return hhw_map[key]
    first_word = key.split()[0]
    if first_word in hhw_map:
        return hhw_map[first_word]
    for hhw_name, hhw_id in hhw_map.items():
        if key.startswith(hhw_name) or hhw_name.startswith(key):
            return hhw_id
        if hhw_name.endswith(" " + key) or key.endswith(" " + hhw_name):
            return hhw_id
    for hhw_name, hhw_id in hhw_map.items():
        if key in hhw_name or hhw_name in key:
            return hhw_id
    return None


async def download_with_pw(page, url, output_path):
    try:
        resp = await page.request.get(url, timeout=15000)
        if resp.ok:
            body = await resp.body()
            if len(body) > 500:
                output_path.parent.mkdir(parents=True, exist_ok=True)
                with open(output_path, "wb") as f:
                    f.write(body)
                return True
    except Exception:
        pass
    return False


async def download_agent_images(page, agents, agent_name_map, hhw_map):
    print(f"\n=== Phase 2: Download agent icons ({len(agents)}) ===")
    success = 0
    failed = []

    for chinese_name, csv_id in agents:
        out = OUTPUT_AGENTS / f"{csv_id}.webp"
        if out.exists() and out.stat().st_size > 500:
            print(f"  [SKIP] [{csv_id}] {chinese_name} (exists)")
            success += 1
            continue

        english_name = agent_name_map.get(chinese_name)
        if not english_name:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: no english mapping")
            failed.append((chinese_name, csv_id, "no mapping"))
            continue

        hhw_id = match_agent_hhw_id(chinese_name, english_name, hhw_map)
        if not hhw_id:
            print(f"  [FAIL] [{csv_id}] {chinese_name} ({english_name}): no HHW match")
            failed.append((chinese_name, csv_id, "no HHW match"))
            continue

        url = HHW_AGENT_ICON.format(id=hhw_id)
        if await download_with_pw(page, url, out):
            size_kb = out.stat().st_size / 1024
            print(f"  [OK] [{csv_id}] {chinese_name} -> HHW:{hhw_id} ({size_kb:.1f}KB)")
            success += 1
        else:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: download failed")
            failed.append((chinese_name, csv_id, "download failed"))

        await asyncio.sleep(0.2)

    print(f"\n  OK: {success}/{len(agents)}")
    if failed:
        print(f"  FAIL: {len(failed)}")
        for name, cid, reason in failed:
            print(f"    - {name} ({cid}): {reason}")
    return success, failed


async def download_set_images(page, sets, set_name_map):
    print(f"\n=== Phase 3: Download set icons ({len(sets)}) ===")
    success = 0
    failed = []

    for chinese_name, csv_id in sets:
        out = OUTPUT_SETS / f"{csv_id}.webp"
        if out.exists() and out.stat().st_size > 500:
            print(f"  [SKIP] [{csv_id}] {chinese_name} (exists)")
            success += 1
            continue

        hhw_set_id = set_name_map.get(chinese_name)
        if not hhw_set_id:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: no HHW set mapping")
            failed.append((chinese_name, csv_id, "no mapping"))
            continue

        url = HHW_SET_ICON.format(id=hhw_set_id)
        if await download_with_pw(page, url, out):
            size_kb = out.stat().st_size / 1024
            print(f"  [OK] [{csv_id}] {chinese_name} -> HHW:{hhw_set_id} ({size_kb:.1f}KB)")
            success += 1
        else:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: download failed")
            failed.append((chinese_name, csv_id, "download failed"))

        await asyncio.sleep(0.2)

    print(f"\n  OK: {success}/{len(sets)}")
    if failed:
        print(f"  FAIL: {len(failed)}")
        for name, cid, reason in failed:
            print(f"    - {name} ({cid}): {reason}")
    return success, failed


async def main():
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]

    print("ZZZ Drive Discs Analyzer - Playwright Image Downloader\n")

    OUTPUT_AGENTS.mkdir(parents=True, exist_ok=True)
    OUTPUT_SETS.mkdir(parents=True, exist_ok=True)

    agents = load_csv_agents()
    sets = load_csv_sets()
    agent_name_map = load_json(AGENT_NAME_MAP)
    set_name_map = load_json(SET_NAME_MAP)

    print(f"CSV agents: {len(agents)}")
    print(f"CSV sets: {len(sets)}")
    print(f"Name map: {len(agent_name_map)}")
    print(f"Set map: {len(set_name_map)}")

    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        print("\nLaunching browser (non-headless for CF verification)...")
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        print("Navigating to HHW...")
        await page.goto(f"{HHW_BASE}/", timeout=30000, wait_until="domcontentloaded")

        if not await wait_for_cf(page, timeout=120):
            print("Failed to pass Cloudflare. Please solve the CAPTCHA manually.")
            print("Waiting up to 120 more seconds...")
            if not await wait_for_cf(page, timeout=120):
                print("Giving up.")
                await browser.close()
                return

        hhw_map = await discover_hhw_ids(page)
        if not hhw_map:
            print("[ERROR] No agents found")
            await browser.close()
            return

        agent_ok, agent_fail = await download_agent_images(page, agents, agent_name_map, hhw_map)
        set_ok, set_fail = await download_set_images(page, sets, set_name_map)

        total_ok = agent_ok + set_ok
        total_fail = len(agent_fail) + len(set_fail)
        total = len(agents) + len(sets)

        print(f"\n{'='*50}")
        print(f"Done: {total_ok}/{total} OK, {total_fail} failed")
        print(f"  Agents: {agent_ok}/{len(agents)}")
        print(f"  Sets: {set_ok}/{len(sets)}")

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
