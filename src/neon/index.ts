import { Neon } from './layer';
import type { NeonConfig } from './layer';
import type { Effect } from '../effect';

export function createNeon(config?: NeonConfig): Effect<NeonConfig> {
    return new Neon(config);
}

export type { NeonConfig };
