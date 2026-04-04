import type { CoralReefConfig } from './layer';
import { CoralReef } from './layer';
import type { Effect } from '../effect';

export function createCoralReef(config?: CoralReefConfig): Effect<CoralReefConfig> {
    return new CoralReef(config);
}

export type { CoralReefConfig };
export type { CoralAnemone, CoralBubble, CoralJellyfish } from './types';
