import type { SoundWavesConfig } from './layer';
import { SoundWaves } from './layer';
import type { Effect } from '../effect';

export function createSoundWaves(config?: SoundWavesConfig): Effect<SoundWavesConfig> {
    return new SoundWaves(config);
}

export type { SoundWavesConfig };
export type { WaveSource } from './types';
