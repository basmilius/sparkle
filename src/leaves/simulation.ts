import { SimulationCanvas } from '../simulation-canvas';
import { LeafLayer } from './layer';

export interface LeafSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly wind?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class LeafSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: LeafSimulationConfig = {}) {
        super(canvas, new LeafLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
