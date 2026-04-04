import type { SandstormConfig } from './layer';
import { Sandstorm } from './layer';
import type { Effect } from '../effect';

export function createSandstorm(config?: SandstormConfig): Effect<SandstormConfig> {
    return new Sandstorm(config);
}

export type { SandstormConfig };
export type { SandGrain } from './types';
