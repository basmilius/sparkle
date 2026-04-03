import { SimulationCanvas } from '../simulation-canvas';
import { PetalLayer } from './layer';

export interface PetalSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly wind?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class PetalSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: PetalSimulationConfig = {}) {
        super(canvas, new PetalLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
