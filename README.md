# ZZZ-Set-Analyzer | 绝区零套装统计器（截至至仪玄版本）

| English | 中文 |
|---|---|
| **Overview** | **项目简介** |
| A lightweight Python script that reads two CSV files (`zenlesszonezero.csv` + `zenlesszonezero1.csv`) and aggregates the main-/sub-stats preferences for every Zenless Zone Zero gear set. | 一个轻量级 Python 脚本，读取两份 CSV 数据（`zenlesszonezero.csv` + `zenlesszonezero1.csv`），汇总《绝区零》每件套装的主属性 & 副属性偏好。 |
| **Features** | **特征** |
| - Auto-detect main stats for slots 4/5/6  <br> - Collect sub-stat priority lists  <br> - Output concise set summary to console  <br> - Zero third-party dependencies except `pandas` | - 自动统计 4、5、6 号位主属性 <br> - 收集高/中/低优先级副属性词条 <br> - 控制台一键输出汇总结果 <br> - 仅依赖 `pandas`，无其他第三方库 |
| **Quick Start** | **如何使用** |
| 1. Clone or pull the repo <br> 2. Place your two CSV files in the same folder <br> 3. `pip install -r requirements.txt`  (only pandas) <br> 4. `python ZZZcalculator.py` | 1. 克隆或拉取仓库 <br> 2. 将两份 CSV 放到同一目录 <br> 3. `pip install -r requirements.txt`（只有 pandas） <br> 4. `python ZZZcalculator.py` |