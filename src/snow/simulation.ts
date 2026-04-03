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
    }
}
