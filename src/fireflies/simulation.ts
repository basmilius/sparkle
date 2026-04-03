import { SimulationCanvas } from '../simulation-canvas';
import { FireflyLayer } from './layer';

export interface FireflySimulationConfig {
    readonly count?: number;
    readonly color?: string;
    readonly size?: number;
    readonly speed?: number;
    readonly glowSpeed?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class FireflySimulation extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement, config: FireflySimulationConfig = {}) {
        super(canvas, new FireflyLayer(config), 60, config.canvasOptions ?? {colorSpace: 'display-p3'});
    }
}
