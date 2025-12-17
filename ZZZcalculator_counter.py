import pandas as pd
from typing import Dict, List, Set, Tuple
import itertools

def 反选主副词条():
    print("🚀 开始反选主副词条分析...")
    
    # 读取数据
    try:
        套装变量表 = pd.read_csv('zenlesszonezero1.csv')
        数据表 = pd.read_csv('zenlesszonezero.csv').fillna('')
        print(f"✓ 成功读取数据：{len(套装变量表)}个套装，{len(数据表)}条记录")
    except Exception as e:
        print(f"❌ 读取数据失败：{e}")
        return
    
    # 构建套装字典
    套装字典 = {}
    for _, row in 套装变量表.iterrows():
        套装名称 = row['套装变量']
        主属性 = {
            '1号位': row['1号位'],
            '2号位': row['2号位'],
            '3号位': row['3号位'],
            '4号位': row['4号位'],
            '5号位': row['5号位'],
            '6号位': row['6号位']
        }
        副属性 = row['副属性变量']
        套装字典[套装名称] = {
            '主属性': 主属性,
            '副属性': 副属性
        }
    
    # 收集所有可能的属性
    所有主属性 = {'4号位': set(), '5号位': set(), '6号位': set()}
    所有副属性 = set()
    
    # 从套装字典收集主属性
    for 套装信息 in 套装字典.values():
        for 位置, 属性值 in 套装信息['主属性'].items():
            if 位置 in 所有主属性 and pd.notna(属性值) and str(属性值).strip():
                所有主属性[位置].add(str(属性值))
        
        if pd.notna(套装信息['副属性']) and str(套装信息['副属性']).strip():
            所有副属性.add(str(套装信息['副属性']))
    
    # 从数据表收集实际出现的属性
    已出现组合 = {}
    
    for _, row in 数据表.iterrows():
        主套装 = row['主套装(×4)']
        辅套装 = row['辅套装(×2)']
        
        主属性_4号位 = str(row['4号位主属性']) if str(row['4号位主属性']) != '' else None
        主属性_5号位 = str(row['5号位主属性']) if str(row['5号位主属性']) != '' else None
        主属性_6号位 = str(row['6号位主属性']) if str(row['6号位主属性']) != '' else None
        
        高优先级副属性 = str(row['高优先级副属性']) if str(row['高优先级副属性']) != '' else None
        中优先级副属性 = str(row['中优先级副属性']) if str(row['中优先级副属性']) != '' else None
        正常优先级副属性 = str(row['正常优先级副属性']) if str(row['正常优先级副属性']) != '' else None
        低优先级副属性 = str(row['低优先级副属性']) if str(row['低优先级副属性']) != '' else None
        
        # 收集副属性
        for attr in [高优先级副属性, 中优先级副属性, 正常优先级副属性, 低优先级副属性]:
            if attr is not None and attr != '':
                所有副属性.add(attr)
        
        # 处理主套装
        for 套装 in [主套装, 辅套装]:
            if 套装 not in 已出现组合:
                已出现组合[套装] = {
                    '4号位': set(),
                    '5号位': set(),
                    '6号位': set(),
                    '副属性': set()
                }
            
            if 主属性_4号位:
                已出现组合[套装]['4号位'].add(主属性_4号位)
            if 主属性_5号位:
                已出现组合[套装]['5号位'].add(主属性_5号位)
            if 主属性_6号位:
                已出现组合[套装]['6号位'].add(主属性_6号位)
            
            副属性列表 = [attr for attr in [高优先级副属性, 中优先级副属性, 正常优先级副属性, 低优先级副属性] 
                          if attr is not None and attr != '']
            已出现组合[套装]['副属性'].update(副属性列表)
    
    # 反选分析 - 按原格式输出
    for 套装名称 in sorted(已出现组合.keys()):
        if not 套装名称 or pd.isna(套装名称):
            continue
            
        已出现 = 已出现组合[套装名称]
        
        # 反选主属性
        反选4号位 = sorted(所有主属性['4号位'] - 已出现['4号位'])
        反选5号位 = sorted(所有主属性['5号位'] - 已出现['5号位'])
        反选6号位 = sorted(所有主属性['6号位'] - 已出现['6号位'])
        反选副属性 = sorted(所有副属性 - 已出现['副属性'])
        
        # 按原格式输出
        print(f"{套装名称}: 4号位[{', '.join(反选4号位) if 反选4号位 else ''}];5号位[{', '.join(反选5号位) if 反选5号位 else ''}];6号位[{', '.join(反选6号位) if 反选6号位 else ''}];副属性[{', '.join(反选副属性) if 反选副属性 else ''}]")

if __name__ == "__main__":
    反选主副词条()