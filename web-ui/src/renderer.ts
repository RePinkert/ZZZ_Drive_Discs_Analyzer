import type { SetStats, AnalysisMode, SlotType } from './types.js';
import { sortByStandardOrder, getAllPossibleStats } from './utils.js';
import { getAgentData } from './data.js';

/**
 * 渲染统计概览
 * @param totalSets 套装总数
 * @param usedSets 使用中的套装数量
 * @param currentMode 当前分析模式
 * @returns HTML字符串
 */
export function renderOverview(totalSets: number, usedSets: number, currentMode: AnalysisMode): string {
    return `
        <div class="stat-card">
            <div class="number">${getAgentData().length}</div>
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

/**
 * 渲染属性标签
 * @param stats 属性集合
 * @param type 槽位类型
 * @param isInverse 是否为反选模式
 * @returns HTML字符串
 */
function renderStats(stats: Set<string>, type: SlotType, isInverse: boolean): string {
    let statsArray: string[];

    if (isInverse) {
        // 反选模式：显示未使用的属性
        const allStats = getAllPossibleStats(type);
        statsArray = allStats.filter(s => !stats.has(s));
    } else {
        statsArray = Array.from(stats);
    }

    const sorted = sortByStandardOrder(statsArray, type);

    if (sorted.length === 0) {
        return '<span class="no-data">无</span>';
    }

    return sorted.map(s => `<span class="stat-tag ${isInverse ? 'unused' : ''}">${s}</span>`).join('');
}

/**
 * 渲染套装卡片
 * @param setName 套装名称
 * @param stats 套装统计数据
 * @param isInverse 是否为反选模式
 * @returns HTML字符串
 */
export function renderSetCard(setName: string, stats: SetStats, isInverse: boolean = false): string {
    const agents = Object.entries(stats.agents)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([_, name]) => `<span>${name}</span>`)
        .join('');

    const agentCount = Object.keys(stats.agents).length;

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
