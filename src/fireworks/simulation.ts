import { SimulationCanvas } from '../simulation-canvas';
import { FireworkLayer } from './layer';
import type { Point } from '../point';
import type { FireworkSimulationConfig, FireworkVariant } from './types';

export class FireworkSimulation extends SimulationCanvas {
    readonly #layer: FireworkLayer;

    constructor(canvas: HTMLCanvasElement, config: FireworkSimulationConfig = {}) {
        const layer = new FireworkLayer(config);
        super(canvas, layer, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
        this.#layer = layer;
    }

    fireExplosion(variant: FireworkVariant, position?: Point): void {
        this.#layer.fireExplosion(variant, position);
    }
}
