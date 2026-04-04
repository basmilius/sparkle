import type { BubblesConfig } from './layer';
import { Bubbles } from './layer';
import type { Effect } from '../effect';

export function createBubbles(config?: BubblesConfig): Effect<BubblesConfig> {
    return new Bubbles(config);
}

export type { BubblesConfig };
export type { Bubble, PopParticle } from './types';
