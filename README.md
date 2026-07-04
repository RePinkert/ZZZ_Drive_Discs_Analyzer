<h1 align="center">ZZZ Drive Discs Analyzer</h1>
<h3 align="center">绝区零 · 驱动盘分析器</h3>

> **本项目已归档（Archived）**
>
> 米哈游官方已在《绝区零》新版本推出[智能弃置](https://www.miyoushe.com/zzz/article/76052772)功能，
> 该功能在游戏内直接为玩家推荐应保留/弃置的驱动盘词条，
> **本工具的核心价值已被官方功能覆盖，不再积极维护**。
>
> 当前可访问内容：Web UI 仍可浏览历史数据（截至 v3.0）；
> 后续将转型为 OCR 扫描 + 多代理横向比较工具，新方向待定。

<p align="center">
<img src="https://img.shields.io/badge/版本-3.0.0_Archived-FF6B6B?style=flat-square" alt="version" />
<img src="https://img.shields.io/badge/某个梦游者的自白-FF6B6B?style=flat-square" alt="ver-name" />
<img src="https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python" alt="python" />
<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="typescript" />
<img src="https://img.shields.io/badge/代理人-55-FFD93D?style=flat-square" alt="agents" />
<img src="https://img.shields.io/badge/驱动盘套装-28-6BCB77?style=flat-square" alt="sets" />
</p>

---

## 这个工具做什么

读取《绝区零》全代理人驱动盘配置数据，回答两个核心问题：

> **"这套驱动盘，大家都在怎么用？"** — 正向统计
>
> **"这套驱动盘，哪些属性根本没人选？"** — 反选分析

## 更新日志

### v3.0.0 (Archived) - 2026-07-04

**状态变更：**
- 项目标记为 Archived。米游社官方推出[智能弃置](https://www.miyoushe.com/zzz/article/76052772)功能，
  本工具核心价值（反选分析）已被官方功能覆盖。

**数据更新（v3.0）：**
- 新增 2 名代理人：维琳娜（风·异常）、佩洛伊斯（以太·强攻），共 55 名
- 新增 2 套驱动盘：呼啸沙龙、拂晓行纪，共 28 套
- 新增 slot5 属性：风（v3.0 新元素）
- 数据源：米游社 v3.0 版本公告

### v2.8.0 - 2026-06-02

**数据更新（v2.8）：**
- 新增 3 名代理人：星徽·比利·奇德、普罗米娅、希希芙（共 53 名）
- 新增 2 套驱动盘：囚徒手记、雪兔梦游仙境（共 26 套）

**图片资源：**
- 全量替换 79 张图片（53 代理人头像 + 26 套装图标），来源统一为米游社百科
- 代理人头像统一为 102×100 RGB webp，套装图标统一为 35×35 RGB webp

**代码质量：**
- 移除全部死代码（未使用的 Proxy 导出、未使用的变量和导入）
- 修复 `store.deleteAgent` 脏标记逻辑缺陷（删除新增代理人后错误清除已编辑的脏标记）
- 修复 `csvParser` 未校验 CSV header 和无效 ID 的问题
- 修复 `imageService` 返回空字符串导致页面发送错误请求的问题
- 优化 `setVariablesLoader` 消除重复的 `set_registry.csv` 网络请求
- 修复全部 Pylance 类型诊断（`sys._MEIPASS`、`reconfigure`、`Series.__bool__`）
- 修复全部 ruff lint 警告（未使用导入、多余 f-string 前缀等）

**脚本：**
- 新增 `scripts/download_images_baike.py`：基于 Playwright 的米游社百科图片下载器，支持全量/缺失模式
- 更新 `scripts/agent_name_map.json`、`scripts/set_name_map.json` 映射表

### v2.7.1 - 2026-04-12

- 首个桌面版发布
- 修复反选分析中6号位显示不存在的暴击伤害/暴击率主词条
- 修复 CSV 属性加载因 HTTP 404 未正确降级的问题
- 修复打包后 exe 资源路径未指向 `_MEIPASS` 导致无法加载 CSV 和 web-ui 文件

## 项目启动

### 桌面应用（推荐）

[**⬇ 下载最新版本**](https://github.com/RePinkert/ZZZ_Drive_Discs_Analyzer/releases/latest)，双击 `ZZZ驱动盘分析器.exe` 即可运行。基于 pywebview 的原生窗口，无需安装任何依赖。

### 命令行工具

```bash
git clone <repo-url> && cd ZZZ_Drive_Discs_Analyzer
pip install pandas                    # 唯一依赖
python ZZZcalculator.py               # 正向统计
python ZZZcalculator_counter.py       # 反选分析
```

支持 Web 界面：

```bash
cd web-ui
npm install
npm run dev          # 启动本地服务器 → http://localhost:3000
```

## 构建 exe

运行 `build_exe.bat`，自动完成 TypeScript 编译 + PyInstaller 打包，生成单文件 `ZZZ驱动盘分析器.exe`。

构建依赖：`pyinstaller`、`pywebview`、`Node.js`（脚本会自动检查并安装 Python 包）。

## 工具总览

### Python CLI

| 工具 | 文件 | 做什么 | 适合谁 |
|---|---|---|---|
| 正向统计 | `ZZZcalculator.py` | 锁定每套驱动盘被使用过的主、副词条 | 想知道该留哪些词条的人 |
| 反选分析 | `ZZZcalculator_counter.py` | 找出每套驱动盘中无人使用的弃用词条 | 想知道该弃哪些词条的人 |

两者均支持 `/` 分隔的多择属性自动拆分，并附带使用该套装的代理人列表。

### 图片下载脚本

| 脚本 | 说明 |
|---|---|
| `scripts/download_images_baike.py` | 从米游社百科下载图片（推荐），依赖 Playwright + Pillow |
| `scripts/download_images.py` | 从 HoneyHunterWorld 下载（已弃用，Cloudflare 阻止） |
| `scripts/download_images_pw.py` | HHW Playwright 版（已弃用） |

### Web UI

基于 TypeScript 的浏览器端应用，无需服务器。

- 统计 / 反选双模式一键切换
- 代理人配置的在线编辑（新增、修改、删除）
- CSV 文件导入 / 导出
- 深色主题、响应式布局

## 项目结构

```
ZZZ_Drive_Discs_Analyzer/
│
├── 📦 ZZZ驱动盘分析器.exe          # 桌面应用（见 [Releases](https://github.com/RePinkert/ZZZ_Drive_Discs_Analyzer/releases/latest)）
├── 📄 zenlesszonezero.csv          # 代理人配装数据 (53条)
├── 📄 set_registry.csv             # 套装注册表 (26套)
├── 📄 slot_attributes.csv          # 属性池
│
├── 🐍 ZZZcalculator.py             # 正向统计
├── 🐍 ZZZcalculator_counter.py     # 反选分析
├── 🚀 launcher.py                  # 桌面应用入口
├── 🔧 build_exe.bat                # exe 构建脚本
├── 📋 requirements.txt             # pandas>=1.3.0
│
├── 📂 scripts/                     # 图片下载脚本 + 映射表
│   ├── download_images_baike.py    # 米游社百科下载器（推荐）
│   ├── download_images.py          # HHW 下载器（弃用）
│   ├── download_images_pw.py       # HHW Playwright 版（弃用）
│   ├── agent_name_map.json         # 代理人名称映射
│   └── set_name_map.json           # 套装名称映射
│
└── 🌐 web-ui/                      # TypeScript Web 界面
    ├── index.html
    ├── assets/
    │   ├── agents/      # 代理人头像 (102×100 webp)
    │   └── sets/        # 套装图标 (35×35 webp)
    ├── src/
    │   ├── app.ts / analyzer.ts / renderer.ts
    │   ├── data.ts / types.ts / utils.ts
    │   ├── components/   # agentCard, agentForm, confirmDialog, toast
    │   ├── pages/        # statsPage, editPage
    │   ├── services/     # csvParser, fileService, imageService, setVariablesLoader
    │   └── state/        # store
    └── dist/
```

## 数据格式

### zenlesszonezero.csv — 代理人配装

| 列 | 内容 | 示例 |
|---|---|---|
| Agent | 代理人名称 | 艾莲 |
| id | 编号 | 317 |
| 主套装(×4) | 4件套 | 极地重金属 |
| 辅套装(×2) | 2件套 | 啄木鸟电音 |
| 4/5/6号位主属性 | 可多择 `/` | 暴击率/暴击伤害 |
| 四级副属性 | 高→低优先级 | 穿透值, 暴击率, ⋯ |

### set_registry.csv — 套装注册表

| 列 | 内容 |
|---|---|
| set | 套装名称 |
| id | 套装编号 |

### slot_attributes.csv — 属性池

| 列 | 内容 |
|---|---|
| slot | 槽位（slot4/slot5/slot6/subStats） |
| attribute | 可用属性 |

**数据说明**：`slot_attributes.csv` 以长格式列出每个槽位所有可能的属性值，无空值、无歧义。`set_registry.csv` 记录所有套装名称与编号的映射。

## Web UI 开发

```bash
cd web-ui
npm install           # 安装依赖
npm run dev           # 启动本地开发服务器 (http://localhost:3000)
npm run build         # 编译 TypeScript
npm run watch         # 监听模式（开发用）
npm run clean         # 清理编译输出
```

---

## 致谢 (Acknowledgments)

本项目作为非商业开源工具，离不开以下社区资源的支持。

### 数据与图片来源

- **[米游社 (miyoushe.com)](https://www.miyoushe.com/)** — 官方社区平台，提供游戏版本公告
- **[米游社百科 (baike.mihoyo.com)](https://baike.mihoyo.com/)** — 代理人头像、驱动盘套装图标
- **《绝区零》(Zenless Zone Zero) — [miHoYo / HoYoverse](https://www.hoyoverse.com/)** — 原始游戏数据与角色信息

### 字体

- **[ZZZ System Regular](https://github.com/SpeedyOrc-C/HoYo-Glyphs)** — 由 [SpeedyOrc-C](https://github.com/SpeedyOrc-C) 维护的 [HoYo-Glyphs](https://github.com/SpeedyOrc-C/HoYo-Glyphs) 项目（release `20250529`）。该字体为 **non-commercial license**，仅用于本项目"Disc Analyzer"标题渲染。完整许可证见 [原仓库 LICENSE](https://github.com/SpeedyOrc-C/HoYo-Glyphs/blob/main/LICENSE)。

### 部署

- **[Netlify](https://www.netlify.com/)** — 静态站点托管（免费层）

### 特别感谢

- 提供反馈的绝区零玩家社区
- 米游社百科长期维护者

---

<p align="center">
<i>《绝区零》v3.0 · 某个梦游者的自白 (Archived)</i>
</p>
