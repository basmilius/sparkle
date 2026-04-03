import { SimulationCanvas } from '../simulation-canvas';
import { DonutLayer } from './layer';

export interface DonutSimulationConfig {
    readonly background?: string;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
    readonly collisionPadding?: number;
    readonly colors?: string[];
    readonly count?: number;
    readonly mouseAvoidance?: boolean;
    readonly mouseAvoidanceRadius?: number;
    readonly mouseAvoidanceStrength?: number;
    readonly radiusRange?: [number, number];
    readonly repulsionStrength?: number;
    readonly rotationSpeedRange?: [number, number];
    readonly scale?: number;
    readonly speedRange?: [number, number];
    readonly thickness?: number;
}

export class DonutSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: DonutSimulationConfig = {}) {
        super(canvas, new DonutLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
