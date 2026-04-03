import { Caustics } from './layer';
import type { CausticsConfig } from './layer';
import type { Effect } from '../effect';

export function createCaustics(config?: CausticsConfig): Effect<CausticsConfig> {
    return new Caustics(config);
}

export type { CausticsConfig };
