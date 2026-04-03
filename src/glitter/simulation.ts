import { SimulationCanvas } from '../simulation-canvas';
import { GlitterLayer } from './layer';

export interface GlitterSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly groundLevel?: number;
    readonly maxSettled?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class GlitterSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: GlitterSimulationConfig = {}) {
        super(canvas, new GlitterLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
