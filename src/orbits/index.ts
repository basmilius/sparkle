import { Orbits } from './layer';
import type { OrbitsConfig } from './types';
import type { Effect } from '../effect';

export function createOrbits(config?: OrbitsConfig): Effect<OrbitsConfig> {
    return new Orbits(config);
}

export type { OrbitsConfig, OrbitalCenter, Orbiter } from './types';
