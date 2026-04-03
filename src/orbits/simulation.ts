import { SimulationCanvas } from '../simulation-canvas';
import { OrbitLayer } from './layer';

export interface OrbitSimulationConfig {
    readonly centers?: number;
    readonly orbitersPerCenter?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly trailLength?: number;
    readonly showCenters?: boolean;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class OrbitSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: OrbitSimulationConfig = {}) {
        super(canvas, new OrbitLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
