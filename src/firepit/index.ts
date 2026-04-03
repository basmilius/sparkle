import { Firepit } from './layer';
import type { FirepitConfig } from './layer';
import type { Effect } from '../effect';

export function createFirepit(config?: FirepitConfig): Effect<FirepitConfig> {
    return new Firepit(config);
}

export type { FirepitConfig };
export type { Ember, FlameLayer } from './types';
