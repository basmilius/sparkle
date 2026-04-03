import { Kaleidoscope } from './layer';
import type { KaleidoscopeConfig } from './types';
import type { Effect } from '../effect';

export function createKaleidoscope(config?: KaleidoscopeConfig): Effect<KaleidoscopeConfig> {
    return new Kaleidoscope(config);
}

export type { KaleidoscopeConfig, KaleidoscopeShape } from './types';
