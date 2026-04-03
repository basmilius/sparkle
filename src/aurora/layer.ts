import { hexToRGB } from '@basmilius/utils';
import { SimulationLayer } from '../layer';
import { MULBERRY } from './consts';
import type { AuroraSimulationConfig } from './simulation';
import type { AuroraBand } from './types';

const DEFAULT_COLORS = ['#9922ff', '#4455ff', '#0077ee', '#00aabb', '#22ddff'];
const TOP_HUE = 265;

export class AuroraLayer extends SimulationLayer {
    readonly #speed: number;
    readonly #intensity: number;
    readonly #waveAmplitude: number;
    readonly #verticalPosition: number;
    #time: number = 0;
    #bands: AuroraBand[] = [];

    constructor(config: AuroraSimulationConfig = {}) {
        super();

        const bandCount = config.bands ?? 5;
        const colors = config.colors ?? DEFAULT_COLORS;
        this.#speed = config.speed ?? 1;
        this.#intensity = config.intensity ?? 0.8;
        this.#waveAmplitude = config.waveAmplitude ?? 1;
        this.#verticalPosition = config.verticalPosition ?? 0.68;

        // Two loose clusters (left + right), rays within each cluster overlap into a whole
        const clusterCenters = [0.35, 0.65];

        for (let i = 0; i < bandCount; i++) {
            const color = colors[i % colors.length];
            const [r, g, b] = hexToRGB(color);
            const hue = this.#rgbToHue(r, g, b);
            const cluster = clusterCenters[i % clusterCenters.length];

            this.#bands.push({
                x: cluster + (MULBERRY.next() - 0.5) * 0.22,
                baseY: this.#verticalPosition + (MULBERRY.next() - 0.5) * 0.08,
                height: 0.5 + MULBERRY.next() * 0.3,
                sigma: 160 + MULBERRY.next() * 110,
                phase1: MULBERRY.next() * Math.PI * 2,
                phase2: MULBERRY.next() * Math.PI * 2,
                amplitude1: 0.015 + MULBERRY.next() * 0.025,
                frequency1: 0.003 + MULBERRY.next() * 0.004,
                speed: (0.4 + MULBERRY.next() * 0.6) * this.#speed,
                hue,
                opacity: (0.5 + MULBERRY.next() * 0.3) * this.#intensity
            });
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.016 * dt * this.#speed;

        for (const band of this.#bands) {
            band.phase1 += 0.005 * band.speed * dt;
            band.phase2 += 0.008 * band.speed * dt;
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        // Dark sky background gradient
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, '#000000');
        bg.addColorStop(0.5, '#050012');
        bg.addColorStop(1, '#0a0025');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Aurora curtain rays — vertical bands with Gaussian horizontal falloff
        ctx.globalCompositeOperation = 'screen';

        const step = 4;
        const scale = width / 1920;

        for (const band of this.#bands) {
            const swayX = band.amplitude1 * width * Math.sin(band.phase1);
            const cx = band.x * width + swayX;
            const baseY = band.baseY * height;
            const rayHeight = band.height * height * (height / 800);
            const sigma = band.sigma * scale;
            const cutoff = sigma * 3.5;
            const sigmaSq2 = 2 * sigma * sigma;
            const midHue = (band.hue + TOP_HUE) / 2;
            const waveRange = height * 0.035 * this.#waveAmplitude;

            const xStart = Math.max(0, Math.floor((cx - cutoff) / step) * step);
            const xEnd = Math.min(width, Math.ceil((cx + cutoff) / step) * step);

            for (let x = xStart; x < xEnd; x += step) {
                const dx = x - cx;
                const alpha = Math.exp(-dx * dx / sigmaSq2);

                if (alpha < 0.015) {
                    continue;
                }

                const waveOffset = Math.sin(band.frequency1 * x + band.phase2) * waveRange;
                const colBase = baseY + waveOffset;
                const colTop = colBase - rayHeight;
                const fadeBottom = colBase + rayHeight * 0.1;
                const eff = alpha * band.opacity;

                const gradient = ctx.createLinearGradient(0, fadeBottom, 0, colTop);
                gradient.addColorStop(0, `hsla(${band.hue}, 100%, 90%, 0)`);
                gradient.addColorStop(0.04, `hsla(${band.hue}, 100%, 90%, ${eff * 0.55})`);
                gradient.addColorStop(0.1, `hsla(${band.hue}, 90%, 72%, ${eff})`);
                gradient.addColorStop(0.32, `hsla(${band.hue}, 85%, 62%, ${eff * 0.75})`);
                gradient.addColorStop(0.62, `hsla(${midHue}, 80%, 56%, ${eff * 0.35})`);
                gradient.addColorStop(0.86, `hsla(${TOP_HUE}, 75%, 50%, ${eff * 0.12})`);
                gradient.addColorStop(1, `hsla(${TOP_HUE}, 70%, 45%, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(x, colTop, step, fadeBottom - colTop + 1);
            }
        }

        ctx.globalCompositeOperation = 'source-over';
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
