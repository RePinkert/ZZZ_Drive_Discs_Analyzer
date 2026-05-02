<h1 align="center">ZZZ Drive Discs Analyzer</h1>
<h3 align="center">绝区零 · 驱动盘分析器</h3>
<p align="center">
<img src="https://img.shields.io/badge/版本-2.7.1-FF6B6B?style=flat-square" alt="version" />
<img src="https://img.shields.io/badge/英雄不死于往昔-FF6B6B?style=flat-square" alt="ver-name" />
<img src="https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python" alt="python" />
<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="typescript" />
<img src="https://img.shields.io/badge/代理人-56-FFD93D?style=flat-square" alt="agents" />
<img src="https://img.shields.io/badge/驱动盘套装-24-6BCB77?style=flat-square" alt="sets" />
</p>

---

## 这个工具做什么

读取《绝区零》全代理人驱动盘配置数据，回答两个核心问题：

> **"这套驱动盘，大家都在怎么用？"** — 正向统计
>
> **"这套驱动盘，哪些属性根本没人选？"** — 反选分析

## 更新日志

### v2.7.1 - 2026-04-12

**桌面应用：**
- 首个桌面版发布，[下载 `ZZZ驱动盘分析器.exe`](https://github.com/RePinkert/ZZZ_Drive_Discs_Analyzer/releases/tag/v2.7.1)

**修复：**
- 修复反选分析中6号位显示不存在的暴击伤害/暴击率主词条
- 修复 CSV 属性加载因 HTTP 404 未正确降级的问题（`fetch` 不抛异常导致 fallback 路径永远不触发）
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

支持 Web 界面（正在开发中）：

```bash
cd web-ui
npm install && npm run build
# 然后浏览器打开 index.html
```

## 构建 exe

运行 `build_exe.bat`，自动完成 TypeScript 编译 + PyInstaller 打包，生成单文件 `ZZZ驱动盘分析器.exe`。

构建依赖：`pyinstaller`、`pywebview`、`Node.js`（脚本会自动检查并安装 Python 包）。

## 工具总览

### Python CLI

| 工具 | 文件 | 做什么 | 适合谁 |
|---|---|---|---|
| 正向统计 | `ZZZcalculator.py` | 聚合每套驱动盘的主属性选择与副属性优先级 | 想知道主流配装的人 |
| 反选分析 | `ZZZcalculator_counter.py` | 找出每套驱动盘中被忽略的属性 | 想寻找冷门搭配的人 |

两者均支持 `/` 分隔的多择属性自动拆分，并附带使用该套装的代理人列表。

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
├── 📄 zenlesszonezero.csv          # 代理人配装数据 (56条)
├── 📄 set_registry.csv             # 套装注册表 (24套)
├── 📄 slot_attributes.csv          # 属性池
│
├── 🐍 ZZZcalculator.py             # 正向统计
├── 🐍 ZZZcalculator_counter.py     # 反选分析
├── 🚀 launcher.py                  # 桌面应用入口
├── 🔧 build_exe.bat                # exe 构建脚本
├── 📋 requirements.txt             # pandas>=1.3.0
│
└── 🌐 web-ui/                      # TypeScript Web 界面
    ├── index.html
    ├── src/
    │   ├── app.ts / analyzer.ts / renderer.ts
    │   ├── data.ts / types.ts / utils.ts
    │   ├── components/   # agentCard, agentForm, confirmDialog
    │   ├── pages/        # statsPage, editPage
    │   ├── services/     # csvParser, fileService, setVariablesLoader
    │   └── state/        # store
    └── dist/
```

## 数据格式

### zenlesszonezero.csv — 代理人配装

| 列 | 内容 | 示例 |
|---|---|---|
| Agent | 代理人名称 | 艾莲 |
| id | 编号 | 101 |
| 主套装(×4) | 4件套 | 云岿如我 |
| 辅套装(×2) | 2件套 | 折枝剑歌 |
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
npm run build         # 编译
npm run watch         # 监听模式（开发用）
npm run clean         # 清理编译输出
```

---

<p align="center">
<i>《绝区零》2.7版本 · 英雄不死于往昔</i>
</p>
