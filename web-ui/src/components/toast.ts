export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    el: HTMLDivElement;
    timer: number;
}

export class ToastService {
    private container: HTMLDivElement;
    private toasts: Toast[] = [];

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message: string, type: ToastType = 'info', duration: number = 3000): void {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons: Record<ToastType, string> = {
            success: '\u2713',
            error: '\u2717',
            info: '\u2139'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close') as HTMLButtonElement;
        closeBtn.addEventListener('click', () => this.removeToast(toastEntry));

        this.container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('toast-visible'));

        const timer = window.setTimeout(() => this.removeToast(toastEntry), duration);

        const toastEntry: Toast = { el: toast, timer };
        this.toasts.push(toastEntry);
    }

    private removeToast(entry: Toast): void {
        if (!this.toasts.includes(entry)) return;
        clearTimeout(entry.timer);
        entry.el.classList.remove('toast-visible');
        entry.el.classList.add('toast-exit');
        setTimeout(() => {
            if (entry.el.parentNode) {
                entry.el.parentNode.removeChild(entry.el);
            }
            this.toasts = this.toasts.filter(t => t !== entry);
        }, 300);
    }
}

export const toast = new ToastService();
