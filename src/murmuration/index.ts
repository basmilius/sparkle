import { Murmuration } from './layer';
import type { MurmurationConfig } from './layer';
import type { Effect } from '../effect';

export function createMurmuration(config?: MurmurationConfig): Effect<MurmurationConfig> {
    return new Murmuration(config);
}

export type { MurmurationConfig };
export type { MurmurationBird } from './types';
