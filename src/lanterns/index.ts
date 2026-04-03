import { Lanterns } from './layer';
import type { LanternsConfig } from './types';
import type { Effect } from '../effect';

export function createLanterns(config?: LanternsConfig): Effect<LanternsConfig> {
    return new Lanterns(config);
}

export type { LanternsConfig, Lantern } from './types';
