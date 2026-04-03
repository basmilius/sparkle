import { Constellation } from './layer';
import type { ConstellationConfig } from './layer';
import type { Effect } from '../effect';

export function createConstellation(config?: ConstellationConfig): Effect<ConstellationConfig> {
    return new Constellation(config);
}

export type { ConstellationConfig };
export type { ConstellationStar } from './types';
