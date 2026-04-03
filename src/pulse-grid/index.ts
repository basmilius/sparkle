import { PulseGrid } from './layer';
import type { PulseGridConfig } from './layer';
import type { Effect } from '../effect';

export function createPulseGrid(config?: PulseGridConfig): Effect<PulseGridConfig> {
    return new PulseGrid(config);
}

export type { PulseGridConfig };
export type { PulseWave } from './types';
