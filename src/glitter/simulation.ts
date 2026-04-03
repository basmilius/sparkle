import { SimulationCanvas } from '../simulation-canvas';
import { GlitterLayer } from './layer';

export interface GlitterSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly groundLevel?: number;
    readonly maxSettled?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class GlitterSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: GlitterSimulationConfig = {}) {
        super(canvas, new GlitterLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
