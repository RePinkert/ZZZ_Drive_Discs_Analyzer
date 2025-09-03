import pandas as pd

def 统计套装属性():
    # 读取zenlesszonezero1.csv文件
    套装变量表 = pd.read_csv('zenlesszonezero1.csv')
    套装字典 = {}
    
    # 构建套装字典，存储每个套装的主属性和副属性
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
    
    # 读取zenlesszonezero.csv文件
    数据表 = pd.read_csv('zenlesszonezero.csv')
    
    # 填充空值，避免出现NaN值
    数据表 = 数据表.fillna('')
    
    # 按Agent分组，统计每个Agent的主副属性
    套装统计 = {}
    for _, row in 数据表.iterrows():
        主套装 = row['主套装(×4)']
        辅套装 = row['辅套装(×2)']
        
        主属性_4号位 = row['4号位主属性']
        主属性_5号位 = row['5号位主属性']
        主属性_6号位 = row['6号位主属性']
        
        高优先级副属性 = row['高优先级副属性']
        中优先级副属性 = row['中优先级副属性']
        正常优先级副属性 = row['正常优先级副属性']
        低优先级副属性 = row['低优先级副属性']
        
        # 统计主套装的主属性和副属性
        if 主套装 not in 套装统计:
            套装统计[主套装] = {
                '4号位': set(),
                '5号位': set(),
                '6号位': set(),
                '副属性': set()
            }
        
        套装统计[主套装]['4号位'].add(主属性_4号位)
        套装统计[主套装]['5号位'].add(主属性_5号位)
        套装统计[主套装]['6号位'].add(主属性_6号位)
        
        副属性列表 = [
            str(高优先级副属性) if str(高优先级副属性) != '' else None,
            str(中优先级副属性) if str(中优先级副属性) != '' else None,
            str(正常优先级副属性) if str(正常优先级副属性) != '' else None,
            str(低优先级副属性) if str(低优先级副属性) != '' else None
        ]
        套装统计[主套装]['副属性'].update([attr for attr in 副属性列表 if attr is not None])
        
        if 辅套装 not in 套装统计:
            套装统计[辅套装] = {
                '4号位': set(),
                '5号位': set(),
                '6号位': set(),
                '副属性': set()
            }
        
        套装统计[辅套装]['4号位'].add(主属性_4号位)
        套装统计[辅套装]['5号位'].add(主属性_5号位)
        套装统计[辅套装]['6号位'].add(主属性_6号位)
        套装统计[辅套装]['副属性'].update([attr for attr in 副属性列表 if attr is not None])
    

    for 套装名称, 属性 in 套装统计.items():

        placeholder4 = [str(item) for item in 属性['4号位']]
        placeholder5 = [str(item) for item in 属性['5号位']]
        placeholder6 = [str(item) for item in 属性['6号位']]
        副属性列表 = [str(item) for item in 属性['副属性']]
        
        placeholder4 = [attr for attr in placeholder4 if attr != '']
        placeholder5 = [attr for attr in placeholder5 if attr != '']
        placeholder6 = [attr for attr in placeholder6 if attr != '']
        副属性列表 = [attr for attr in 副属性列表 if attr != '']
        
        print(f"{套装名称}: 4号位[{', '.join(placeholder4)}];5号位[{', '.join(placeholder5)}];6号位[{', '.join(placeholder6)}];副属性[{', '.join(副属性列表)}]")

统计套装属性()