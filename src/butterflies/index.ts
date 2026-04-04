import type { ButterfliesConfig } from './layer';
import { Butterflies } from './layer';
import type { Effect } from '../effect';

export function createButterflies(config?: ButterfliesConfig): Effect<ButterfliesConfig> {
    return new Butterflies(config);
}

export type { ButterfliesConfig };
