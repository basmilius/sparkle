import type { PrimordialSoupConfig } from './layer';
import { PrimordialSoup } from './layer';
import type { Effect } from '../effect';

export function createPrimordialSoup(config?: PrimordialSoupConfig): Effect<PrimordialSoupConfig> {
    return new PrimordialSoup(config);
}

export type { PrimordialSoupConfig };
export type { Cell, DividingCell, FoodParticle } from './types';
