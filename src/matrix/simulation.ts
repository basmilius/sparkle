import { SimulationCanvas } from '../simulation-canvas';
import { MatrixLayer } from './layer';

export interface MatrixSimulationConfig {
    readonly columns?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly fontSize?: number;
    readonly trailLength?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class MatrixSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: MatrixSimulationConfig = {}) {
        super(canvas, new MatrixLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
