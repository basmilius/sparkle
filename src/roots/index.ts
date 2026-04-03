import { Roots } from './layer';
import type { RootsConfig } from './layer';
import type { Effect } from '../effect';

export function createRoots(config?: RootsConfig): Effect<RootsConfig> {
    return new Roots(config);
}

export type { RootsConfig };
