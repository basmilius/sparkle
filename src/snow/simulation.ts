import { SimulationCanvas } from '../simulation-canvas';
import { SnowLayer } from './layer';

export interface SnowSimulationConfig {
    readonly fillStyle?: string;
    readonly particles?: number;
    readonly scale?: number;
    readonly size?: number;
    readonly speed?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class SnowSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: SnowSimulationConfig = {}) {
        super(canvas, new SnowLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
