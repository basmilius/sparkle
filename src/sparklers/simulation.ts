import { SimulationCanvas } from '../simulation-canvas';
import { SparklerLayer } from './layer';

export interface SparklerSimulationConfig {
    readonly emitRate?: number;
    readonly maxSparks?: number;
    readonly colors?: string[];
    readonly speed?: [number, number];
    readonly friction?: number;
    readonly gravity?: number;
    readonly decay?: [number, number];
    readonly trailLength?: number;
    readonly hoverMode?: boolean;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class SparklerSimulation extends SimulationCanvas {
    readonly #layer: SparklerLayer;

    constructor(canvas: HTMLCanvasElement, config: SparklerSimulationConfig = {}) {
        const layer = new SparklerLayer(config);
        super(canvas, layer, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
        this.#layer = layer;

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }

    setPosition(x: number, y: number): void {
        this.#layer.setPosition(x, y);
    }
}
