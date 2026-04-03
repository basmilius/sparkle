import { Glitch } from './layer';
import type { GlitchConfig } from './types';
import type { Effect } from '../effect';

export function createGlitch(config?: GlitchConfig): Effect<GlitchConfig> {
    return new Glitch(config);
}

export type { GlitchConfig, GlitchSlice, GlitchBlock } from './types';
