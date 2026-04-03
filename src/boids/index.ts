import { Boids } from './layer';
import type { BoidsConfig } from './layer';
import type { Effect } from '../effect';

export function createBoids(config?: BoidsConfig): Effect<BoidsConfig> {
    return new Boids(config);
}

export type { BoidsConfig };
