import { Wormhole } from './layer';
import type { WormholeConfig } from './layer';
import type { Effect } from '../effect';

export function createWormhole(config?: WormholeConfig): Effect<WormholeConfig> {
    return new Wormhole(config);
}

export type { WormholeConfig };
export type { WormholeDirection, WormholeParticle } from './types';
