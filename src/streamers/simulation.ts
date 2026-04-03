import { SimulationCanvas } from '../simulation-canvas';
import { StreamerLayer } from './layer';

export interface StreamerSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly speed?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class StreamerSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: StreamerSimulationConfig = {}) {
        super(canvas, new StreamerLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
