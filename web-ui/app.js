// 绝区零驱动盘分析器 - 核心逻辑

// 原始数据（从CSV转换）
const agentData = [
    { agent: "叶瞬光", id: 1687, mainSet: "沧浪行歌", subSet: "折枝剑歌", slot4: "暴击伤害", slot5: "物", slot6: "攻击力%", subHigh: "暴击伤害", subMid: "攻击力%", subNormal: "暴击率", subLow: "穿透值" },
    { agent: "照", id: 1686, mainSet: "静听嘉音", subSet: "云岿如我", slot4: "生命值%", slot5: "生命值%", slot6: "生命值%/能量自动回复", subHigh: "生命值%", subMid: "生命值", subNormal: "", subLow: "" },
    { agent: "般岳", id: 1626, mainSet: "云岿如我", subSet: "折枝剑歌", slot4: "暴击率", slot5: "火", slot6: "生命值%", subHigh: "生命值%", subMid: "暴击率", subNormal: "暴击伤害", subLow: "" },
    { agent: "琉音", id: 1624, mainSet: "山大王", subSet: "啄木鸟电音", slot4: "暴击率", slot5: "攻击力%", slot6: "能量自动回复", subHigh: "暴击率", subMid: "攻击力%", subNormal: "暴击伤害", subLow: "" },
    { agent: "伊德海莉", id: 1538, mainSet: "云岿如我", subSet: "折枝剑歌", slot4: "暴击率/暴击伤害", slot5: "冰/生命值%", slot6: "生命值%", subHigh: "生命值%", subMid: "暴击率", subNormal: "暴击伤害", subLow: "" },
    { agent: "真斗", id: 1536, mainSet: "云岿如我", subSet: "折枝剑歌", slot4: "暴击率/暴击伤害", slot5: "火", slot6: "生命值%", subHigh: "暴击伤害", subMid: "暴击率", subNormal: "生命值%", subLow: "攻击力%" },
    { agent: "卢西娅", id: 1533, mainSet: "月光骑士颂", subSet: "云岿如我", slot4: "生命值%", slot5: "生命值%", slot6: "生命值%", subHigh: "生命值%", subMid: "暴击伤害", subNormal: "生命值%", subLow: "" },
    { agent: "奥菲丝&「鬼火」", id: 1501, mainSet: "如影相随", subSet: "月光骑士颂", slot4: "暴击伤害", slot5: "火", slot6: "能量自动回复", subHigh: "暴击伤害", subMid: "暴击率", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "席德", id: 1499, mainSet: "拂晓生花", subSet: "啄木鸟电音", slot4: "暴击率", slot5: "电", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "攻击力" },
    { agent: "柚叶", id: 1386, mainSet: "摇摆爵士", subSet: "法厄同之歌", slot4: "攻击力%/异常精通", slot5: "攻击力%", slot6: "异常掌握", subHigh: "攻击力%", subMid: "异常精通", subNormal: "暴击伤害", subLow: "暴击率" },
    { agent: "爱丽丝", id: 1385, mainSet: "獠牙重金属", subSet: "法厄同之歌", slot4: "异常精通", slot5: "物", slot6: "异常掌握", subHigh: "异常精通", subMid: "攻击力%", subNormal: "暴击伤害", subLow: "攻击力" },
    { agent: "橘福福", id: 1301, mainSet: "山大王", subSet: "激素朋克", slot4: "攻击力%", slot5: "攻击力%", slot6: "攻击力%", subHigh: "攻击力%", subMid: "暴击率", subNormal: "暴击伤害", subLow: "攻击力" },
    { agent: "潘引壶", id: 1300, mainSet: "静听嘉音", subSet: "摇摆爵士", slot4: "攻击力%", slot5: "攻击力%", slot6: "能量自动回复/冲击力", subHigh: "攻击力%", subMid: "攻击力", subNormal: "暴击率", subLow: "暴击伤害" },
    { agent: "仪玄", id: 1299, mainSet: "云岿如我", subSet: "啄木鸟电音", slot4: "暴击伤害/暴击率", slot5: "以太/生命值%", slot6: "生命值%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "生命值%", subLow: "攻击力%" },
    { agent: "雨果", id: 1290, mainSet: "激素朋克", subSet: "啄木鸟电音", slot4: "暴击伤害/暴击率", slot5: "冰/攻击力%", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "" },
    { agent: "薇薇安", id: 1276, mainSet: "法厄同之歌", subSet: "自由蓝调", slot4: "异常精通", slot5: "以太", slot6: "异常掌握/能量自动回复", subHigh: "异常精通", subMid: "攻击力%", subNormal: "穿透值", subLow: "" },
    { agent: "扳机", id: 1230, mainSet: "如影相随", subSet: "啄木鸟电音", slot4: "暴击率", slot5: "电/穿透率", slot6: "冲击力", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "波可娜", id: 1191, mainSet: "如影相随", subSet: "震星迪斯科", slot4: "暴击率", slot5: "物", slot6: "冲击力", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "零号·安比", id: 1190, mainSet: "如影相随", subSet: "折枝剑歌", slot4: "暴击率/暴击伤害", slot5: "电/攻击力%", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "伊芙琳", id: 1158, mainSet: "啄木鸟电音", subSet: "折枝剑歌", slot4: "暴击伤害/攻击力%", slot5: "火/攻击力%", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "耀嘉音", id: 1109, mainSet: "静听嘉音", subSet: "摇摆爵士", slot4: "攻击力%", slot5: "攻击力%", slot6: "能量自动回复", subHigh: "攻击力%", subMid: "暴击率", subNormal: "暴击伤害", subLow: "攻击力" },
    { agent: "悠真", id: 997, mainSet: "啄木鸟电音", subSet: "折枝剑歌", slot4: "暴击率/暴击伤害", slot5: "电/穿透率", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "雅", id: 996, mainSet: "折枝剑歌", subSet: "啄木鸟电音", slot4: "暴击率/暴击伤害", slot5: "冰/穿透率", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "莱特", id: 950, mainSet: "震星迪斯科", subSet: "摇摆爵士", slot4: "暴击率", slot5: "火", slot6: "冲击力", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "" },
    { agent: "柳", id: 916, mainSet: "混沌爵士", subSet: "自由蓝调", slot4: "异常精通", slot5: "穿透率/电", slot6: "异常掌握/攻击力%", subHigh: "异常精通", subMid: "攻击力%", subNormal: "穿透值", subLow: "攻击力" },
    { agent: "柏妮思", id: 840, mainSet: "混沌爵士", subSet: "摇摆爵士", slot4: "异常精通", slot5: "火", slot6: "异常掌握/能量自动回复", subHigh: "异常精通", subMid: "攻击力%", subNormal: "暴击率", subLow: "暴击伤害" },
    { agent: "凯撒", id: 801, mainSet: "原始朋克", subSet: "震星迪斯科", slot4: "暴击率", slot5: "物", slot6: "冲击力", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "" },
    { agent: "简", id: 759, mainSet: "獠牙重金属", subSet: "自由蓝调", slot4: "异常精通", slot5: "物", slot6: "异常掌握", subHigh: "异常精通", subMid: "攻击力%", subNormal: "穿透值", subLow: "暴击率" },
    { agent: "赛斯", id: 758, mainSet: "摇摆爵士", subSet: "激素朋克", slot4: "异常精通", slot5: "攻击力%", slot6: "能量自动回复", subHigh: "攻击力%", subMid: "异常精通", subNormal: "穿透值", subLow: "攻击力" },
    { agent: "青衣", id: 680, mainSet: "震星迪斯科", subSet: "摇摆爵士", slot4: "暴击率/暴击伤害", slot5: "电/攻击力%", slot6: "冲击力", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "" },
    { agent: "朱鸢", id: 634, mainSet: "混沌重金属", subSet: "激素朋克", slot4: "暴击伤害", slot5: "以太", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "露西", id: 493, mainSet: "静听嘉音", subSet: "摇摆爵士", slot4: "暴击率", slot5: "火", slot6: "能量自动回复", subHigh: "攻击力%", subMid: "暴击率", subNormal: "暴击伤害", subLow: "" },
    { agent: "派派", id: 485, mainSet: "自由蓝调", subSet: "摇摆爵士", slot4: "异常精通/攻击力%", slot5: "物/攻击力%", slot6: "异常掌握/能量自动回复", subHigh: "异常精通", subMid: "攻击力%", subNormal: "穿透值", subLow: "" },
    { agent: "安比", id: 379, mainSet: "震星迪斯科", subSet: "摇摆爵士", slot4: "暴击率", slot5: "攻击力%", slot6: "冲击力", subHigh: "暴击伤害", subMid: "暴击率", subNormal: "攻击力%", subLow: "攻击力" },
    { agent: "猫又", id: 378, mainSet: "獠牙重金属", subSet: "啄木鸟电音", slot4: "暴击率", slot5: "物", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "比利", id: 371, mainSet: "啄木鸟电音", subSet: "折枝剑歌", slot4: "暴击率/暴击伤害", slot5: "物/攻击力%", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "攻击力" },
    { agent: "珂蕾妲", id: 318, mainSet: "震星迪斯科", subSet: "摇摆爵士", slot4: "暴击率/暴击伤害", slot5: "火/攻击力%", slot6: "冲击力", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "穿透值" },
    { agent: "艾莲", id: 317, mainSet: "极地重金属", subSet: "啄木鸟电音", slot4: "暴击率/暴击伤害", slot5: "冰", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "攻击力" },
    { agent: "丽娜", id: 316, mainSet: "摇摆爵士", subSet: "河豚电音", slot4: "暴击率", slot5: "穿透率", slot6: "能量自动回复", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "异常精通" },
    { agent: "苍角", id: 227, mainSet: "自由蓝调", subSet: "法厄同之歌", slot4: "异常精通/攻击力%", slot5: "攻击力%/冰", slot6: "异常掌握/能量自动回复", subHigh: "攻击力%", subMid: "异常精通", subNormal: "暴击率", subLow: "攻击力" },
    { agent: "可琳", id: 179, mainSet: "河豚电音", subSet: "啄木鸟电音", slot4: "暴击率", slot5: "穿透率", slot6: "攻击力%", subHigh: "暴击伤害", subMid: "暴击率", subNormal: "攻击力%", subLow: "" },
    { agent: "本", id: 158, mainSet: "摇摆爵士", subSet: "灵魂摇滚", slot4: "防御力%", slot5: "防御力%", slot6: "能量自动回复", subHigh: "暴击伤害", subMid: "防御力%", subNormal: "暴击率", subLow: "防御力" },
    { agent: "格莉丝", id: 150, mainSet: "雷暴重金属", subSet: "河豚电音", slot4: "异常精通", slot5: "穿透率", slot6: "攻击力%", subHigh: "异常精通", subMid: "攻击力%", subNormal: "", subLow: "" },
    { agent: "安东", id: 147, mainSet: "雷暴重金属", subSet: "啄木鸟电音", slot4: "暴击伤害", slot5: "攻击力%", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "攻击力" },
    { agent: "妮可", id: 80, mainSet: "摇摆爵士", subSet: "自由蓝调", slot4: "异常精通", slot5: "以太", slot6: "能量自动回复", subHigh: "异常精通", subMid: "攻击力%", subNormal: "攻击力", subLow: "穿透值" },
    { agent: "11号", id: 73, mainSet: "炎狱重金属", subSet: "激素朋克", slot4: "暴击率/暴击伤害", slot5: "火", slot6: "攻击力%", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "" },
    { agent: "莱卡恩", id: 65, mainSet: "山大王", subSet: "震星迪斯科", slot4: "暴击率", slot5: "冰/攻击力%", slot6: "冲击力", subHigh: "暴击率", subMid: "暴击伤害", subNormal: "攻击力%", subLow: "" }
];

// 套装变量数据
const setVariables = {
    "獠牙重金属": { slot4: ["攻击力%"], slot5: ["攻击力%"], slot6: ["攻击力%"], subStats: ["生命值"] },
    "激素朋克": { slot4: ["生命值%"], slot5: ["生命值%"], slot6: ["生命值%"], subStats: ["生命值%"] },
    "震星迪斯科": { slot4: ["防御力%"], slot5: ["防御力%"], slot6: ["防御力%"], subStats: ["攻击力"] },
    "雷暴重金属": { slot4: ["暴击率"], slot5: ["穿透率"], slot6: ["异常掌握"], subStats: ["攻击力%"] },
    "极地重金属": { slot4: ["暴击伤害"], slot5: ["物"], slot6: ["冲击力"], subStats: ["防御力"] },
    "自由蓝调": { slot4: ["异常精通"], slot5: ["火"], slot6: ["能量自动回复"], subStats: ["防御力%"] },
    "炎狱重金属": { slot4: [], slot5: ["冰"], slot6: [], subStats: ["穿透值"] },
    "河豚电音": { slot4: [], slot5: ["电"], slot6: [], subStats: ["暴击率"] },
    "摇摆爵士": { slot4: [], slot5: ["以太"], slot6: [], subStats: ["暴击伤害"] },
    "啄木鸟电音": { slot4: [], slot5: [], slot6: [], subStats: ["异常精通"] },
    "灵魂摇滚": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "混沌重金属": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "原始朋克": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "混沌爵士": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "折枝剑歌": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "静听嘉音": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "如影相随": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "法厄同之歌": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "山大王": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "云岿如我": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "月光骑士颂": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "拂晓生花": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "流光咏叹": { slot4: [], slot5: [], slot6: [], subStats: [] },
    "沧浪行歌": { slot4: [], slot5: [], slot6: [], subStats: [] }
};

// 标准属性顺序
const standardOrder = {
    slot4: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '异常精通'],
    slot5: ['攻击力%', '生命值%', '防御力%', '穿透率', '物', '火', '冰', '电', '以太'],
    slot6: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '冲击力', '异常掌握', '能量自动回复'],
    subStats: ['生命值', '生命值%', '攻击力', '攻击力%', '防御力', '防御力%', '穿透值', '暴击率', '暴击伤害', '异常精通']
};

// 所有可选主属性
const allPossibleStats = {
    slot4: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '异常精通'],
    slot5: ['攻击力%', '生命值%', '防御力%', '穿透率', '物', '火', '冰', '电', '以太'],
    slot6: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '冲击力', '异常掌握', '能量自动回复'],
    subStats: ['生命值', '生命值%', '攻击力', '攻击力%', '防御力', '防御力%', '穿透值', '暴击率', '暴击伤害', '异常精通']
};

// 拆分多择属性
function splitStats(str) {
    if (!str || str.trim() === '') return [];
    return str.split('/').map(s => s.trim()).filter(s => s);
}

// 按标准顺序排序
function sortByStandardOrder(stats, type) {
    const order = standardOrder[type] || [];
    const sorted = [...order.filter(s => stats.includes(s))];
    stats.forEach(s => {
        if (!sorted.includes(s)) sorted.push(s);
    });
    return sorted;
}

// 统计套装属性
function analyzeSets() {
    const setStats = {};
    
    // 初始化所有套装
    Object.keys(setVariables).forEach(setName => {
        setStats[setName] = {
            slot4: new Set(),
            slot5: new Set(),
            slot6: new Set(),
            subStats: new Set(),
            agents: {}
        };
    });
    
    // 遍历代理人数据
    agentData.forEach(agent => {
        const sets = [agent.mainSet, agent.subSet];
        
        sets.forEach(setName => {
            if (!setStats[setName]) {
                setStats[setName] = {
                    slot4: new Set(),
                    slot5: new Set(),
                    slot6: new Set(),
                    subStats: new Set(),
                    agents: {}
                };
            }
            
            // 添加代理人
            setStats[setName].agents[agent.id] = agent.agent;
            
            // 添加主属性
            splitStats(agent.slot4).forEach(s => setStats[setName].slot4.add(s));
            splitStats(agent.slot5).forEach(s => setStats[setName].slot5.add(s));
            splitStats(agent.slot6).forEach(s => setStats[setName].slot6.add(s));
            
            // 添加副属性
            [agent.subHigh, agent.subMid, agent.subNormal, agent.subLow].forEach(sub => {
                splitStats(sub).forEach(s => setStats[setName].subStats.add(s));
            });
        });
    });
    
    return setStats;
}

// 当前模式: 'used' 或 'inverse'
let currentMode = 'used';
let allSetStats = null;

// 渲染统计概览
function renderOverview() {
    const totalAgents = agentData.length;
    const totalSets = Object.keys(setVariables).length;
    const usedSets = Object.keys(allSetStats).filter(s => Object.keys(allSetStats[s].agents).length > 0).length;
    
    document.getElementById('statsOverview').innerHTML = `
        <div class="stat-card">
            <div class="number">${totalAgents}</div>
            <div class="label">代理人</div>
        </div>
        <div class="stat-card">
            <div class="number">${totalSets}</div>
            <div class="label">套装总数</div>
        </div>
        <div class="stat-card">
            <div class="number">${usedSets}</div>
            <div class="label">已使用套装</div>
        </div>
        <div class="stat-card">
            <div class="number">${currentMode === 'used' ? '✓' : '✗'}</div>
            <div class="label">${currentMode === 'used' ? '正向统计' : '反选分析'}</div>
        </div>
    `;
}

// 渲染套装卡片
function renderSetCard(setName, stats, isInverse = false) {
    const agents = Object.entries(stats.agents)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([id, name]) => `<span>${name}</span>`)
        .join('');
    
    const agentCount = Object.keys(stats.agents).length;
    
    const renderStats = (statSet, type, isInverse) => {
        let statsArray = Array.from(statSet);
        
        if (isInverse) {
            // 反选模式: 显示未使用的属性
            const allStats = allPossibleStats[type];
            statsArray = allStats.filter(s => !statSet.has(s));
        }
        
        const sorted = sortByStandardOrder(statsArray, type);
        
        if (sorted.length === 0) {
            return '<span class="no-data">无</span>';
        }
        
        return sorted.map(s => `<span class="stat-tag ${isInverse ? 'unused' : ''}">${s}</span>`).join('');
    };
    
    return `
        <div class="set-card" data-set="${setName}" data-agents="${Object.values(stats.agents).join(' ')}">
            <div class="set-header">
                <span class="set-name">${setName}</span>
                <span class="agent-count">${agentCount} 代理人</span>
            </div>
            ${agents ? `<div class="agents-list">${agents}</div>` : ''}
            <div class="slot-section">
                <div class="slot-title">4号位 ${isInverse ? '(未使用)' : ''}</div>
                <div class="stats-list">${renderStats(stats.slot4, 'slot4', isInverse)}</div>
            </div>
            <div class="slot-section">
                <div class="slot-title">5号位 ${isInverse ? '(未使用)' : ''}</div>
                <div class="stats-list">${renderStats(stats.slot5, 'slot5', isInverse)}</div>
            </div>
            <div class="slot-section">
                <div class="slot-title">6号位 ${isInverse ? '(未使用)' : ''}</div>
                <div class="stats-list">${renderStats(stats.slot6, 'slot6', isInverse)}</div>
            </div>
            <div class="slot-section">
                <div class="slot-title">副属性 ${isInverse ? '(未使用)' : ''}</div>
                <div class="stats-list">${renderStats(stats.subStats, 'subStats', isInverse)}</div>
            </div>
        </div>
    `;
}

// 渲染所有套装
function renderAllSets(searchQuery = '') {
    const grid = document.getElementById('setsGrid');
    const isInverse = currentMode === 'inverse';
    
    let html = '';
    
    // 按代理人数量排序
    const sortedSets = Object.entries(allSetStats)
        .sort((a, b) => Object.keys(b[1].agents).length - Object.keys(a[1].agents).length);
    
    sortedSets.forEach(([setName, stats]) => {
        // 搜索过滤
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const setMatch = setName.toLowerCase().includes(query);
            const agentMatch = Object.values(stats.agents).some(a => a.toLowerCase().includes(query));
            if (!setMatch && !agentMatch) return;
        }
        
        html += renderSetCard(setName, stats, isInverse);
    });
    
    grid.innerHTML = html;
}

// 初始化
function init() {
    allSetStats = analyzeSets();
    renderOverview();
    renderAllSets();
    
    // 模式切换
    document.getElementById('modeUsed').addEventListener('click', () => {
        currentMode = 'used';
        document.getElementById('modeUsed').classList.add('active');
        document.getElementById('modeInverse').classList.remove('active');
        renderOverview();
        renderAllSets(document.getElementById('searchInput').value);
    });
    
    document.getElementById('modeInverse').addEventListener('click', () => {
        currentMode = 'inverse';
        document.getElementById('modeInverse').classList.add('active');
        document.getElementById('modeUsed').classList.remove('active');
        renderOverview();
        renderAllSets(document.getElementById('searchInput').value);
    });
    
    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderAllSets(e.target.value);
    });
}

// 启动
init();
