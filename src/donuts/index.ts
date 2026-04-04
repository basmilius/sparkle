import type { DonutsConfig } from './layer';
import { Donuts } from './layer';
import type { Effect } from '../effect';

export function createDonuts(config?: DonutsConfig): Effect<DonutsConfig> {
    return new Donuts(config);
}

export type { DonutsConfig };
