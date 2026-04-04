import type { MagneticSandConfig } from './layer';
import { MagneticSand } from './layer';
import type { Effect } from '../effect';

export function createMagneticSand(config?: MagneticSandConfig): Effect<MagneticSandConfig> {
    return new MagneticSand(config);
}

export type { MagneticSandConfig };
export type { SandGrain } from './types';
