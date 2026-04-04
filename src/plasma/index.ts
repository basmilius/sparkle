import type { PlasmaConfig } from './layer';
import { Plasma } from './layer';
import type { Effect } from '../effect';

export function createPlasma(config?: PlasmaConfig): Effect<PlasmaConfig> {
    return new Plasma(config);
}

export type { PlasmaConfig };
export type { PlasmaColor } from './types';
