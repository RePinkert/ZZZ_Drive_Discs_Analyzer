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
    if (!_setIdMap) {
        console.warn('imageService not initialized when requesting set image for:', setName);
        return `${SET_IMG_BASE}/0.webp`;
    }
    const id = _setIdMap[setName];
    if (!id) {
        console.warn('No set ID mapping for:', setName);
        return `${SET_IMG_BASE}/0.webp`;
    }
    return `${SET_IMG_BASE}/${id}.webp`;
}

export function getSetId(setName: string): number | null {
    if (!_setIdMap) return null;
    return _setIdMap[setName] ?? null;
}
