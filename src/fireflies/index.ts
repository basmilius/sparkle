import { Fireflies } from './layer';
import type { FirefliesConfig } from './layer';
import type { Effect } from '../effect';

export function createFireflies(config?: FirefliesConfig): Effect<FirefliesConfig> {
    return new Fireflies(config);
}

export { FireflyParticle, createFireflySprite } from './particle';
export type { FirefliesConfig };
export type { FireflyParticleConfig } from './particle';
export type { Firefly } from './types';
