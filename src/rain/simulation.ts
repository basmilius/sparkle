import { SimulationCanvas } from '../simulation-canvas';
import { RainLayer } from './layer';
import type { RainVariant } from './types';

export interface RainSimulationConfig {
    readonly variant?: RainVariant;
    readonly drops?: number;
    readonly wind?: number;
    readonly speed?: number;
    readonly splashes?: boolean;
    readonly color?: string;
    readonly groundLevel?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class RainSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: RainSimulationConfig = {}) {
        super(canvas, new RainLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
