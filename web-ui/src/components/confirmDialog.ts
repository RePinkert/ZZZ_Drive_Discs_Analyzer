/**
 * 确认对话框组件
 */
export class ConfirmDialog {
    private container: HTMLDivElement;
    private dialog: HTMLDivElement;
    private titleEl: HTMLHeadingElement;
    private messageEl: HTMLParagraphElement;
    private confirmBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    private resolvePromise: ((value: boolean) => void) | null = null;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'confirm-dialog-overlay';
        this.container.innerHTML = `
            <div class="confirm-dialog">
                <h3 class="confirm-dialog-title"></h3>
                <p class="confirm-dialog-message"></p>
                <div class="confirm-dialog-buttons">
                    <button class="btn btn-cancel">取消</button>
                    <button class="btn btn-confirm">确认</button>
                </div>
            </div>
        `;

        this.dialog = this.container.querySelector('.confirm-dialog')!;
        this.titleEl = this.container.querySelector('.confirm-dialog-title')!;
        this.messageEl = this.container.querySelector('.confirm-dialog-message')!;
        this.confirmBtn = this.container.querySelector('.btn-confirm')!;
        this.cancelBtn = this.container.querySelector('.btn-cancel')!;

        this.bindEvents();
    }

    private bindEvents(): void {
        this.confirmBtn.addEventListener('click', () => this.close(true));
        this.cancelBtn.addEventListener('click', () => this.close(false));
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close(false);
            }
        });

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('visible')) {
                this.close(false);
            }
        });
    }

    /**
     * 显示确认对话框
     * @param title 标题
     * @param message 消息
     * @param confirmText 确认按钮文字
     * @param cancelText 取消按钮文字
     * @returns Promise<boolean> 用户是否确认
     */
    show(
        title: string,
        message: string,
        confirmText: string = '确认',
        cancelText: string = '取消'
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.titleEl.textContent = title;
            this.messageEl.textContent = message;
            this.confirmBtn.textContent = confirmText;
            this.cancelBtn.textContent = cancelText;

            document.body.appendChild(this.container);
            // 触发重绘以启动动画
            this.container.offsetHeight;
            this.container.classList.add('visible');
            this.confirmBtn.focus();
        });
    }

    private close(result: boolean): void {
        this.container.classList.remove('visible');
        setTimeout(() => {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            if (this.resolvePromise) {
                this.resolvePromise(result);
                this.resolvePromise = null;
            }
        }, 200);
    }
}

// 导出单例
export const confirmDialog = new ConfirmDialog();

/**
 * 便捷方法：显示确认对话框
 */
export function confirm(title: string, message: string): Promise<boolean> {
    return confirmDialog.show(title, message);
}
