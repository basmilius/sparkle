import type { ConfettiConfig } from './layer';
import { Confetti } from './layer';
import type { Config as ConfettiBurstConfig } from './types';
import type { Effect } from '../effect';

export interface ConfettiInstance extends Effect<ConfettiConfig> {
    burst(config: Partial<ConfettiBurstConfig>): void;
}

export function createConfetti(config?: ConfettiConfig): ConfettiInstance {
    return new Confetti(config) as ConfettiInstance;
}

export { ConfettiParticle } from './particle';
export { PALETTES } from './consts';
export { SHAPE_PATHS } from './shapes';
export type { ConfettiConfig };
export type { ConfettiBurstConfig };
export type { ConfettiParticleConfig } from './particle';
export type { Palette, Shape as ConfettiShape } from './types';
