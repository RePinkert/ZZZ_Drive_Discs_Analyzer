import type { AllPossibleStats } from '../types.js';

export async function loadSlotAttributes(): Promise<AllPossibleStats> {
    try {
        const response = await fetch('slot_attributes.csv');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        return parseSlotAttributesCSV(csvText);
    } catch (error) {
        console.warn('无法加载 slot_attributes.csv，使用默认属性列表', error);
        return getDefaultAllPossibleStats();
    }
}

export async function loadSetRegistry(): Promise<string[]> {
    try {
        const response = await fetch('set_registry.csv');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        return parseSetRegistryCSV(csvText);
    } catch (error) {
        console.warn('无法加载 set_registry.csv，使用默认套装列表', error);
        return getDefaultSetNames();
    }
}

function parseSlotAttributesCSV(csvText: string): AllPossibleStats {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return getDefaultAllPossibleStats();

    const result: AllPossibleStats = {
        slot4: [],
        slot5: [],
        slot6: [],
        subStats: []
    };

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.trim());
        if (parts.length < 2) continue;
        const [slot, attribute] = parts;
        if (!slot || !attribute) continue;

        const key = slot as keyof AllPossibleStats;
        if (key in result && !result[key].includes(attribute)) {
            result[key].push(attribute);
        }
    }

    return result;
}

function parseSetRegistryCSV(csvText: string): string[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return getDefaultSetNames();

    const names: string[] = [];
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.trim());
        if (parts[0]) names.push(parts[0]);
    }
    return names.length > 0 ? names : getDefaultSetNames();
}

function getDefaultAllPossibleStats(): AllPossibleStats {
    return {
        slot4: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '异常精通'],
        slot5: ['攻击力%', '生命值%', '防御力%', '穿透率', '物', '火', '冰', '电', '以太'],
        slot6: ['攻击力%', '生命值%', '防御力%', '冲击力', '异常掌握', '能量自动回复'],
        subStats: ['生命值', '生命值%', '攻击力', '攻击力%', '防御力', '防御力%', '穿透值', '暴击率', '暴击伤害', '异常精通']
    };
}

function getDefaultSetNames(): string[] {
    return [
        '獠牙重金属', '激素朋克', '震星迪斯科', '雷暴重金属', '极地重金属', '自由蓝调',
        '炎狱重金属', '河豚电音', '摇摆爵士', '啄木鸟电音', '灵魂摇滚', '混沌重金属',
        '原始朋克', '混沌爵士', '折枝剑歌', '静听嘉音', '如影相随', '法厄同之歌',
        '山大王', '云岿如我', '月光骑士颂', '拂晓生花', '流光咏叹', '沧浪行歌'
    ];
}
