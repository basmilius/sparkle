import type { StarsConfig } from './layer';
import { Stars } from './layer';
import type { Effect } from '../effect';

export function createStars(config?: StarsConfig): Effect<StarsConfig> {
    return new Stars(config);
}

export type { StarsConfig };
export type { Star, StarMode, ShootingStar } from './types';
