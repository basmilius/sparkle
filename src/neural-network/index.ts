import { NeuralNetwork } from './layer';
import type { NeuralNetworkConfig } from './layer';
import type { Effect } from '../effect';

export function createNeuralNetwork(config?: NeuralNetworkConfig): Effect<NeuralNetworkConfig> {
    return new NeuralNetwork(config);
}

export type { NeuralNetworkConfig };
export type { ArmSegment, NeuronCell, SynapticPulse } from './types';
