import type { PopcornConfig } from './layer';
import { Popcorn } from './layer';
import type { Effect } from '../effect';

export function createPopcorn(config?: PopcornConfig): Effect<PopcornConfig> {
    return new Popcorn(config);
}

export type { PopcornConfig };
export type { PopcornKernel } from './types';
