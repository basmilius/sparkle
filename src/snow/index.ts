import { Snow } from './layer';
import type { SnowConfig } from './layer';
import type { Effect } from '../effect';

export function createSnow(config?: SnowConfig): Effect<SnowConfig> {
    return new Snow(config);
}

export type { SnowConfig };
