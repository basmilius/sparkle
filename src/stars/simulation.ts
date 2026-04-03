import { SimulationCanvas } from '../simulation-canvas';
import { StarLayer } from './layer';

export interface StarSimulationConfig {
    readonly mode?: import('./types').StarMode;
    readonly starCount?: number;
    readonly shootingInterval?: [number, number];
    readonly shootingSpeed?: number;
    readonly twinkleSpeed?: number;
    readonly color?: string;
    readonly shootingColor?: string;
    readonly trailLength?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class StarSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: StarSimulationConfig = {}) {
        super(canvas, new StarLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
