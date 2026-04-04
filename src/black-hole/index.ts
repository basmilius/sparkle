import type { BlackHoleConfig } from './layer';
import { BlackHole } from './layer';
import type { Effect } from '../effect';

export function createBlackHole(config?: BlackHoleConfig): Effect<BlackHoleConfig> {
    return new BlackHole(config);
}

export type { BlackHoleConfig };
export type { BlackHoleParticle } from './types';
