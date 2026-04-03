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
    }
}
