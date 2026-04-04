import type { WavesConfig } from './layer';
import { Waves } from './layer';
import type { Effect } from '../effect';

export function createWaves(config?: WavesConfig): Effect<WavesConfig> {
    return new Waves(config);
}

export type { WavesConfig };
export type { Wave } from './types';
