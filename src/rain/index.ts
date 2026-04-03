import { Rain } from './layer';
import type { RainConfig } from './layer';
import type { Effect } from '../effect';

export function createRain(config?: RainConfig): Effect<RainConfig> {
    return new Rain(config);
}

export { RaindropParticle, SplashParticle } from './particle';
export type { RainConfig };
export type { RaindropParticleConfig, SplashParticleConfig } from './particle';
export type { Raindrop, RainVariant, Splash } from './types';
