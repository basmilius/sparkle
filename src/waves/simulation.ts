import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { Wave } from './types';

export interface WaveSimulationConfig {
    readonly layers?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly foamColor?: string;
    readonly foamAmount?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const DEFAULT_COLORS = ['#0a3d6b', '#0e5a8a', '#1a7ab5', '#3399cc', '#66c2e0'];

export class WaveSimulation extends LimitedFrameRateCanvas {
    readonly #speed: number;
    readonly #foamColor: string;
    readonly #foamAmount: number;
    readonly #scale: number;
    #time: number = 0;
    #waves: Wave[] = [];
    #foamParticles: {x: number; y: number; alpha: number; size: number}[] = [];
    #maxFoamParticles: number;

    constructor(canvas: HTMLCanvasElement, config: WaveSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        const layers = config.layers ?? 5;
        const colors = config.colors ?? DEFAULT_COLORS;
        this.#speed = config.speed ?? 1;
        this.#foamColor = config.foamColor ?? '#ffffff';
        this.#foamAmount = config.foamAmount ?? 0.4;
        this.#scale = config.scale ?? 1;
        this.#maxFoamParticles = 120;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxFoamParticles = Math.floor(this.#maxFoamParticles / 2);
        }

        for (let i = 0; i < layers; i++) {
            const depth = i / Math.max(layers - 1, 1);
            const color = colors[i % colors.length];

            this.#waves.push({
                amplitude: (20 + MULBERRY.next() * 30) * (1 - depth * 0.4),
                frequency: 0.005 + MULBERRY.next() * 0.008 + depth * 0.002,
                speed: (0.4 + MULBERRY.next() * 0.6 + depth * 0.3) * this.#speed,
                phase: MULBERRY.next() * Math.PI * 2,
                baseY: 0.35 + depth * 0.13,
                color,
                foamThreshold: 0.6 + MULBERRY.next() * 0.3
            });
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        const step = 2;

        // Draw waves from back (first) to front (last)
        for (let wi = 0; wi < this.#waves.length; wi++) {
            const wave = this.#waves[wi];
            const centerY = wave.baseY * this.height;

            ctx.beginPath();
            ctx.moveTo(0, this.height);

            // Build wave line from left to right
            for (let x = 0; x <= this.width; x += step) {
                const primary = wave.amplitude * Math.sin(wave.frequency * x + wave.phase);
                const secondary = wave.amplitude * 0.4 * Math.sin(wave.frequency * 2.3 * x + wave.phase * 1.7 + 1.3);
                const tertiary = wave.amplitude * 0.15 * Math.sin(wave.frequency * 4.1 * x + wave.phase * 0.6 + 2.8);
                const waveY = centerY + (primary + secondary + tertiary) * this.#scale;

                ctx.lineTo(x, waveY);
            }

            // Close path to bottom of canvas
            ctx.lineTo(this.width, this.height);
            ctx.closePath();

            // Fill wave body with gradient
            const gradient = ctx.createLinearGradient(0, centerY - wave.amplitude * this.#scale, 0, this.height);
            gradient.addColorStop(0, this.#adjustAlpha(wave.color, 0.85));
            gradient.addColorStop(0.4, wave.color);
            gradient.addColorStop(1, this.#darkenColor(wave.color, 0.6));

            ctx.fillStyle = gradient;
            ctx.fill();
        }

        // Draw foam particles on top
        if (this.#foamAmount > 0) {
            for (const foam of this.#foamParticles) {
                if (foam.alpha <= 0) {
                    continue;
                }

                ctx.beginPath();
                ctx.arc(foam.x, foam.y, foam.size * this.#scale, 0, Math.PI * 2);
                ctx.fillStyle = this.#adjustAlpha(this.#foamColor, foam.alpha * this.#foamAmount);
                ctx.fill();
            }
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        this.#time += 0.02 * dt * this.#speed;

        // Update wave phases
        for (const wave of this.#waves) {
            wave.phase += 0.015 * wave.speed * dt;
        }

        // Update existing foam particles
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

        // Spawn new foam particles along wave crests
        if (this.#foamAmount > 0 && this.width > 0 && this.height > 0) {
            const spawnCount = Math.ceil(2 * this.#foamAmount * dt);

            for (let s = 0; s < spawnCount && this.#foamParticles.length < this.#maxFoamParticles; s++) {
                const waveIndex = Math.floor(MULBERRY.next() * this.#waves.length);
                const wave = this.#waves[waveIndex];
                const x = MULBERRY.next() * this.width;
                const centerY = wave.baseY * this.height;
                const primary = wave.amplitude * Math.sin(wave.frequency * x + wave.phase);
                const secondary = wave.amplitude * 0.4 * Math.sin(wave.frequency * 2.3 * x + wave.phase * 1.7 + 1.3);
                const waveY = centerY + (primary + secondary) * this.#scale;

                // Only spawn near crests (where wave curves upward)
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

    #adjustAlpha(color: string, alpha: number): string {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${alpha})`;
    }

    #darkenColor(color: string, factor: number): string {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        const r = Math.floor(data[0] * factor);
        const g = Math.floor(data[1] * factor);
        const b = Math.floor(data[2] * factor);
        return `rgb(${r}, ${g}, ${b})`;
    }
}
