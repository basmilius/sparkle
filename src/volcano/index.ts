import { Volcano } from './layer';
import type { VolcanoConfig } from './layer';
import type { Effect } from '../effect';

export function createVolcano(config?: VolcanoConfig): Effect<VolcanoConfig> {
    return new Volcano(config);
}

export type { VolcanoConfig };
export type { VolcanoProjectile } from './types';
