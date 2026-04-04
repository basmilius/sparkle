import type { CloudsConfig } from './layer';
import { Clouds } from './layer';
import type { Effect } from '../effect';

export function createClouds(config?: CloudsConfig): Effect<CloudsConfig> {
    return new Clouds(config);
}

export type { CloudsConfig };
