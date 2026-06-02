"""
ZZZ Drive Discs Analyzer - 图片下载脚本

从 HoneyHunterWorld CDN 下载代理人头像和套装图标。
图片按 CSV ID 命名，保存到 web-ui/assets/ 目录。

用法：
    python scripts/download_images.py

依赖：
    pip install requests
"""

import csv
import html
import json
import re
import sys
import time
from pathlib import Path

import requests

# ── 路径配置 ──────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

CSV_AGENTS = PROJECT_ROOT / "web-ui" / "zenlesszonezero.csv"
CSV_SETS = PROJECT_ROOT / "web-ui" / "set_registry.csv"
AGENT_NAME_MAP = SCRIPT_DIR / "agent_name_map.json"
SET_NAME_MAP = SCRIPT_DIR / "set_name_map.json"

OUTPUT_AGENTS = PROJECT_ROOT / "web-ui" / "assets" / "agents"
OUTPUT_SETS = PROJECT_ROOT / "web-ui" / "assets" / "sets"

# HHW CDN
HHW_BASE = "https://zzz.honeyhunterworld.com"
HHW_AGENT_ICON = f"{HHW_BASE}/img/character/{{id}}-char_icon_100.webp"
HHW_SET_ICON = f"{HHW_BASE}/img/art_set/{{id}}-art_set_icon_35.webp"
HHW_CHAR_PAGE = f"{HHW_BASE}/{{id}}-char/"

# HHW 角色ID范围
HHW_AGENT_ID_MIN = 1001
HHW_AGENT_ID_MAX = 2000

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Referer": HHW_BASE,
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
})


def load_csv_agents():
    """加载 CSV 中的代理人数据，返回 [(chinese_name, csv_id), ...]"""
    agents = []
    with open(CSV_AGENTS, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["Agent"].strip()
            csv_id = int(row["id"].strip())
            agents.append((name, csv_id))
    return agents


def load_csv_sets():
    """加载 CSV 中的套装数据，返回 [(chinese_name, csv_id), ...]"""
    sets = []
    with open(CSV_SETS, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["set"].strip()
            csv_id = int(row["id"].strip())
            sets.append((name, csv_id))
    return sets


def load_json(path):
    """加载 JSON 文件"""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def discover_hhw_agent_ids(agent_name_map):
    """
    遍历 HHW 角色页面，发现英文名 → HHW ID 映射。
    返回 {english_name_normalized: hhw_id}
    """
    print("=== 阶段 1：发现 HHW 角色 ID ===")
    hhw_map = {}  # normalized_english_name -> hhw_id

    # HHW 角色 ID 模式：每 10 递增（1011, 1021, 1031, ...），只扫描末位为 1 的 ID
    for hhw_id in range(HHW_AGENT_ID_MIN, HHW_AGENT_ID_MAX + 1, 10):
        url = HHW_CHAR_PAGE.format(id=hhw_id)
        try:
            resp = SESSION.get(url, timeout=10, allow_redirects=True)
            if resp.status_code != 200:
                continue

            # 从 <title> 提取角色英文名
            title_match = re.search(r"<title>(.*?)</title>", resp.text, re.IGNORECASE)
            if not title_match:
                continue

            title = html.unescape(title_match.group(1).strip())
            # HHW 标题格式通常为 "Koleda - Zenless Zone Zero | HoneyHunterWorld"
            # 或 "Koleda | ZZZ"
            name = re.split(r"\s*[-|]\s*", title)[0].strip()

            # 过滤无效条目
            if name and name not in ("Zenless Zone Zero", "HoneyHunterWorld", "ZZZ",
                                      "What's New", "What&#8217;s New", "..."):
                hhw_map[name.lower()] = hhw_id
                print(f"  [{hhw_id}] {name}")

        except requests.RequestException:
            continue

        # 限速：避免对 HHW 造成压力
        time.sleep(0.3)

    print(f"  共发现 {len(hhw_map)} 个 HHW 角色")
    return hhw_map


def match_agent_hhw_id(chinese_name, english_name, hhw_map):
    """
    尝试将中文名对应的英文名匹配到 HHW ID。
    策略：完整匹配 → 首词匹配 → 前缀匹配 → 包含匹配。
    """
    key = english_name.lower()

    # 1. 完整匹配
    if key in hhw_map:
        return hhw_map[key]

    # 2. 首词匹配（如 "Koleda Belobog" → "koleda"）
    first_word = key.split()[0]
    if first_word in hhw_map:
        return hhw_map[first_word]

    # 3. 前缀/后缀匹配
    for hhw_name, hhw_id in hhw_map.items():
        if key.startswith(hhw_name) or hhw_name.startswith(key):
            return hhw_id
        # 后缀匹配（如 "Fufu" 匹配 "Ju Fufu"）
        if hhw_name.endswith(" " + key) or key.endswith(" " + hhw_name):
            return hhw_id

    # 4. 包含匹配
    for hhw_name, hhw_id in hhw_map.items():
        if key in hhw_name or hhw_name in key:
            return hhw_id

    return None


def download_image(url, output_path):
    """下载图片到指定路径"""
    try:
        resp = SESSION.get(url, timeout=15)
        if resp.status_code == 200 and len(resp.content) > 100:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(resp.content)
            return True
    except requests.RequestException:
        pass
    return False


def download_agent_images(agents, agent_name_map, hhw_map):
    """下载所有代理人头像"""
    print(f"\n=== 阶段 2：下载代理人头像（{len(agents)} 张）===")
    success = 0
    failed = []

    for chinese_name, csv_id in agents:
        english_name = agent_name_map.get(chinese_name)
        if not english_name:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: no english name mapping")
            failed.append((chinese_name, csv_id, "无英文名映射"))
            continue

        hhw_id = match_agent_hhw_id(chinese_name, english_name, hhw_map)
        if not hhw_id:
            print(f"  [FAIL] [{csv_id}] {chinese_name} ({english_name}): no HHW ID match")
            failed.append((chinese_name, csv_id, "未匹配到 HHW ID"))
            continue

        url = HHW_AGENT_ICON.format(id=hhw_id)
        output = OUTPUT_AGENTS / f"{csv_id}.webp"

        if download_image(url, output):
            size_kb = output.stat().st_size / 1024
            print(f"  [OK] [{csv_id}] {chinese_name} -> HHW:{hhw_id} ({size_kb:.1f}KB)")
            success += 1
        else:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: download failed")
            failed.append((chinese_name, csv_id, "download failed"))

        time.sleep(0.2)

    print(f"\n  OK: {success}/{len(agents)}")
    if failed:
        print(f"  FAIL: {len(failed)}")
        for name, csv_id, reason in failed:
            print(f"    - {name} (ID:{csv_id}): {reason}")
    return success, failed


def download_set_images(sets, set_name_map):
    """下载所有套装图标"""
    print(f"\n=== Phase 3: Download set icons ({len(sets)}) ===")
    success = 0
    failed = []

    for chinese_name, csv_id in sets:
        hhw_set_id = set_name_map.get(chinese_name)
        if not hhw_set_id:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: no HHW set ID")
            failed.append((chinese_name, csv_id, "no mapping"))
            continue

        url = HHW_SET_ICON.format(id=hhw_set_id)
        output = OUTPUT_SETS / f"{csv_id}.webp"

        if download_image(url, output):
            size_kb = output.stat().st_size / 1024
            print(f"  [OK] [{csv_id}] {chinese_name} -> HHW:{hhw_set_id} ({size_kb:.1f}KB)")
            success += 1
        else:
            print(f"  [FAIL] [{csv_id}] {chinese_name}: download failed")
            failed.append((chinese_name, csv_id, "download failed"))

        time.sleep(0.2)

    print(f"\n  成功: {success}/{len(sets)}")
    if failed:
        print(f"  失败: {len(failed)}")
        for name, csv_id, reason in failed:
            print(f"    - {name} (ID:{csv_id}): {reason}")
    return success, failed


def main():
    # 强制 UTF-8 输出（Windows 默认 GBK 会报错）
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]

    print("ZZZ Drive Discs Analyzer - Image Downloader\n")

    # 确保输出目录存在
    OUTPUT_AGENTS.mkdir(parents=True, exist_ok=True)
    OUTPUT_SETS.mkdir(parents=True, exist_ok=True)

    # 加载数据
    agents = load_csv_agents()
    sets = load_csv_sets()
    agent_name_map = load_json(AGENT_NAME_MAP)
    set_name_map = load_json(SET_NAME_MAP)

    print(f"CSV 代理人: {len(agents)} 条")
    print(f"CSV 套装: {len(sets)} 条")
    print(f"英文名映射: {len(agent_name_map)} 条")
    print(f"套装 HHW ID 映射: {len(set_name_map)} 条")

    # 阶段 1: 发现 HHW 角色 ID
    hhw_map = discover_hhw_agent_ids(agent_name_map)

    if not hhw_map:
        print("[ERROR] No HHW characters found. Check network connection.")
        sys.exit(1)

    # 阶段 2: 下载代理人头像
    agent_ok, agent_fail = download_agent_images(agents, agent_name_map, hhw_map)

    # 阶段 3: 下载套装图标
    set_ok, set_fail = download_set_images(sets, set_name_map)

    # 汇总
    total_ok = agent_ok + set_ok
    total_fail = len(agent_fail) + len(set_fail)
    total = len(agents) + len(sets)

    print(f"\n{'='*50}")
    print(f"下载完成: {total_ok}/{total} 成功, {total_fail} 失败")
    print(f"  代理人: {agent_ok}/{len(agents)}")
    print(f"  套装: {set_ok}/{len(sets)}")
    print("\n输出目录:")
    print(f"  {OUTPUT_AGENTS}")
    print(f"  {OUTPUT_SETS}")


if __name__ == "__main__":
    main()
