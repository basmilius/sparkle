import { Streamers } from './layer';
import type { StreamersConfig } from './layer';
import type { Effect } from '../effect';

export function createStreamers(config?: StreamersConfig): Effect<StreamersConfig> {
    return new Streamers(config);
}

export type { StreamersConfig };
export type { Streamer } from './types';
