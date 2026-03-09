import type { AnalysisMode, SetStatsMap } from './types.js';
import { setVariables } from './data.js';
import { analyzeSets, getUsedSetCount, sortSetsByAgentCount, searchSets } from './analyzer.js';
import { renderOverview, renderSetCard } from './renderer.js';

/**
 * 绝区零驱动盘分析器 - 主应用类
 */
class DriveDiscAnalyzer {
    /** 当前分析模式 */
    private currentMode: AnalysisMode = 'used';
    /** 所有套装统计数据 */
    private allSetStats: SetStatsMap | null = null;

    // DOM 元素引用
    private statsOverviewEl!: HTMLElement;
    private setsGridEl!: HTMLElement;
    private searchInputEl!: HTMLInputElement;
    private modeUsedBtn!: HTMLButtonElement;
    private modeInverseBtn!: HTMLButtonElement;

    /**
     * 初始化应用
     */
    constructor() {
        this.cacheElements();
        this.analyzeData();
        this.bindEvents();
        this.render();
    }

    /**
     * 缓存DOM元素引用
     */
    private cacheElements(): void {
        const statsOverview = document.getElementById('statsOverview');
        const setsGrid = document.getElementById('setsGrid');
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        const modeUsed = document.getElementById('modeUsed') as HTMLButtonElement;
        const modeInverse = document.getElementById('modeInverse') as HTMLButtonElement;

        if (!statsOverview || !setsGrid || !searchInput || !modeUsed || !modeInverse) {
            throw new Error('Required DOM elements not found');
        }

        this.statsOverviewEl = statsOverview;
        this.setsGridEl = setsGrid;
        this.searchInputEl = searchInput;
        this.modeUsedBtn = modeUsed;
        this.modeInverseBtn = modeInverse;
    }

    /**
     * 分析数据
     */
    private analyzeData(): void {
        this.allSetStats = analyzeSets();
    }

    /**
     * 绑定事件处理
     */
    private bindEvents(): void {
        // 模式切换 - 正向统计
        this.modeUsedBtn.addEventListener('click', () => {
            this.setMode('used');
        });

        // 模式切换 - 反选分析
        this.modeInverseBtn.addEventListener('click', () => {
            this.setMode('inverse');
        });

        // 搜索功能
        this.searchInputEl.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            this.renderSets(target.value);
        });
    }

    /**
     * 设置分析模式
     * @param mode 分析模式
     */
    private setMode(mode: AnalysisMode): void {
        this.currentMode = mode;

        // 更新按钮状态
        if (mode === 'used') {
            this.modeUsedBtn.classList.add('active');
            this.modeInverseBtn.classList.remove('active');
        } else {
            this.modeInverseBtn.classList.add('active');
            this.modeUsedBtn.classList.remove('active');
        }

        // 重新渲染
        this.renderOverview();
        this.renderSets(this.searchInputEl.value);
    }

    /**
     * 渲染整个应用
     */
    private render(): void {
        this.renderOverview();
        this.renderSets();
    }

    /**
     * 渲染概览统计
     */
    private renderOverview(): void {
        if (!this.allSetStats) return;

        const totalSets = Object.keys(setVariables).length;
        const usedSets = getUsedSetCount(this.allSetStats);

        this.statsOverviewEl.innerHTML = renderOverview(totalSets, usedSets, this.currentMode);
    }

    /**
     * 渲染套装列表
     * @param searchQuery 搜索关键词
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

        const html = sortedSets
            .map(([setName, stats]) => renderSetCard(setName, stats, isInverse))
            .join('');

        this.setsGridEl.innerHTML = html;
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    new DriveDiscAnalyzer();
});

export { DriveDiscAnalyzer };
