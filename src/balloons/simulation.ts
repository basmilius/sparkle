import { SimulationCanvas } from '../simulation-canvas';
import { BalloonLayer } from './layer';

export interface BalloonSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly sizeRange?: [number, number];
    readonly speed?: number;
    readonly driftAmount?: number;
    readonly stringLength?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class BalloonSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: BalloonSimulationConfig = {}) {
        super(canvas, new BalloonLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
