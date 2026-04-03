import { SimulationCanvas } from '../simulation-canvas';
import { WaveLayer } from './layer';

export interface WaveSimulationConfig {
    readonly layers?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly foamColor?: string;
    readonly foamAmount?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class WaveSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: WaveSimulationConfig = {}) {
        super(canvas, new WaveLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
