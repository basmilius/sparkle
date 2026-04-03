import { SimulationCanvas } from '../simulation-canvas';
import { LanternLayer } from './layer';

export interface LanternSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class LanternSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: LanternSimulationConfig = {}) {
        super(canvas, new LanternLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
