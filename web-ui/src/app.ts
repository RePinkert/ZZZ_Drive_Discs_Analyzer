import type { ViewMode } from './types.js';
import { store } from './state/store.js';
import { csvParser } from './services/csvParser.js';
import { fileService } from './services/fileService.js';
import { StatsPage } from './pages/statsPage.js';
import { EditPage } from './pages/editPage.js';
import { getAgentData, setAgentData, initAllPossibleStats } from './data.js';
import { confirm } from './components/confirmDialog.js';
import { toast } from './components/toast.js';

/**
 * 绝区零驱动盘分析器 - 主应用
 */
class DriveDiscAnalyzer {
    private statsPage: StatsPage | null = null;
    private editPage: EditPage | null = null;
    private loadingEl: HTMLDivElement | null = null;

    private navContainer!: HTMLElement;
    private pageContainer!: HTMLElement;
    private importBtn!: HTMLButtonElement;
    private saveBtn!: HTMLButtonElement;
    private modeBtns!: NodeListOf<HTMLButtonElement>;
    private unsavedBanner!: HTMLElement;
    private saveNowBtn!: HTMLButtonElement;
    private dismissBannerBtn!: HTMLButtonElement;

    constructor() {
        const defaultData = getAgentData();
        store.setAgents(defaultData);

        this.cacheElements();
        this.createNavigation();
        this.bindEvents();
        this.initDefaultView();
    }

    async init(): Promise<void> {
        this.showLoading('正在加载数据...');
        try {
            await initAllPossibleStats();
            if (this.statsPage) {
                this.statsPage.refresh();
            }
        } finally {
            this.hideLoading();
        }
    }

    private showLoading(text: string = '处理中...'): void {
        if (!this.loadingEl) {
            this.loadingEl = document.createElement('div');
            this.loadingEl.className = 'loading-overlay';
            this.loadingEl.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">${text}</div>
            `;
        } else {
            this.loadingEl.querySelector('.loading-text')!.textContent = text;
        }
        document.body.appendChild(this.loadingEl);
    }

    private hideLoading(): void {
        if (this.loadingEl && this.loadingEl.parentNode) {
            this.loadingEl.parentNode.removeChild(this.loadingEl);
        }
    }

    private cacheElements(): void {
        this.navContainer = document.getElementById('navContainer')!;
        this.pageContainer = document.getElementById('pageContainer')!;
        this.importBtn = document.getElementById('importBtn') as HTMLButtonElement;
        this.saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
        this.modeBtns = document.querySelectorAll('[data-mode]');
        this.unsavedBanner = document.getElementById('unsavedBanner')!;
        this.saveNowBtn = document.getElementById('saveNowBtn') as HTMLButtonElement;
        this.dismissBannerBtn = document.getElementById('dismissBannerBtn') as HTMLButtonElement;
    }

    /**
     * 创建导航
     */
    private createNavigation(): void {
        // 导航已在 HTML 中定义
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        // 模式切换
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode as ViewMode;
                this.switchMode(mode);
            });
        });

        // 文件操作
        this.importBtn.addEventListener('click', () => this.importCSV());
        this.saveBtn.addEventListener('click', () => this.saveCSV());

        // 订阅状态变更
        store.subscribe((state) => {
            this.updateSaveButton(state.isDirty);
        });

        // 横幅按钮
        this.saveNowBtn.addEventListener('click', () => this.saveCSV());
        this.dismissBannerBtn.addEventListener('click', () => this.dismissBanner());

        // 页面卸载前提醒
        window.addEventListener('beforeunload', (e) => {
            if (store.isDirty()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    /**
     * 初始化默认视图
     */
    private initDefaultView(): void {
        this.switchMode('stats');
    }

    /**
     * 切换视图模式
     */
    private switchMode(mode: ViewMode): void {
        store.setViewMode(mode);

        // 更新导航按钮状态
        this.modeBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 切换页面
        this.renderPage(mode);
    }

    /**
     * 渲染页面
     */
    private renderPage(mode: ViewMode): void {
        // 清空容器
        this.pageContainer.innerHTML = '';

        if (mode === 'stats') {
            if (!this.statsPage) {
                this.statsPage = new StatsPage();
            }
            this.pageContainer.appendChild(this.statsPage.getContainer());
            this.statsPage.refresh();
        } else {
            if (!this.editPage) {
                this.editPage = new EditPage();
            }
            this.pageContainer.appendChild(this.editPage.getContainer());
            this.editPage.render();
        }
    }

    /**
     * 导入 CSV 文件
     */
    private async importCSV(): Promise<void> {
        try {
            const content = await fileService.openCSV();
            this.showLoading('正在解析数据...');
            const agents = csvParser.parse(content);
            store.setAgents(agents);
            setAgentData(agents);
            store.markSaved();

            if (this.statsPage) {
                this.statsPage.refresh();
            }

            this.hideLoading();
            toast.show(`成功导入 ${agents.length} 个代理人数据`, 'success');
        } catch (error) {
            this.hideLoading();
            if ((error as Error).message !== '用户取消了文件选择') {
                toast.show('导入失败: ' + (error as Error).message, 'error');
            }
        }
    }

    /**
     * 保存 CSV 文件
     */
    private async saveCSV(): Promise<void> {
        const agents = store.getAgents();
        const content = csvParser.generate(agents);

        try {
            await fileService.saveCSV(content);
            store.markSaved();
            toast.show('保存成功', 'success');
        } catch (error) {
            if ((error as Error).message !== '用户取消了保存') {
                const confirmed = await confirm(
                    '保存失败',
                    '无法保存到原文件。是否另存为新文件？'
                );
                if (confirmed) {
                    try {
                        await fileService.saveAs(content);
                        store.markSaved();
                        toast.show('另存为成功', 'success');
                    } catch (e) {
                        toast.show('保存失败: ' + (e as Error).message, 'error');
                    }
                }
            }
        }
    }

    /**
     * 更新保存按钮状态
     */
    private updateSaveButton(isDirty: boolean): void {
        if (isDirty) {
            this.saveBtn.classList.add('dirty');
            this.saveBtn.textContent = '* 保存';
            this.showUnsavedBanner();
        } else {
            this.saveBtn.classList.remove('dirty');
            this.saveBtn.textContent = '保存';
            this.hideUnsavedBanner();
        }
    }

    /**
     * 显示未保存横幅
     */
    private showUnsavedBanner(): void {
        this.unsavedBanner.style.display = 'block';
        document.body.classList.add('has-unsaved-banner');
    }

    /**
     * 隐藏未保存横幅
     */
    private hideUnsavedBanner(): void {
        this.unsavedBanner.style.display = 'none';
        document.body.classList.remove('has-unsaved-banner');
    }

    /**
     * 关闭横幅（用户手动关闭，但仍然保持未保存状态）
     */
    private dismissBanner(): void {
        this.hideUnsavedBanner();
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', async () => {
    const app = new DriveDiscAnalyzer();
    await app.init();
});

export { DriveDiscAnalyzer };
