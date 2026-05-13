import type { Agent } from '../types.js';
import { store } from '../state/store.js';
import { getAgentImageUrl, getSetImageUrl } from '../services/imageService.js';

/**
 * 代理人卡片组件
 */
export class AgentCard {
    /**
     * 渲染代理人卡片
     * @param agent 代理人数据
     * @param isNew 是否为新增的代理人
     * @returns HTML 字符串
     */
    static render(agent: Agent, isNew: boolean = false): string {
        const slotDisplay = this.formatSlots(agent);
        const subStatsDisplay = this.formatSubStats(agent);
        const newClass = isNew ? ' agent-card-new' : '';

        return `
            <div class="agent-card${newClass}" data-agent-id="${agent.id}">
                <div class="agent-card-header">
                    <div class="agent-info">
                        <img class="agent-portrait" src="${getAgentImageUrl(agent.id)}" alt="${agent.agent}" onerror="this.style.display='none'">
                        <div class="agent-text">
                            <span class="agent-name">${agent.agent}</span>
                            <span class="agent-id">ID: ${agent.id}</span>
                        </div>
                    </div>
                    <div class="agent-actions">
                        <button class="btn btn-edit" data-action="edit" data-id="${agent.id}">编辑</button>
                        <button class="btn btn-delete" data-action="delete" data-id="${agent.id}">删除</button>
                    </div>
                </div>
                <div class="agent-card-body">
                    <div class="agent-sets">
                        <span class="set-badge main-set">
                            <img class="set-badge-icon" src="${getSetImageUrl(agent.mainSet)}" alt="" onerror="this.style.display='none'">
                            ${agent.mainSet}
                        </span>
                        <span class="set-badge sub-set">
                            <img class="set-badge-icon" src="${getSetImageUrl(agent.subSet)}" alt="" onerror="this.style.display='none'">
                            ${agent.subSet}
                        </span>
                    </div>
                    <div class="agent-slots">
                        <div class="slot-item">
                            <span class="slot-label">4号位:</span>
                            <span class="slot-value">${slotDisplay.slot4}</span>
                        </div>
                        <div class="slot-item">
                            <span class="slot-label">5号位:</span>
                            <span class="slot-value">${slotDisplay.slot5}</span>
                        </div>
                        <div class="slot-item">
                            <span class="slot-label">6号位:</span>
                            <span class="slot-value">${slotDisplay.slot6}</span>
                        </div>
                    </div>
                    <div class="agent-substats">
                        <span class="substat-label">副属性:</span>
                        <span class="substat-value">${subStatsDisplay}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 格式化槽位属性显示
     */
    private static formatSlots(agent: Agent): { slot4: string; slot5: string; slot6: string } {
        return {
            slot4: this.formatMultiChoice(agent.slot4),
            slot5: this.formatMultiChoice(agent.slot5),
            slot6: this.formatMultiChoice(agent.slot6)
        };
    }

    /**
     * 格式化副属性显示
     */
    private static formatSubStats(agent: Agent): string {
        const parts: string[] = [];
        if (agent.subHigh) parts.push(`高:${agent.subHigh}`);
        if (agent.subMid) parts.push(`中:${agent.subMid}`);
        if (agent.subNormal) parts.push(`正:${agent.subNormal}`);
        if (agent.subLow) parts.push(`低:${agent.subLow}`);
        return parts.join(' | ') || '无';
    }

    /**
     * 格式化多择属性
     */
    private static formatMultiChoice(value: string): string {
        if (!value) return '-';
        const options = value.split('/');
        if (options.length === 1) {
            return `<span class="stat-single">${options[0]}</span>`;
        }
        return options.map(opt =>
            `<span class="stat-option">${opt}</span>`
        ).join(' / ');
    }

    /**
     * 渲染代理人列表
     * @param agents 代理人数组
     * @returns HTML 字符串
     */
    static renderList(agents: Agent[]): string {
        if (agents.length === 0) {
            return '<div class="empty-state">没有找到匹配的代理人</div>';
        }

        const newAgentIds = store.getNewAgentIds();

        // 分离新增和已保存的代理人
        const newAgents: Agent[] = [];
        const existingAgents: Agent[] = [];

        for (const agent of agents) {
            if (newAgentIds.has(agent.id)) {
                newAgents.push(agent);
            } else {
                existingAgents.push(agent);
            }
        }

        // 新增的按 ID 倒序（新添加的在前），已保存的也按 ID 倒序
        newAgents.sort((a, b) => b.id - a.id);
        existingAgents.sort((a, b) => b.id - a.id);

        // 新增的置顶
        const sorted = [...newAgents, ...existingAgents];

        return sorted.map(agent => this.render(agent, newAgentIds.has(agent.id))).join('');
    }
}
