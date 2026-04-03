import { SimulationCanvas } from '../simulation-canvas';
import { BubbleLayer } from './layer';

export interface BubbleSimulationConfig {
    readonly count?: number;
    readonly sizeRange?: [number, number];
    readonly speed?: number;
    readonly popOnClick?: boolean;
    readonly popRadius?: number;
    readonly colors?: string[];
    readonly wobbleAmount?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class BubbleSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: BubbleSimulationConfig = {}) {
        super(canvas, new BubbleLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
