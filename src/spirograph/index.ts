import type { SpirographConfig } from './layer';
import { Spirograph } from './layer';
import type { Effect } from '../effect';

export function createSpirograph(config?: SpirographConfig): Effect<SpirographConfig> {
    return new Spirograph(config);
}

export type { SpirographConfig };
export type { SpirographCurve } from './types';
