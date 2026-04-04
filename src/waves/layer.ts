import { isSmallScreen } from '../mobile';
import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { Wave } from './types';

const DEFAULT_COLORS = ['#0a3d6b', '#0e5a8a', '#1a7ab5', '#3399cc', '#66c2e0'];

export interface WavesConfig {
    readonly layers?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly foamColor?: string;
    readonly foamAmount?: number;
    readonly scale?: number;
}

export class Waves extends Effect<WavesConfig> {
    #speed: number;
    #foamAmount: number;
    #scale: number;
    readonly #foamRGB: [number, number, number];
    #waves: Wave[] = [];
    #foamParticles: { x: number; y: number; alpha: number; size: number }[] = [];
    #maxFoamParticles: number;

    constructor(config: WavesConfig = {}) {
        super();

        const layers = config.layers ?? 5;
        const colors = config.colors ?? DEFAULT_COLORS;
        this.#speed = config.speed ?? 1;
        this.#foamAmount = config.foamAmount ?? 0.4;
        this.#scale = config.scale ?? 1;
        this.#maxFoamParticles = 120;
        this.#foamRGB = hexToRGB(config.foamColor ?? '#ffffff');

        if (isSmallScreen()) {
            this.#maxFoamParticles = Math.floor(this.#maxFoamParticles / 2);
        }

        for (let i = 0; i < layers; i++) {
            const depth = i / Math.max(layers - 1, 1);
            const color = colors[i % colors.length];

            this.#waves.push({
                amplitude: (20 + MULBERRY.next() * 30) * (1 - depth * 0.4),
                frequency: 0.005 + MULBERRY.next() * 0.008 + depth * 0.002,
                speed: 0.4 + MULBERRY.next() * 0.6 + depth * 0.3,
                phase: MULBERRY.next() * Math.PI * 2,
                baseY: 0.35 + depth * 0.13,
                color,
                foamThreshold: 0.6 + MULBERRY.next() * 0.3,
                rgb: hexToRGB(color)
            });
        }
    }

    configure(config: Partial<WavesConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.foamAmount !== undefined) {
            this.#foamAmount = config.foamAmount;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, width: number, height: number): void {
        for (const wave of this.#waves) {
            wave.phase += 0.015 * wave.speed * this.#speed * dt;
        }

        let aliveFoam = 0;

        for (let i = 0; i < this.#foamParticles.length; i++) {
            const foam = this.#foamParticles[i];
            foam.alpha -= (0.008 + MULBERRY.next() * 0.006) * dt;
            foam.x += (MULBERRY.next() - 0.5) * 0.5 * dt;
            foam.y += (MULBERRY.next() - 0.5) * 0.3 * dt;

            if (foam.alpha > 0) {
                this.#foamParticles[aliveFoam++] = foam;
            }
        }

        this.#foamParticles.length = aliveFoam;

        if (this.#foamAmount > 0 && width > 0 && height > 0) {
            const spawnCount = Math.ceil(2 * this.#foamAmount * dt);

            for (let s = 0; s < spawnCount && this.#foamParticles.length < this.#maxFoamParticles; s++) {
                const waveIndex = Math.floor(MULBERRY.next() * this.#waves.length);
                const wave = this.#waves[waveIndex];
                const x = MULBERRY.next() * width;
                const centerY = wave.baseY * height;
                const primary = wave.amplitude * Math.sin(wave.frequency * x + wave.phase);
                const secondary = wave.amplitude * 0.4 * Math.sin(wave.frequency * 2.3 * x + wave.phase * 1.7 + 1.3);
                const waveY = centerY + (primary + secondary) * this.#scale;

                const slopeCheck = Math.cos(wave.frequency * x + wave.phase);

                if (slopeCheck > wave.foamThreshold - 1) {
                    this.#foamParticles.push({
                        x,
                        y: waveY - MULBERRY.next() * 4 * this.#scale,
                        alpha: 0.4 + MULBERRY.next() * 0.6,
                        size: 1 + MULBERRY.next() * 3
                    });
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

        const step = 2;

        for (let wi = 0; wi < this.#waves.length; wi++) {
            const wave = this.#waves[wi];
            const [wr, wg, wb] = wave.rgb;
            const centerY = wave.baseY * height;

            ctx.beginPath();
            ctx.moveTo(0, height);

            for (let x = 0; x <= width; x += step) {
                const primary = wave.amplitude * Math.sin(wave.frequency * x + wave.phase);
                const secondary = wave.amplitude * 0.4 * Math.sin(wave.frequency * 2.3 * x + wave.phase * 1.7 + 1.3);
                const tertiary = wave.amplitude * 0.15 * Math.sin(wave.frequency * 4.1 * x + wave.phase * 0.6 + 2.8);
                const waveY = centerY + (primary + secondary + tertiary) * this.#scale;

                ctx.lineTo(x, waveY);
            }

            ctx.lineTo(width, height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, centerY - wave.amplitude * this.#scale, 0, height);
            gradient.addColorStop(0, `rgba(${wr}, ${wg}, ${wb}, 0.85)`);
            gradient.addColorStop(0.4, `rgb(${wr}, ${wg}, ${wb})`);
            gradient.addColorStop(1, `rgb(${Math.floor(wr * 0.6)}, ${Math.floor(wg * 0.6)}, ${Math.floor(wb * 0.6)})`);

            ctx.fillStyle = gradient;
            ctx.fill();
        }

        if (this.#foamAmount > 0) {
            const [fr, fg, fb] = this.#foamRGB;

            for (const foam of this.#foamParticles) {
                if (foam.alpha <= 0) {
                    continue;
                }

                ctx.beginPath();
                ctx.arc(foam.x, foam.y, foam.size * this.#scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, ${foam.alpha * this.#foamAmount})`;
                ctx.fill();
            }
        }
    }
}
