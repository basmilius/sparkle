import { Interference } from './layer';
import type { InterferenceConfig } from './layer';
import type { Effect } from '../effect';

export function createInterference(config?: InterferenceConfig): Effect<InterferenceConfig> {
    return new Interference(config);
}

export type { InterferenceConfig };
