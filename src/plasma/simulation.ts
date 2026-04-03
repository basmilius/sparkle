import { SimulationCanvas } from '../simulation-canvas';
import { PlasmaLayer } from './layer';
import type { PlasmaColor } from './types';

export interface PlasmaSimulationConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly palette?: PlasmaColor[];
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class PlasmaSimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: PlasmaSimulationConfig = {}) {
        super(canvas, new PlasmaLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }
}
