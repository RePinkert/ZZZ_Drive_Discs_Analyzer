import type { AnalysisMode, SetStatsMap } from '../types.js';
import { setVariables, getAgentData } from '../data.js';
import { analyzeSets, getUsedSetCount, sortSetsByAgentCount, searchSets } from '../analyzer.js';
import { renderOverview, renderSetCard } from '../renderer.js';

import { store } from '../state/store.js';

/**
 * 统计页面
 */
export class StatsPage {
    private container: HTMLElement;
    private statsOverviewEl!: HTMLElement;
    private setsGridEl!: HTMLElement;
    private searchInputEl!: HTMLInputElement;
    private modeUsedBtn!: HTMLButtonElement;
    private modeInverseBtn!: HTMLButtonElement;
    private currentMode: AnalysisMode = 'used';
    private allSetStats: SetStatsMap | null = null;

    constructor() {
        this.container = this.createContainer();
        this.cacheElements();
        this.analyzeData();
        this.bindEvents();
        this.render();
    }

    /**
     * 创建页面容器
     */
    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'stats-page';
        container.innerHTML = `
            <div class="controls">
                <div class="search-box">
                    <input type="text" id="statsSearchInput" placeholder="搜索套装或代理人...">
                </div>
                <div class="mode-toggle">
                    <button id="modeUsed" class="active">正向统计</button>
                    <button id="modeInverse">反选分析</button>
                </div>
            </div>
            <div class="stats-overview" id="statsOverview"></div>
            <div class="sets-grid" id="setsGrid"></div>
        `;
        return container;
    }

    /**
     * 缓存DOM元素
     */
    private cacheElements(): void {
        this.statsOverviewEl = this.container.querySelector('#statsOverview')!;
        this.setsGridEl = this.container.querySelector('#setsGrid')!;
        this.searchInputEl = this.container.querySelector('#statsSearchInput') as HTMLInputElement;
        this.modeUsedBtn = this.container.querySelector('#modeUsed') as HTMLButtonElement;
        this.modeInverseBtn = this.container.querySelector('#modeInverse') as HTMLButtonElement;
    }

    /**
     * 分析数据
     */
    private analyzeData(): void {
        // 使用动态数据
        this.allSetStats = analyzeSets();
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        this.modeUsedBtn.addEventListener('click', () => this.setMode('used'));
        this.modeInverseBtn.addEventListener('click', () => this.setMode('inverse'));
        this.searchInputEl.addEventListener('input', () => {
            this.renderSets(this.searchInputEl.value);
        });
    }

    /**
     * 设置模式
     */
    private setMode(mode: AnalysisMode): void {
        this.currentMode = mode;
        if (mode === 'used') {
            this.modeUsedBtn.classList.add('active');
            this.modeInverseBtn.classList.remove('active');
        } else {
            this.modeInverseBtn.classList.add('active');
            this.modeUsedBtn.classList.remove('active');
        }
        this.renderOverview();
        this.renderSets(this.searchInputEl.value);
    }

    /**
     * 渲染页面
     */
    render(): void {
        this.renderOverview();
        this.renderSets();
    }

    /**
     * 渲染概览
     */
    private renderOverview(): void {
        if (!this.allSetStats) return;
        const totalSets = Object.keys(setVariables).length;
        const usedSets = getUsedSetCount(this.allSetStats);
        this.statsOverviewEl.innerHTML = renderOverview(totalSets, usedSets, this.currentMode);
    }

    /**
     * 渲染套装列表
     */
    private renderSets(searchQuery: string = ''): void {
        if (!this.allSetStats) return;

        const isInverse = this.currentMode === 'inverse';
        const filteredSets = searchSets(this.allSetStats, searchQuery);
        const sortedSets = searchQuery
            ? filteredSets.sort((a, b) => Object.keys(b[1].agents).length - Object.keys(a[1].agents).length)
            : sortSetsByAgentCount(this.allSetStats).filter(([name]) =>
                filteredSets.some(([n]) => n === name)
            );

        if (sortedSets.length === 0 && searchQuery) {
            this.setsGridEl.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">\u{1F50D}</div>
                    <div class="empty-state-text">没有找到匹配「${this.escapeHtml(searchQuery)}」的套装或代理人</div>
                    <div class="empty-state-hint">尝试其他关键词</div>
                </div>
            `;
            return;
        }

        this.setsGridEl.innerHTML = sortedSets
            .map(([setName, stats]) => renderSetCard(setName, stats, isInverse))
            .join('');
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 刷新数据
     */
    refresh(): void {
        this.analyzeData();
        this.render();
    }

    /**
     * 获取容器
     */
    getContainer(): HTMLElement {
        return this.container;
    }
}
