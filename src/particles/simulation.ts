import { SimulationCanvas } from '../simulation-canvas';
import { ParticleLayer } from './layer';

export interface ParticleSimulationConfig {
    readonly count?: number;
    readonly color?: string;
    readonly lineColor?: string;
    readonly size?: [number, number];
    readonly speed?: [number, number];
    readonly connectionDistance?: number;
    readonly lineWidth?: number;
    readonly mouseMode?: import('./types').ParticleMouseMode;
    readonly mouseRadius?: number;
    readonly mouseStrength?: number;
    readonly particleForces?: boolean;
    readonly glow?: boolean;
    readonly background?: string | null;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class ParticleSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: ParticleSimulationConfig = {}) {
        super(canvas, new ParticleLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
