import { SimulationCanvas } from '../simulation-canvas';
import { LightningLayer } from './layer';

export interface LightningSimulationConfig {
    readonly frequency?: number;
    readonly color?: string;
    readonly branches?: boolean;
    readonly flash?: boolean;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class LightningSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: LightningSimulationConfig = {}) {
        super(canvas, new LightningLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
