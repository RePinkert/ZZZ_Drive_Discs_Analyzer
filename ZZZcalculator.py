import pandas as pd

def 统计套装属性():
    # 定义标准属性顺序
    标准属性顺序 = {
        '4号位': ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '异常精通'],
        '5号位': ['攻击力%', '生命值%', '防御力%', '穿透率', '物', '火', '冰', '电', '以太'],
        '6号位': ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '冲击力', '异常掌握', '能量自动回复'],
        '副属性': ['生命值', '生命值%', '攻击力', '攻击力%', '防御力', '防御力%', '穿透值', '暴击率', '暴击伤害', '异常精通']
    }
    
    def 按标准顺序排序(属性列表, 位置):
        排序后的列表 = []
        for 标准属性 in 标准属性顺序.get(位置, []):
            if 标准属性 in 属性列表:
                排序后的列表.append(标准属性)
        for 属性 in 属性列表:
            if 属性 not in 排序后的列表:
                排序后的列表.append(属性)
        return 排序后的列表
    
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
    

    # 多行格式化输出
    分隔线 = '━' * 60
    print(f"\n{分隔线}")
    print(f"📊 套装属性统计结果（共{len(套装统计)}个套装）")
    print(f"{分隔线}\n")
    
    for 套装名称, 属性 in 套装统计.items():
        placeholder4 = [attr for attr in [str(item) for item in 属性['4号位']] if attr != '']
        placeholder5 = [attr for attr in [str(item) for item in 属性['5号位']] if attr != '']
        placeholder6 = [attr for attr in [str(item) for item in 属性['6号位']] if attr != '']
        副属性列表 = [attr for attr in [str(item) for item in 属性['副属性']] if attr != '']
        
        # 按标准顺序排序
        placeholder4 = 按标准顺序排序(placeholder4, '4号位')
        placeholder5 = 按标准顺序排序(placeholder5, '5号位')
        placeholder6 = 按标准顺序排序(placeholder6, '6号位')
        副属性列表 = 按标准顺序排序(副属性列表, '副属性')
        
        # 多行格式化输出
        print(f"📦 {套装名称}")
        print(f"{分隔线}")
        print(f"  4号位: {', '.join(placeholder4) if placeholder4 else '无'} ({len(placeholder4)}个)")
        print(f"  5号位: {', '.join(placeholder5) if placeholder5 else '无'} ({len(placeholder5)}个)")
        print(f"  6号位: {', '.join(placeholder6) if placeholder6 else '无'} ({len(placeholder6)}个)")
        print(f"  副属性: {', '.join(副属性列表) if 副属性列表 else '无'} ({len(副属性列表)}个)")
        print()

统计套装属性()