import { Balloons } from './layer';
import type { BalloonsConfig } from './layer';
import type { Effect } from '../effect';

export function createBalloons(config?: BalloonsConfig): Effect<BalloonsConfig> {
    return new Balloons(config);
}

export { BalloonParticle } from './particle';
export type { BalloonsConfig };
export type { BalloonParticleConfig } from './particle';
export type { Balloon } from './types';
