import type { Agent } from '../types.js';
import { getSetNames, getAllPossibleStats } from '../data.js';

/**
 * 代理人编辑表单组件
 */
export class AgentForm {
    private container: HTMLDivElement;
    private form: HTMLFormElement;
    private currentAgent: Agent | null = null;
    private onSave: ((agent: Agent) => void) | null = null;
    private onCancel: (() => void) | null = null;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'agent-form-overlay';
        this.container.innerHTML = `
            <div class="agent-form-container">
                <div class="agent-form-header">
                    <h3 class="form-title">编辑代理人</h3>
                    <button class="btn-close" data-action="close">&times;</button>
                </div>
                <form class="agent-form" id="agentForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="agentName">代理人名称</label>
                            <input type="text" id="agentName" name="agent" required>
                        </div>
                        <div class="form-group">
                            <label for="agentId">ID</label>
                            <input type="number" id="agentId" name="id" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="mainSet">主套装 (x4)</label>
                            <select id="mainSet" name="mainSet" required></select>
                        </div>
                        <div class="form-group">
                            <label for="subSet">辅套装 (x2)</label>
                            <select id="subSet" name="subSet" required></select>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4 class="section-title">4号位主属性 <span class="hint">(可多选)</span></h4>
                        <div class="checkbox-group" id="slot4Group"></div>
                    </div>

                    <div class="form-section">
                        <h4 class="section-title">5号位主属性 <span class="hint">(可多选)</span></h4>
                        <div class="checkbox-group" id="slot5Group"></div>
                    </div>

                    <div class="form-section">
                        <h4 class="section-title">6号位主属性 <span class="hint">(可多选)</span></h4>
                        <div class="checkbox-group" id="slot6Group"></div>
                    </div>

                    <div class="form-section">
                        <h4 class="section-title">副属性优先级</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="subHigh">高优先级</label>
                                <select id="subHigh" name="subHigh"></select>
                            </div>
                            <div class="form-group">
                                <label for="subMid">中优先级</label>
                                <select id="subMid" name="subMid"></select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="subNormal">正常优先级</label>
                                <select id="subNormal" name="subNormal"></select>
                            </div>
                            <div class="form-group">
                                <label for="subLow">低优先级</label>
                                <select id="subLow" name="subLow"></select>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" data-action="cancel">取消</button>
                        <button type="submit" class="btn btn-primary">保存</button>
                    </div>
                </form>
            </div>
        `;

        this.form = this.container.querySelector('#agentForm')!;
        this.initSelects();
        this.bindEvents();
    }

    /**
     * 初始化下拉选择框
     */
    private initSelects(): void {
        // 套装选择
        const mainSetSelect = this.container.querySelector('#mainSet') as HTMLSelectElement;
        const subSetSelect = this.container.querySelector('#subSet') as HTMLSelectElement;

        const setOptions = '<option value="">请选择</option>' +
            getSetNames().map(name => `<option value="${name}">${name}</option>`).join('');

        mainSetSelect.innerHTML = setOptions;
        subSetSelect.innerHTML = setOptions;

        const possibleStats = getAllPossibleStats();
        const subStatOptions = '<option value="">无</option>' +
            possibleStats.subStats.map(stat => `<option value="${stat}">${stat}</option>`).join('');

        ['subHigh', 'subMid', 'subNormal', 'subLow'].forEach(id => {
            const select = this.container.querySelector(`#${id}`) as HTMLSelectElement;
            select.innerHTML = subStatOptions;
        });
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        // 关闭按钮
        this.container.querySelector('[data-action="close"]')!.addEventListener('click', () => this.close());
        this.container.querySelector('[data-action="cancel"]')!.addEventListener('click', () => this.close());

        // 点击背景关闭
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });

        // 表单提交
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('visible')) {
                this.close();
            }
        });
    }

    /**
     * 显示表单
     * @param agent 要编辑的代理人（null 表示新增）
     * @param onSave 保存回调
     * @param onCancel 取消回调
     */
    show(agent: Agent | null, onSave: (agent: Agent) => void, onCancel?: () => void): void {
        this.currentAgent = agent;
        this.onSave = onSave;
        this.onCancel = onCancel || null;

        // 更新标题
        const title = this.container.querySelector('.form-title')!;
        title.textContent = agent ? `编辑代理人: ${agent.agent}` : '新增代理人';

        // 填充表单
        this.populateForm(agent);

        // 显示
        document.body.appendChild(this.container);
        this.container.offsetHeight; // 触发重绘
        this.container.classList.add('visible');

        // 聚焦第一个输入框
        (this.container.querySelector('#agentName') as HTMLInputElement).focus();
    }

    /**
     * 填充表单数据
     */
    private populateForm(agent: Agent | null): void {
        const form = this.form;

        if (agent) {
            (form.querySelector('#agentName') as HTMLInputElement).value = agent.agent;
            (form.querySelector('#agentId') as HTMLInputElement).value = agent.id.toString();
            (form.querySelector('#mainSet') as HTMLSelectElement).value = agent.mainSet;
            (form.querySelector('#subSet') as HTMLSelectElement).value = agent.subSet;

            // 多选属性
            this.setCheckboxValues('slot4Group', agent.slot4);
            this.setCheckboxValues('slot5Group', agent.slot5);
            this.setCheckboxValues('slot6Group', agent.slot6);

            // 副属性
            (form.querySelector('#subHigh') as HTMLSelectElement).value = agent.subHigh;
            (form.querySelector('#subMid') as HTMLSelectElement).value = agent.subMid;
            (form.querySelector('#subNormal') as HTMLSelectElement).value = agent.subNormal;
            (form.querySelector('#subLow') as HTMLSelectElement).value = agent.subLow;
        } else {
            form.reset();
            // 清空多选
            this.setCheckboxValues('slot4Group', '');
            this.setCheckboxValues('slot5Group', '');
            this.setCheckboxValues('slot6Group', '');
        }

        // 更新可选属性
        this.updateAvailableStats();
    }

    /**
     * 更新可选属性列表
     */
    private updateAvailableStats(): void {
        const possibleStats = getAllPossibleStats();
        this.renderCheckboxGroup('slot4Group', possibleStats.slot4);
        this.renderCheckboxGroup('slot5Group', possibleStats.slot5);
        this.renderCheckboxGroup('slot6Group', possibleStats.slot6);
    }

    /**
     * 渲染多选框组
     */
    private renderCheckboxGroup(containerId: string, options: string[]): void {
        const container = this.container.querySelector(`#${containerId}`)!;
        container.innerHTML = options.map(opt => `
            <label class="checkbox-label">
                <input type="checkbox" name="${containerId}_option" value="${opt}">
                <span>${opt}</span>
            </label>
        `).join('');
    }

    /**
     * 设置多选框的值
     */
    private setCheckboxValues(containerId: string, value: string): void {
        const selected = value ? value.split('/') : [];
        const container = this.container.querySelector(`#${containerId}`)!;
        const checkboxes = container.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

        checkboxes.forEach(cb => {
            cb.checked = selected.includes(cb.value);
        });
    }

    /**
     * 获取多选框的值
     */
    private getCheckboxValues(containerId: string): string {
        const container = this.container.querySelector(`#${containerId}`)!;
        const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
        return Array.from(checkboxes).map(cb => cb.value).join('/');
    }

    /**
     * 处理表单提交
     */
    private handleSubmit(): void {
        const form = this.form;

        const agent: Agent = {
            agent: (form.querySelector('#agentName') as HTMLInputElement).value.trim(),
            id: parseInt((form.querySelector('#agentId') as HTMLInputElement).value),
            mainSet: (form.querySelector('#mainSet') as HTMLSelectElement).value,
            subSet: (form.querySelector('#subSet') as HTMLSelectElement).value,
            slot4: this.getCheckboxValues('slot4Group'),
            slot5: this.getCheckboxValues('slot5Group'),
            slot6: this.getCheckboxValues('slot6Group'),
            subHigh: (form.querySelector('#subHigh') as HTMLSelectElement).value,
            subMid: (form.querySelector('#subMid') as HTMLSelectElement).value,
            subNormal: (form.querySelector('#subNormal') as HTMLSelectElement).value,
            subLow: (form.querySelector('#subLow') as HTMLSelectElement).value
        };

        if (this.onSave) {
            this.onSave(agent);
        }

        this.close();
    }

    /**
     * 关闭表单
     */
    close(): void {
        this.container.classList.remove('visible');
        setTimeout(() => {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            if (this.onCancel) {
                this.onCancel();
            }
        }, 200);
    }
}

// 导出单例
export const agentForm = new AgentForm();
