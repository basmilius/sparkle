import { GradientFlow } from './layer';
import type { GradientFlowConfig } from './layer';
import type { Effect } from '../effect';

export function createGradientFlow(config?: GradientFlowConfig): Effect<GradientFlowConfig> {
    return new GradientFlow(config);
}

export type { GradientFlowConfig };
