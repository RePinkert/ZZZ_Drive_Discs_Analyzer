/**
 * 文件系统访问服务
 * 支持 File System Access API，降级到上传/下载
 */

// 扩展 Window 接口以包含 File System Access API
declare global {
    interface Window {
        showOpenFilePicker?: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
        showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
    }
}

interface OpenFilePickerOptions {
    types?: FilePickerAcceptType[];
    multiple?: boolean;
}

interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
}

interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string[]>;
}

export class FileService {
    private fileHandle: FileSystemFileHandle | null = null;

    /**
     * 检查是否支持 File System Access API
     */
    isFileSystemAccessSupported(): boolean {
        return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
    }

    /**
     * 打开 CSV 文件
     * @returns CSV 文件内容
     */
    async openCSV(): Promise<string> {
        if (this.isFileSystemAccessSupported()) {
            return this.openViaFilePicker();
        } else {
            return this.openViaInput();
        }
    }

    /**
     * 使用 File System Access API 打开文件
     */
    private async openViaFilePicker(): Promise<string> {
        try {
            const picker = window.showOpenFilePicker;
            if (!picker) {
                return this.openViaInput();
            }
            const [handle] = await picker({
                types: [
                    {
                        description: 'CSV Files',
                        accept: { 'text/csv': ['.csv'] }
                    }
                ],
                multiple: false
            });
            this.fileHandle = handle;
            const file = await handle.getFile();
            return await file.text();
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                // 用户取消
                throw new Error('用户取消了文件选择');
            }
            throw error;
        }
    }

    /**
     * 使用 input[type=file] 打开文件（降级方案）
     */
    private openViaInput(): Promise<string> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';

            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    try {
                        const content = await file.text();
                        resolve(content);
                    } catch (error) {
                        reject(new Error('读取文件失败'));
                    }
                } else {
                    reject(new Error('未选择文件'));
                }
            };

            input.oncancel = () => {
                reject(new Error('用户取消了文件选择'));
            };

            input.click();
        });
    }

    /**
     * 保存 CSV 文件
     * @param content CSV 内容
     */
    async saveCSV(content: string): Promise<void> {
        if (this.fileHandle) {
            await this.saveToHandle(this.fileHandle, content);
        } else {
            await this.saveAs(content);
        }
    }

    /**
     * 另存为
     * @param content CSV 内容
     */
    async saveAs(content: string): Promise<void> {
        const picker = window.showSaveFilePicker;
        if (picker) {
            try {
                const handle = await picker({
                    suggestedName: 'zenlesszonezero.csv',
                    types: [
                        {
                            description: 'CSV Files',
                            accept: { 'text/csv': ['.csv'] }
                        }
                    ]
                });
                await this.saveToHandle(handle, content);
                this.fileHandle = handle;
            } catch (error) {
                if ((error as Error).name === 'AbortError') {
                    throw new Error('用户取消了保存');
                }
                throw error;
            }
        } else {
            this.downloadCSV(content, 'zenlesszonezero.csv');
        }
    }

    /**
     * 写入到文件句柄
     */
    private async saveToHandle(handle: FileSystemFileHandle, content: string): Promise<void> {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
    }

    /**
     * 通过下载导出（降级方案）
     * @param content CSV 内容
     * @param filename 文件名
     */
    downloadCSV(content: string, filename: string): void {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * 获取当前文件句柄
     */
    getFileHandle(): FileSystemFileHandle | null {
        return this.fileHandle;
    }

    /**
     * 清除文件句柄
     */
    clearFileHandle(): void {
        this.fileHandle = null;
    }

    /**
     * 检查是否有已打开的文件
     */
    hasOpenFile(): boolean {
        return this.fileHandle !== null;
    }
}

// 导出单例
export const fileService = new FileService();
