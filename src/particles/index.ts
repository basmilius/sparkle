import { Particles } from './layer';
import type { ParticlesConfig } from './layer';
import type { Effect } from '../effect';

export function createParticles(config?: ParticlesConfig): Effect<ParticlesConfig> {
    return new Particles(config);
}

export type { ParticlesConfig };
export type { NetworkParticle, ParticleMouseMode } from './types';
