import type { NebulaConfig } from './layer';
import { Nebula } from './layer';
import type { Effect } from '../effect';

export function createNebula(config?: NebulaConfig): Effect<NebulaConfig> {
    return new Nebula(config);
}

export type { NebulaConfig };
export type { NebulaBlob, NebulaStar } from './types';
