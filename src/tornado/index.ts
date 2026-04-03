import { Tornado } from './layer';
import type { TornadoConfig } from './layer';
import type { Effect } from '../effect';

export function createTornado(config?: TornadoConfig): Effect<TornadoConfig> {
    return new Tornado(config);
}

export type { TornadoConfig };
export type { TornadoDebris, TornadoParticle } from './types';
