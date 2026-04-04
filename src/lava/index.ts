import type { LavaConfig } from './layer';
import { Lava } from './layer';
import type { Effect } from '../effect';

export function createLava(config?: LavaConfig): Effect<LavaConfig> {
    return new Lava(config);
}

export type { LavaConfig };
