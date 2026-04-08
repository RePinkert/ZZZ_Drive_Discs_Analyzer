<h1 align="center">ZZZ Drive Discs Analyzer</h1>
<h3 align="center">绝区零 · 驱动盘分析器</h3>
<p align="center">
<img src="https://img.shields.io/badge/版本-2.7-FF6B6B?style=flat-square" alt="version" />
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

## 项目启动

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
├── 📄 zenlesszonezero.csv          # 代理人配装数据 (56条)
├── 📄 zenlesszonezero1.csv         # 驱动盘变量表 (24套)
│
├── 🐍 ZZZcalculator.py             # 正向统计
├── 🐍 ZZZcalculator_counter.py     # 反选分析
├── 📋 requirements.txt             # pandas>=1.3.0
│
└── 🌐 web-ui/                      # TypeScript Web 界面
    ├── index.html
    ├── src/
    │   ├── app.ts / analyzer.ts / renderer.ts
    │   ├── data.ts / types.ts / utils.ts
    │   ├── components/   # agentCard, agentForm, confirmDialog
    │   ├── pages/        # statsPage, editPage
    │   ├── services/     # csvParser, fileService
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

### zenlesszonezero1.csv — 驱动盘属性池

| 列 | 内容 |
|---|---|
| 套装变量 | 套装名 |
| 1-3号位 | 固定（生命/攻击/防御） |
| 4-6号位 | 可选主属性 |
| 副属性变量 | 全部可用副属性 |

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
