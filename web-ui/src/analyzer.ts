import type { Agent, SetStats, SetStatsMap, SlotType } from './types.js';
import { getAgentData, setVariables } from './data.js';
import { splitStats } from './utils.js';

/**
 * 创建空的套装统计对象
 * @returns 初始化的套装统计数据
 */
function createEmptySetStats(): SetStats {
    return {
        slot4: new Set<string>(),
        slot5: new Set<string>(),
        slot6: new Set<string>(),
        subStats: new Set<string>(),
        agents: {}
    };
}

/**
 * 分析套装使用情况
 * 统计每个套装被哪些代理人使用，以及使用了哪些属性
 * @returns 套装统计映射
 */
export function analyzeSets(): SetStatsMap {
    const setStats: SetStatsMap = {};

    // 初始化所有套装
    Object.keys(setVariables).forEach(setName => {
        setStats[setName] = createEmptySetStats();
    });

    // 遍历代理人数据
    getAgentData().forEach((agent: Agent) => {
        const sets: string[] = [agent.mainSet, agent.subSet];

        sets.forEach(setName => {
            // 如果套装不存在，创建新的统计对象
            if (!setStats[setName]) {
                setStats[setName] = createEmptySetStats();
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

/**
 * 获取使用中的套装数量
 * @param setStats 套装统计映射
 * @returns 使用中的套装数量
 */
export function getUsedSetCount(setStats: SetStatsMap): number {
    return Object.values(setStats).filter(stats => Object.keys(stats.agents).length > 0).length;
}

/**
 * 根据代理人数量排序套装
 * @param setStats 套装统计映射
 * @returns 排序后的套装条目数组
 */
export function sortSetsByAgentCount(setStats: SetStatsMap): [string, SetStats][] {
    return Object.entries(setStats)
        .sort((a, b) => Object.keys(b[1].agents).length - Object.keys(a[1].agents).length);
}

/**
 * 搜索套装
 * @param setStats 套装统计映射
 * @param query 搜索关键词
 * @returns 匹配的套装条目数组
 */
export function searchSets(setStats: SetStatsMap, query: string): [string, SetStats][] {
    if (!query.trim()) {
        return sortSetsByAgentCount(setStats);
    }

    const lowerQuery = query.toLowerCase();

    return Object.entries(setStats).filter(([setName, stats]) => {
        const setMatch = setName.toLowerCase().includes(lowerQuery);
        const agentMatch = Object.values(stats.agents).some(
            agentName => agentName.toLowerCase().includes(lowerQuery)
        );
        return setMatch || agentMatch;
    });
}
