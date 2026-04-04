import type { HyperSpaceConfig } from './layer';
import { HyperSpace } from './layer';
import type { Effect } from '../effect';

export function createHyperSpace(config?: HyperSpaceConfig): Effect<HyperSpaceConfig> {
    return new HyperSpace(config);
}

export type { HyperSpaceConfig };
export type { HyperSpaceStar } from './types';
