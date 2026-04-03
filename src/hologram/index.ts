import { Hologram } from './layer';
import type { HologramConfig } from './types';
import type { Effect } from '../effect';

export function createHologram(config?: HologramConfig): Effect<HologramConfig> {
    return new Hologram(config);
}

export type { HologramConfig, HologramFragment } from './types';
