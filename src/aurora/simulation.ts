import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { AuroraBand } from './types';

export interface AuroraSimulationConfig {
    readonly bands?: number;
    readonly colors?: string[];
    readonly speed?: number;
    readonly intensity?: number;
    readonly waveAmplitude?: number;
    readonly verticalPosition?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const DEFAULT_COLORS = ['#00ff88', '#00aaff', '#8844ff', '#ff44aa'];

export class AuroraSimulation extends LimitedFrameRateCanvas {
    readonly #speed: number;
    readonly #intensity: number;
    readonly #waveAmplitude: number;
    readonly #verticalPosition: number;
    #time: number = 0;
    #bands: AuroraBand[] = [];

    constructor(canvas: HTMLCanvasElement, config: AuroraSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        const bandCount = config.bands ?? 4;
        const colors = config.colors ?? DEFAULT_COLORS;
        this.#speed = config.speed ?? 1;
        this.#intensity = config.intensity ?? 0.6;
        this.#waveAmplitude = config.waveAmplitude ?? 1;
        this.#verticalPosition = config.verticalPosition ?? 0.3;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        for (let i = 0; i < bandCount; i++) {
            const color = colors[i % colors.length];
            const [r, g, b] = hexToRGB(color);
            const hue = this.#rgbToHue(r, g, b);

            this.#bands.push({
                baseY: this.#verticalPosition + (i - bandCount / 2) * 0.06,
                hue,
                amplitude1: (30 + MULBERRY.next() * 40) * this.#waveAmplitude,
                frequency1: 0.002 + MULBERRY.next() * 0.003,
                phase1: MULBERRY.next() * Math.PI * 2,
                amplitude2: (15 + MULBERRY.next() * 25) * this.#waveAmplitude,
                frequency2: 0.005 + MULBERRY.next() * 0.005,
                phase2: MULBERRY.next() * Math.PI * 2,
                speed: (0.3 + MULBERRY.next() * 0.7) * this.#speed,
                width: 60 + MULBERRY.next() * 80,
                opacity: (0.3 + MULBERRY.next() * 0.4) * this.#intensity
            });
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.globalCompositeOperation = 'screen';

        const step = 2;

        for (const band of this.#bands) {
            const centerY = band.baseY * this.height;
            const spread = band.width * (this.height / 800);
            const hue = (band.hue + this.#time * 2) % 360;

            for (let x = 0; x < this.width; x += step) {
                const yOffset = band.amplitude1 * Math.sin(band.frequency1 * x + band.phase1)
                              + band.amplitude2 * Math.sin(band.frequency2 * x + band.phase2);
                const cy = centerY + yOffset;

                const gradient = ctx.createLinearGradient(0, cy - spread, 0, cy + spread);
                gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
                gradient.addColorStop(0.25, `hsla(${hue}, 80%, 60%, ${band.opacity * 0.3})`);
                gradient.addColorStop(0.5, `hsla(${hue}, 80%, 60%, ${band.opacity})`);
                gradient.addColorStop(0.75, `hsla(${hue}, 80%, 60%, ${band.opacity * 0.3})`);
                gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(x, cy - spread, step, spread * 2);
            }
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        this.#time += 0.01 * dt * this.#speed;

        for (const band of this.#bands) {
            band.phase1 += 0.008 * band.speed * dt;
            band.phase2 += 0.012 * band.speed * dt;
        }
    }

    #rgbToHue(r: number, g: number, b: number): number {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        if (delta === 0) {
            return 0;
        }

        let hue: number;

        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }

        hue = Math.round(hue * 60);

        if (hue < 0) {
            hue += 360;
        }

        return hue;
    }
}
