# ZZZ-Set-Analyzer | 绝区零套装统计器（同步至2.7版本「微光引灯时」）

| English | 中文 |
|---|---|
| **Overview** | **项目简介** |
| A lightweight Python toolkit that reads two CSV files (`zenlesszonezero.csv` + `zenlesszonezero1.csv`) and provides comprehensive analysis of main-/sub-stats preferences for every Zenless Zone Zero gear set. | 一个轻量级 Python 工具集，读取两份 CSV 数据（`zenlesszonezero.csv` + `zenlesszonezero1.csv`），提供《绝区零》每件套装的主属性 & 副属性偏好分析。 |
| **Features** | **特征** |
| - **Set Statistics** (`ZZZcalculator.py`): Aggregates main stats for slots 4/5/6 and sub-stat priorities<br> - **Inverse Analysis** (`ZZZcalculator_counter.py`): Identifies unused main/sub-stats for each set<br> - **Multi-option Support**: Automatically parses multi-choice stats (e.g., "暴击率/暴击伤害")<br> - **Agent Mapping**: Displays all agents that use each gear set<br> - **Clean Output**: Formatted console output with set summaries<br> - **Minimal Dependencies**: Only requires `pandas` | - **套装统计** (`ZZZcalculator.py`): 统计 4/5/6 号位主属性和副属性优先级<br> - **反选分析** (`ZZZcalculator_counter.py`): 识别每个套装未使用的主/副属性<br> - **多择支持**: 自动解析多择属性（如 "暴击率/暴击伤害"）<br> - **代理人映射**: 显示使用每件套装的所有代理人<br> - **清晰输出**: 格式化的控制台输出结果<br> - **最小依赖**: 仅依赖 `pandas` |
| **Quick Start** | **如何使用** |
| 1. Clone or pull this repo<br>2. Check `zenlesszonezero.csv` and `zenlesszonezero1.csv` in the project directory<br>3. Install dependencies: `pip install -r requirements.txt`<br>4. Run the tools:<br>   - `python ZZZcalculator.py` - View set statistics<br>   - `python ZZZcalculator_counter.py` - View inverse analysis | 1. 克隆或拉取仓库<br>2. 检查项目目录内的 `zenlesszonezero.csv` 和 `zenlesszonezero1.csv` <br>3. 安装依赖: `pip install -r requirements.txt`<br>4. 运行工具:<br>   - `python ZZZcalculator.py` - 查看套装统计<br>   - `python ZZZcalculator_counter.py` - 查看反选分析 |

## Output Examples | 输出示例

### Set Statistics (套装统计)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 套装属性统计结果（共23个套装）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 沧浪行歌 (叶瞬光)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  4号位: 暴击伤害 (1个)
  5号位: 物 (1个)
  6号位: 攻击力% (1个)
  副属性: 攻击力%, 穿透值, 暴击率, 暴击伤害 (4个)
```

### Inverse Analysis (反选分析)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 反选分析结果（共23个套装）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 沧浪行歌 (叶瞬光)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  4号位: 攻击力%, 暴击率, 生命值%, 防御力%, 异常精通 (5个)
  5号位: 攻击力%, 生命值%, 防御力%, 穿透率, 火, 冰, 电, 以太 (8个)
  6号位: 生命值%, 防御力%, 冲击力, 异常掌握, 能量自动回复 (5个)
  副属性: 生命值, 生命值%, 攻击力, 防御力, 防御力%, 异常精通 (6个)
```

## Web UI | 网页版界面

项目还包含一个基于 **TypeScript** 的网页版分析器，提供可视化界面。

### 快速开始

```bash
cd web-ui
npm install
npm run build
# 然后在浏览器中打开 index.html
```

### 开发命令

```bash
# 监听文件变化，自动重新编译
npm run watch

# 清理编译输出
npm run clean
```

### 架构设计

```
web-ui/
├── src/
│   ├── types.ts      # 类型定义 (Agent, SetStats, AnalysisMode等)
│   ├── data.ts       # 数据定义 (agentData, setVariables)
│   ├── utils.ts      # 工具函数
│   ├── analyzer.ts   # 分析逻辑
│   ├── renderer.ts   # 渲染逻辑
│   └── app.ts        # 主应用类
├── dist/             # 编译输出 (被git忽略)
└── index.html        # 入口页面
```

---

## File Structure | 文件结构

```
ZZZ_Drive_Discs_Analyzer/
├── zenlesszonezero.csv          # Agent gear configuration data
├── zenlesszonezero1.csv         # Gear set variables data
├── ZZZcalculator.py             # Set statistics tool
├── ZZZcalculator_counter.py     # Inverse analysis tool
├── requirements.txt             # Python dependencies
├── README.md                    # This file
└── web-ui/                      # Web interface (TypeScript)
    ├── src/                     # TypeScript source code
    └── index.html               # Entry page
```

## CSV Format | CSV 格式

### zenlesszonezero.csv
包含代理人装备偏好配置，包含以下列：

| Column Name | 说明 | Description |
|---|---|---|
| Agent | 代理人名称 | Agent name |
| id | 代理人ID | Agent ID |
| 主套装(×4) | 主套装（4件套）| Main set (4 pieces) |
| 辅套装(×2) | 辅套装（2件套）| Secondary set (2 pieces) |
| 4号位主属性 | 4号位主属性（支持 "/" 分隔的多择）| Slot 4 main stat (supports multi-choice with "/" separator) |
| 5号位主属性 | 5号位主属性（支持 "/" 分隔的多择）| Slot 5 main stat (supports multi-choice with "/" separator) |
| 6号位主属性 | 6号位主属性（支持 "/" 分隔的多择）| Slot 6 main stat (supports multi-choice with "/" separator) |
| 高优先级副属性 | 高优先级副属性 | High priority sub-stat |
| 中优先级副属性 | 中优先级副属性 | Medium priority sub-stat |
| 正常优先级副属性 | 正常优先级副属性 | Normal priority sub-stat |
| 低优先级副属性 | 低优先级副属性 | Low priority sub-stat |

### zenlesszonezero1.csv
包含套装变量定义，包括所有6个位置的主属性和副属性

| Column Name | 说明 | Description |
|---|---|---|
| 套装变量 | 套装名称 | Gear set name |
| id | 套装ID | Set ID |
| 1号位 | 1号位主属性（固定生命值）| Slot 1 main stat (fixed: Life) |
| 2号位 | 2号位主属性（固定攻击力）| Slot 2 main stat (fixed: ATK) |
| 3号位 | 3号位主属性（固定防御力）| Slot 3 main stat (fixed: DEF) |
| 4号位 | 4号位可选主属性 | Slot 4 available main stats |
| 5号位 | 5号位可选主属性 | Slot 5 available main stats |
| 6号位 | 6号位可选主属性 | Slot 6 available main stats |
| 副属性变量 | 套装副属性 | Set sub-stats |

## Notes | 说明

| English | 中文 |
|---|---|
| Multi-choice stats (e.g., "暴击率/暴击伤害") are automatically parsed as separate options | 多择属性（如 "暴击率/暴击伤害"）会自动拆分为独立选项 |
| Both tools display the list of agents that use each gear set | 两个工具都会显示使用每件套装的代理人列表 |
| Agents are sorted by ID in descending order for consistent ordering | 代理人按ID倒序排序，确保顺序一致 |
