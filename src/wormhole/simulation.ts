import { SimulationCanvas } from '../simulation-canvas';
import { WormholeLayer } from './layer';

export interface WormholeSimulationConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly direction?: import('./types').WormholeDirection;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class WormholeSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: WormholeSimulationConfig = {}) {
        super(canvas, new WormholeLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
