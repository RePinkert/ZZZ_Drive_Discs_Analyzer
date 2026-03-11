import type { Agent } from '../types.js';
import { store } from '../state/store.js';
import { AgentCard } from '../components/agentCard.js';
import { agentForm } from '../components/agentForm.js';
import { confirm } from '../components/confirmDialog.js';

/**
 * 编辑页面
 */
export class EditPage {
    private container: HTMLElement;
    private searchInput!: HTMLInputElement;
    private agentsList!: HTMLElement;
    private agents: Agent[] = [];

    constructor() {
        this.container = this.createContainer();
        this.agents = store.getAgents();
        this.bindEvents();
    }

    /**
     * 创建页面容器
     */
    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'edit-page';
        container.innerHTML = `
            <div class="edit-header">
                <div class="search-box">
                    <input type="text" id="agentSearch" placeholder="搜索代理人...">
                </div>
                <button class="btn btn-primary" id="addAgentBtn">+ 新增代理人</button>
            </div>
            <div class="agents-list" id="agentsList"></div>
        `;

        this.searchInput = container.querySelector('#agentSearch') as HTMLInputElement;
        this.agentsList = container.querySelector('#agentsList')!;

        return container;
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        // 搜索
        this.searchInput.addEventListener('input', () => {
            this.filterAgents(this.searchInput.value);
        });

        // 新增代理人
        this.container.querySelector('#addAgentBtn')!.addEventListener('click', () => {
            this.showAddForm();
        });

        // 卡片操作（编辑/删除）
        this.agentsList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const action = target.dataset.action;
            const idStr = target.dataset.id;
            if (!idStr) return;
            const id = parseInt(idStr);

            if (action === 'edit') {
                this.editAgent(id);
            } else if (action === 'delete') {
                this.deleteAgent(id);
            }
        });

        // 订阅状态变更
        store.subscribe((state) => {
            this.agents = state.agents;
            this.renderList();
        });
    }

    /**
     * 渲染页面
     */
    render(): void {
        this.renderList();
    }

    /**
     * 渲染代理人列表
     */
    private renderList(): void {
        const query = this.searchInput.value.toLowerCase();
        const filtered = query
            ? this.agents.filter(a =>
                a.agent.toLowerCase().includes(query) ||
                a.mainSet.toLowerCase().includes(query) ||
                a.subSet.toLowerCase().includes(query)
            )
            : this.agents;

        this.agentsList.innerHTML = AgentCard.renderList(filtered);
    }

    /**
     * 过滤代理人
     */
    private filterAgents(query: string): void {
        this.renderList();
    }

    /**
     * 显示新增表单
     */
    private showAddForm(): void {
        const newId = store.getNextId();
        const emptyAgent: Agent = {
            agent: '',
            id: newId,
            mainSet: '',
            subSet: '',
            slot4: '',
            slot5: '',
            slot6: '',
            subHigh: '',
            subMid: '',
            subNormal: '',
            subLow: ''
        };

        agentForm.show(null, (agent) => {
            store.addAgent(agent);
        });
    }

    /**
     * 编辑代理人
     */
    private editAgent(id: number): void {
        const agent = store.getAgentById(id);
        if (agent) {
            agentForm.show(agent, (updated) => {
                store.updateAgent(id, updated);
            });
        }
    }

    /**
     * 删除代理人
     */
    private async deleteAgent(id: number): Promise<void> {
        const agent = store.getAgentById(id);
        if (!agent) return;

        const confirmed = await confirm(
            '确认删除',
            `确定要删除代理人 "${agent.agent}" 吗？此操作不可撤销。`
        );

        if (confirmed) {
            store.deleteAgent(id);
        }
    }

    /**
     * 获取页面容器
     */
    getContainer(): HTMLElement {
        return this.container;
    }

    /**
     * 销毁页面
     */
    destroy(): void {
        // 清理事件监听等
    }
}
