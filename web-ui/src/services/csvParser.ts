import type { Agent } from '../types.js';

/**
 * CSV 解析与生成服务
 */
export class CSVParser {
    private readonly HEADERS = [
        'Agent',
        'id',
        '主套装(×4)',
        '辅套装(×2)',
        '4号位主属性',
        '5号位主属性',
        '6号位主属性',
        '高优先级副属性',
        '中优先级副属性',
        '正常优先级副属性',
        '低优先级副属性'
    ];

    /**
     * 解析 CSV 内容为 Agent 数组
     * @param content CSV 文件内容
     * @returns Agent 数组
     */
    parse(content: string): Agent[] {
        const lines = content.trim().split('\n');
        if (lines.length < 2) {
            return [];
        }

        const headerLine = lines[0].split(',').map(s => s.trim());
        if (headerLine[0] !== 'Agent' || headerLine[1] !== 'id') {
            console.warn('CSV header mismatch. Expected "Agent,id,..." but got:', headerLine.slice(0, 3));
        }

        return lines.slice(1)
            .filter(line => line.trim())
            .map(line => this.parseLine(line))
            .filter(agent => agent.id > 0);
    }

    /**
     * 解析单行 CSV
     * @param line CSV 行
     * @returns Agent 对象
     */
    private parseLine(line: string): Agent {
        const values = this.splitCSVLine(line);
        return {
            agent: values[0] || '',
            id: parseInt(values[1]) || 0,
            mainSet: values[2] || '',
            subSet: values[3] || '',
            slot4: values[4] || '',
            slot5: values[5] || '',
            slot6: values[6] || '',
            subHigh: values[7] || '',
            subMid: values[8] || '',
            subNormal: values[9] || '',
            subLow: values[10] || ''
        };
    }

    /**
     * 分割 CSV 行，处理可能的引号字段
     * @param line CSV 行
     * @returns 字段数组
     */
    private splitCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    // 转义引号
                    current += '"';
                    i++;
                } else {
                    // 切换引号状态
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    /**
     * 将 Agent 数组生成为 CSV 内容
     * @param agents Agent 数组
     * @returns CSV 内容
     */
    generate(agents: Agent[]): string {
        const header = this.HEADERS.join(',');
        const rows = agents.map(agent => this.generateRow(agent));
        return [header, ...rows].join('\n');
    }

    /**
     * 生成单行 CSV
     * @param agent Agent 对象
     * @returns CSV 行
     */
    private generateRow(agent: Agent): string {
        const values = [
            agent.agent,
            agent.id.toString(),
            agent.mainSet,
            agent.subSet,
            agent.slot4,
            agent.slot5,
            agent.slot6,
            agent.subHigh,
            agent.subMid,
            agent.subNormal,
            agent.subLow
        ];

        return values.map(v => this.escapeField(v)).join(',');
    }

    /**
     * 转义 CSV 字段
     * @param field 字段值
     * @returns 转义后的字段
     */
    private escapeField(field: string): string {
        if (!field) return '';
        // 如果包含逗号、引号或换行，需要用引号包裹
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
    }
}

// 导出单例
export const csvParser = new CSVParser();
