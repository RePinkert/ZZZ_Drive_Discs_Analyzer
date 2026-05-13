import { loadSetIdMap } from './setVariablesLoader.js';

const AGENT_IMG_BASE = 'assets/agents';
const SET_IMG_BASE = 'assets/sets';

let _setIdMap: Record<string, number> | null = null;

export async function initImageService(): Promise<void> {
    _setIdMap = await loadSetIdMap();
}

export function getAgentImageUrl(agentId: number): string {
    return `${AGENT_IMG_BASE}/${agentId}.webp`;
}

export function getSetImageUrl(setName: string): string {
    if (!_setIdMap) return '';
    const id = _setIdMap[setName];
    if (!id) return '';
    return `${SET_IMG_BASE}/${id}.webp`;
}
