import { Smoke } from './layer';
import type { SmokeConfig } from './layer';
import type { Effect } from '../effect';

export function createSmoke(config?: SmokeConfig): Effect<SmokeConfig> {
    return new Smoke(config);
}

export type { SmokeConfig };
