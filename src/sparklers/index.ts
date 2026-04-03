import { Sparklers } from './layer';
import type { SparklersConfig } from './layer';
import type { Effect } from '../effect';

export interface SparklersInstance extends Effect<SparklersConfig> {
    moveTo(x: number, y: number): void;
}

export function createSparklers(config?: SparklersConfig): SparklersInstance {
    return new Sparklers(config) as SparklersInstance;
}

export { SparklerParticle } from './particle';
export type { SparklersConfig };
export type { SparklerParticleConfig } from './particle';
export type { SparklerSpark } from './types';
