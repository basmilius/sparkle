import { SimulationCanvas } from '../simulation-canvas';
import { SandstormLayer } from './layer';

export interface SandstormSimulationConfig {
    readonly count?: number;
    readonly wind?: number;
    readonly turbulence?: number;
    readonly color?: string;
    readonly hazeOpacity?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class SandstormSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: SandstormSimulationConfig = {}) {
        super(canvas, new SandstormLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
