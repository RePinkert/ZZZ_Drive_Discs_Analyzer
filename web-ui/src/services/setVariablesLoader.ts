import type { AllPossibleStats, SetVariable } from '../types.js';

/**
 * 从 zenlesszonezero1.csv 的列中收集所有可能的属性
 */
export async function loadAllPossibleStatsFromCSV(): Promise<AllPossibleStats> {
    try {
        const response = await fetch('zenlesszonezero1.csv');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        return parseSetVariablesCSV(csvText);
    } catch (error) {
        console.warn('无法加载 zenlesszonezero1.csv，使用默认属性列表', error);
        return getDefaultAllPossibleStats();
    }
}

/**
 * 解析 zenlesszonezero1.csv，收集每列的所有非空值
 */
function parseSetVariablesCSV(csvText: string): AllPossibleStats {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        return getDefaultAllPossibleStats();
    }

    const headers = lines[0].split(',').map(h => h.trim());
    
    const slot4Index = headers.indexOf('4号位');
    const slot5Index = headers.indexOf('5号位');
    const slot6Index = headers.indexOf('6号位');
    const subStatsIndex = headers.indexOf('副属性变量');

    if (slot4Index === -1 || slot5Index === -1 || slot6Index === -1 || subStatsIndex === -1) {
        console.warn('CSV 缺少必要的列，使用默认属性列表');
        return getDefaultAllPossibleStats();
    }

    const slot4Set = new Set<string>();
    const slot5Set = new Set<string>();
    const slot6Set = new Set<string>();
    const subStatsSet = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);

        if (values[slot4Index] && values[slot4Index].trim()) {
            slot4Set.add(values[slot4Index].trim());
        }
        if (values[slot5Index] && values[slot5Index].trim()) {
            slot5Set.add(values[slot5Index].trim());
        }
        if (values[slot6Index] && values[slot6Index].trim()) {
            slot6Set.add(values[slot6Index].trim());
        }
        if (values[subStatsIndex] && values[subStatsIndex].trim()) {
            subStatsSet.add(values[subStatsIndex].trim());
        }
    }

    return {
        slot4: Array.from(slot4Set),
        slot5: Array.from(slot5Set),
        slot6: Array.from(slot6Set),
        subStats: Array.from(subStatsSet)
    };
}

/**
 * 解析 CSV 行（简单版本，不处理引号）
 */
function parseCSVLine(line: string): string[] {
    return line.split(',').map(v => v.trim());
}

/**
 * 默认的所有可能属性（当无法加载 CSV 时使用）
 */
function getDefaultAllPossibleStats(): AllPossibleStats {
    return {
        slot4: ['攻击力%', '暴击伤害', '暴击率', '生命值%', '防御力%', '异常精通'],
        slot5: ['攻击力%', '生命值%', '防御力%', '穿透率', '物', '火', '冰', '电', '以太'],
        slot6: ['攻击力%', '生命值%', '防御力%', '冲击力', '异常掌握', '能量自动回复'],
        subStats: ['生命值', '生命值%', '攻击力', '攻击力%', '防御力', '防御力%', '穿透值', '暴击率', '暴击伤害', '异常精通']
    };
}
