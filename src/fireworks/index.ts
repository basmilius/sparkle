import { Fireworks } from './layer';
import type { FireworksConfig, FireworkVariant } from './types';
import type { Point } from '../point';
import type { Effect } from '../effect';

export interface FireworksInstance extends Effect<FireworksConfig> {
    launch(variant: FireworkVariant, position?: Point): void;
}

export function createFireworks(config?: FireworksConfig): FireworksInstance {
    return new Fireworks(config) as FireworksInstance;
}

export { createExplosion } from './create-explosion';
export { Explosion } from './explosion';
export { Firework } from './firework';
export { Spark } from './spark';
export { EXPLOSION_CONFIGS, FIREWORK_VARIANTS } from './types';
export type { ExplosionConfig, ExplosionType, FireworksConfig, FireworkVariant, ParticleShape } from './types';
