import { Tessellation } from './layer';
import type { TessellationConfig } from './layer';
import type { Effect } from '../effect';

export function createTessellation(config?: TessellationConfig): Effect<TessellationConfig> {
    return new Tessellation(config);
}

export type { TessellationConfig };
export type { TessellationTile } from './types';
