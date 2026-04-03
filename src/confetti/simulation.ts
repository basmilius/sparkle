import { SimulationCanvas } from '../simulation-canvas';
import { ConfettiLayer } from './layer';
import type { Config } from './types';

export interface ConfettiSimulationConfig {
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class ConfettiSimulation extends SimulationCanvas {
    readonly #layer: ConfettiLayer;

    constructor(canvas: HTMLCanvasElement, config: ConfettiSimulationConfig = {}) {
        const layer = new ConfettiLayer(config);
        super(canvas, layer, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
        this.#layer = layer;
    }

    fire(config: Partial<Config>): void {
        this.onResize();
        this.#layer.fire(config);

        if (!this.isTicking) {
            this.start();
        }
    }
}
