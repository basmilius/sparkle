import { Petals } from './layer';
import type { PetalsConfig } from './layer';
import type { Effect } from '../effect';

export function createPetals(config?: PetalsConfig): Effect<PetalsConfig> {
    return new Petals(config);
}

export type { PetalsConfig };
export type { Petal } from './types';
