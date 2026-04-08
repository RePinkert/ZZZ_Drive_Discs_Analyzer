import type { Agent, SetVariables, StandardOrder, AllPossibleStats } from './types.js';

// 代理人数据（运行时从 CSV 加载）
// 保留静态数据作为默认/备份
const defaultAgentData: Agent[] = [
    { agent: "南宫羽", id: 1852, mainSet: "法厄同之歌", subSet: "山大王", slot4: "异常精通", slot5: "以太", slot6: "异常掌握", subHigh: "异常精通", subMid: "攻击力%", subNormal: "穿透值", subLow: "" },
    { agent: "爱芮", id: 1793, mainSet: "流光咏叹", subSet: "法厄同之歌", slot4: "异常精通", slot5: "以太/穿透率", slot6: "异常掌握", subHigh: "异常精通", subMid: "攻击力%", subNormal: "穿透值", subLow: "攻击力" },
    { agent: "千夏", id: 1791, mainSet: "月光骑士颂", subSet: "摇摆爵士", slot4: "攻击力%", slot5: "攻击力%", slot6: "能量自动回复", subHigh: "攻击力%", subMid: "攻击力", subNormal: "", subLow: "" },
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
export const setVariables: SetVariables = {
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
export const standardOrder: StandardOrder = {
    slot4: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '异常精通'],
    slot5: ['攻击力%', '生命值%', '防御力%', '穿透率', '物', '火', '冰', '电', '以太'],
    slot6: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '冲击力', '异常掌握', '能量自动回复'],
    subStats: ['生命值', '生命值%', '攻击力', '攻击力%', '防御力', '防御力%', '穿透值', '暴击率', '暴击伤害', '异常精通']
};

// 所有可选主属性
export const allPossibleStats: AllPossibleStats = {
    slot4: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '异常精通'],
    slot5: ['攻击力%', '生命值%', '防御力%', '穿透率', '物', '火', '冰', '电', '以太'],
    slot6: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '冲击力', '异常掌握', '能量自动回复'],
    subStats: ['生命值', '生命值%', '攻击力', '攻击力%', '防御力', '防御力%', '穿透值', '暴击率', '暴击伤害', '异常精通']
};

// 套装名称列表
export const setNames = Object.keys(setVariables);

// 动态代理人数据（运行时从 CSV 加载）
let _agentData: Agent[] = defaultAgentData;

/**
 * 获取代理人数据
 */
export function getAgentData(): Agent[] {
    return _agentData;
}

/**
 * 设置代理人数据（从 CSV 加载后调用）
 */
export function setAgentData(agents: Agent[]): void {
    _agentData = agents;
}

// 兼容性导出：agentData 引用 getAgentData() 的返回值
// 注意：直接导入 agentData 的代码需要改为调用 getAgentData()
export const agentData = new Proxy([] as Agent[], {
    get(target, prop) {
        const data = _agentData;
        if (prop === 'length') return data.length;
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
            return data[Number(prop)];
        }
        if (typeof prop === 'symbol' && prop === Symbol.iterator) {
            return data[Symbol.iterator].bind(data);
        }
        return (data as unknown as Record<string | symbol, unknown>)[prop];
    }
});
