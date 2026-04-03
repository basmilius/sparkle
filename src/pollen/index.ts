import { Pollen } from './layer';
import type { PollenConfig } from './layer';
import type { Effect } from '../effect';

export function createPollen(config?: PollenConfig): Effect<PollenConfig> {
    return new Pollen(config);
}

export type { PollenConfig };
export type { PollenParticle } from './types';
