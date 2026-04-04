import type { TopographyConfig } from './layer';
import { Topography } from './layer';
import type { Effect } from '../effect';

export function createTopography(config?: TopographyConfig): Effect<TopographyConfig> {
    return new Topography(config);
}

export type { TopographyConfig };
