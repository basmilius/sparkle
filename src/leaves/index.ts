import { Leaves } from './layer';
import type { LeavesConfig } from './types';
import type { Effect } from '../effect';

export function createLeaves(config?: LeavesConfig): Effect<LeavesConfig> {
    return new Leaves(config);
}

export type { LeavesConfig, Leaf } from './types';
