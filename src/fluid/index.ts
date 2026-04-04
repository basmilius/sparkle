import { Fluid } from './layer';
import type { FluidConfig } from './layer';
import type { Effect } from '../effect';

export function createFluid(config?: FluidConfig): Effect<FluidConfig> {
    return new Fluid(config);
}

export type { FluidConfig };
