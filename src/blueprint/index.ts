import { Blueprint } from './layer';
import type { BlueprintConfig } from './layer';
import type { Effect } from '../effect';

export function createBlueprint(config?: BlueprintConfig): Effect<BlueprintConfig> {
    return new Blueprint(config);
}

export type { BlueprintConfig };
export type { BlueprintElement } from './types';
