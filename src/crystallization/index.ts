import type { CrystallizationConfig } from './layer';
import { Crystallization } from './layer';
import type { Effect } from '../effect';

export function createCrystallization(config?: CrystallizationConfig): Effect<CrystallizationConfig> {
    return new Crystallization(config);
}

export type { CrystallizationConfig };
export type { CrystalBranch, CrystalSeed } from './types';
