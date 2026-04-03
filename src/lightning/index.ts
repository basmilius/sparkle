import { Lightning } from './layer';
import type { LightningConfig } from './types';
import type { Effect } from '../effect';

export function createLightning(config?: LightningConfig): Effect<LightningConfig> {
    return new Lightning(config);
}

export { LightningSystem } from './system';
export type { LightningSystemConfig } from './system';
export type { LightningConfig, LightningBolt, LightningBranch } from './types';
