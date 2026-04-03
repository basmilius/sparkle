import { SimulationCanvas } from '../simulation-canvas';
import { LanternLayer } from './layer';

export interface LanternSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class LanternSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: LanternSimulationConfig = {}) {
        super(canvas, new LanternLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
