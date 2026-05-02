// 绝区零驱动盘分析器 - 类型定义

/** 代理人数据 */
export interface Agent {
    /** 代理人名称 */
    agent: string;
    /** 代理人ID */
    id: number;
    /** 主套装 */
    mainSet: string;
    /** 副套装 */
    subSet: string;
    /** 4号位主属性 */
    slot4: string;
    /** 5号位主属性 */
    slot5: string;
    /** 6号位主属性 */
    slot6: string;
    /** 优先级最高的副属性 */
    subHigh: string;
    /** 优先级中等的副属性 */
    subMid: string;
    /** 普通优先级副属性 */
    subNormal: string;
    /** 低优先级副属性 */
    subLow: string;
}

/** 套装统计数据 */
export interface SetStats {
    /** 4号位使用的属性集合 */
    slot4: Set<string>;
    /** 5号位使用的属性集合 */
    slot5: Set<string>;
    /** 6号位使用的属性集合 */
    slot6: Set<string>;
    /** 副属性集合 */
    subStats: Set<string>;
    /** 使用该套装的代理人映射 (id -> name) */
    agents: Record<number, string>;
}

/** 分析模式 */
export type AnalysisMode = 'used' | 'inverse';

/** 槽位类型 */
export type SlotType = 'slot4' | 'slot5' | 'slot6' | 'subStats';

/** 标准属性顺序配置 */
export interface StandardOrder {
    slot4: string[];
    slot5: string[];
    slot6: string[];
    subStats: string[];
}

/** 所有可能的属性配置 */
export interface AllPossibleStats {
    slot4: string[];
    slot5: string[];
    slot6: string[];
    subStats: string[];
}

/** 套装统计映射 */
export type SetStatsMap = Record<string, SetStats>;

/** 视图模式 */
export type ViewMode = 'stats' | 'edit';

/** 应用状态 */
export interface AppState {
    /** 代理人数据 */
    agents: Agent[];
    /** 文件句柄 (File System Access API) */
    fileHandle: FileSystemFileHandle | null;
    /** 是否有未保存的修改 */
    isDirty: boolean;
    /** 当前视图模式 */
    viewMode: ViewMode;
    /** 当前编辑的代理人ID */
    editingAgentId: number | null;
    /** 新增但未保存的代理人ID集合 */
    newAgentIds: Set<number>;
}

/** 状态变更监听器 */
export type StateChangeListener = (state: AppState) => void;
