import type { AuroraConfig } from './layer';
import { Aurora } from './layer';
import type { Effect } from '../effect';

export function createAurora(config?: AuroraConfig): Effect<AuroraConfig> {
    return new Aurora(config);
}

export type { AuroraConfig };
export type { AuroraBand } from './types';
