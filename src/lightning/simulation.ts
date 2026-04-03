import { SimulationCanvas } from '../simulation-canvas';
import { LightningLayer } from './layer';

export interface LightningSimulationConfig {
    readonly frequency?: number;
    readonly color?: string;
    readonly branches?: boolean;
    readonly flash?: boolean;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class LightningSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: LightningSimulationConfig = {}) {
        super(canvas, new LightningLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
