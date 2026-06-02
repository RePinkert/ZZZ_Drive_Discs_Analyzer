import type { SlotType } from './types.js';
import { standardOrder, getPossibleStatsBySlot } from './data.js';

/**
 * 拆分多择属性
 * @param str 属性字符串，如 "暴击率/暴击伤害"
 * @returns 拆分后的属性数组
 */
export function splitStats(str: string): string[] {
    if (!str || str.trim() === '') return [];
    return str.split('/').map(s => s.trim()).filter(s => s);
}

/**
 * 按标准顺序排序属性
 * @param stats 属性数组
 * @param type 槽位类型
 * @returns 排序后的属性数组
 */
export function sortByStandardOrder(stats: string[], type: SlotType): string[] {
    const order = standardOrder[type] || [];
    const sorted: string[] = [];

    // 首先按标准顺序添加存在的属性
    order.forEach(s => {
        if (stats.includes(s)) {
            sorted.push(s);
        }
    });

    // 添加标准顺序中没有的属性
    stats.forEach(s => {
        if (!sorted.includes(s)) {
            sorted.push(s);
        }
    });

    return sorted;
}

/**
 * 获取所有可能的属性列表
 * @param type 槽位类型
 * @returns 属性数组
 */
export function getAllPossibleStats(type: SlotType): string[] {
    return getPossibleStatsBySlot(type);
}
