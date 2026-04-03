import { SimulationCanvas } from '../simulation-canvas';
import { AuroraLayer } from './layer';

export interface AuroraSimulationConfig {
    readonly bands?: number;
    readonly colors?: string[];
    readonly speed?: number;
    readonly intensity?: number;
    readonly waveAmplitude?: number;
    readonly verticalPosition?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class AuroraSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: AuroraSimulationConfig = {}) {
        super(canvas, new AuroraLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
