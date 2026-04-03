import { Glitter } from './layer';
import type { GlitterConfig } from './types';
import type { Effect } from '../effect';

export function createGlitter(config?: GlitterConfig): Effect<GlitterConfig> {
    return new Glitter(config);
}

export type { GlitterConfig, FallingGlitter, SettledGlitter } from './types';
