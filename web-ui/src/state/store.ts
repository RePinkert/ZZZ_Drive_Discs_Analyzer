import type { Agent, AppState, StateChangeListener, ViewMode } from '../types.js';

/**
 * 全局状态管理
 * 使用单例模式
 */
export class Store {
    private static instance: Store | null = null;

    private state: AppState;
    private listeners: Set<StateChangeListener> = new Set();

    private constructor() {
        this.state = {
            agents: [],
            fileHandle: null,
            isDirty: false,
            viewMode: 'stats',
            editingAgentId: null,
            newAgentIds: new Set<number>()
        };
    }

    /**
     * 获取单例实例
     */
    static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    /**
     * 获取当前状态
     */
    getState(): AppState {
        return {
            ...this.state,
            newAgentIds: new Set(this.state.newAgentIds)
        };
    }

    /**
     * 订阅状态变更
     * @param listener 监听函数
     * @returns 取消订阅函数
     */
    subscribe(listener: StateChangeListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * 通知所有监听器
     */
    private notify(): void {
        const state = this.getState();
        this.listeners.forEach(listener => listener(state));
    }

    // ========== Agent 操作 ==========

    /**
     * 设置代理人数据
     */
    setAgents(agents: Agent[]): void {
        this.state.agents = [...agents];
        this.state.isDirty = false;
        this.state.newAgentIds.clear();
        this.notify();
    }

    /**
     * 获取所有代理人
     */
    getAgents(): Agent[] {
        return [...this.state.agents];
    }

    /**
     * 根据 ID 获取代理人
     */
    getAgentById(id: number): Agent | undefined {
        return this.state.agents.find(a => a.id === id);
    }

    /**
     * 添加代理人
     */
    addAgent(agent: Agent): void {
        this.state.agents.push(agent);
        this.state.newAgentIds.add(agent.id);
        this.state.isDirty = true;
        this.notify();
    }

    /**
     * 更新代理人
     */
    updateAgent(id: number, updates: Partial<Agent>): void {
        const index = this.state.agents.findIndex(a => a.id === id);
        if (index !== -1) {
            this.state.agents[index] = { ...this.state.agents[index], ...updates };
            this.state.isDirty = true;
            this.notify();
        }
    }

    /**
     * 删除代理人
     */
    deleteAgent(id: number): void {
        const index = this.state.agents.findIndex(a => a.id === id);
        if (index !== -1) {
            const isNew = this.state.newAgentIds.has(id);
            this.state.agents.splice(index, 1);
            this.state.newAgentIds.delete(id);

            // 只有删除已存在的代理人才需要保存
            // 删除新增的代理人不需要保存（因为该记录从未存在于文件中）
            if (!isNew) {
                this.state.isDirty = true;
            } else {
                // 如果删除的是新增代理人，检查是否还有其他未保存的更改
                if (this.state.newAgentIds.size === 0) {
                    this.state.isDirty = false;
                }
            }
            this.notify();
        }
    }

    /**
     * 获取下一个可用的 ID
     */
    getNextId(): number {
        if (this.state.agents.length === 0) return 1;
        return Math.max(...this.state.agents.map(a => a.id)) + 1;
    }

    // ========== 文件操作 ==========

    /**
     * 设置文件句柄
     */
    setFileHandle(handle: FileSystemFileHandle | null): void {
        this.state.fileHandle = handle;
        this.notify();
    }

    /**
     * 获取文件句柄
     */
    getFileHandle(): FileSystemFileHandle | null {
        return this.state.fileHandle;
    }

    /**
     * 标记为已保存
     */
    markSaved(): void {
        this.state.isDirty = false;
        this.state.newAgentIds.clear();
        this.notify();
    }

    /**
     * 检查是否有未保存的修改
     */
    isDirty(): boolean {
        return this.state.isDirty;
    }

    /**
     * 检查某个代理人是否是新增的
     */
    isNewAgent(id: number): boolean {
        return this.state.newAgentIds.has(id);
    }

    /**
     * 获取所有新增的代理人ID
     */
    getNewAgentIds(): Set<number> {
        return new Set(this.state.newAgentIds);
    }

    // ========== 视图模式 ==========

    /**
     * 设置视图模式
     */
    setViewMode(mode: ViewMode): void {
        this.state.viewMode = mode;
        this.notify();
    }

    /**
     * 获取当前视图模式
     */
    getViewMode(): ViewMode {
        return this.state.viewMode;
    }

    // ========== 编辑状态 ==========

    /**
     * 设置正在编辑的代理人
     */
    setEditingAgent(id: number | null): void {
        this.state.editingAgentId = id;
        this.notify();
    }

    /**
     * 获取正在编辑的代理人 ID
     */
    getEditingAgentId(): number | null {
        return this.state.editingAgentId;
    }

    /**
     * 重置状态
     */
    reset(): void {
        this.state = {
            agents: [],
            fileHandle: null,
            isDirty: false,
            viewMode: 'stats',
            editingAgentId: null,
            newAgentIds: new Set<number>()
        };
        this.notify();
    }
}

// 导出单例
export const store = Store.getInstance();
