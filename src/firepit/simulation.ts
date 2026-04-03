import { SimulationCanvas } from '../simulation-canvas';
import { FirepitLayer } from './layer';

export interface FirepitSimulationConfig {
    readonly embers?: number;
    readonly flameWidth?: number;
    readonly flameHeight?: number;
    readonly intensity?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class FirepitSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: FirepitSimulationConfig = {}) {
        super(canvas, new FirepitLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
