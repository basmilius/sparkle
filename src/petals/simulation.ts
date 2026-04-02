import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY, PETAL_COLORS } from './consts';
import type { Petal } from './types';

export interface PetalSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly wind?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class PetalSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #size: number;
    readonly #speed: number;
    readonly #wind: number;
    readonly #colors: string[];
    #maxCount: number;
    #time: number = 0;
    #petals: Petal[] = [];
    #sprites: HTMLCanvasElement[] = [];

    constructor(canvas: HTMLCanvasElement, config: PetalSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 100;
        this.#size = (config.size ?? 24) * this.#scale;
        this.#speed = config.speed ?? 0.7;
        this.#wind = config.wind ?? 0.15;
        this.#colors = config.colors ?? PETAL_COLORS;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        this.#sprites = this.#createSprites();

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#petals.push(this.#createPetal(true));
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        for (const petal of this.#petals) {
            const px = petal.x * this.width;
            const py = petal.y * this.height;
            const displaySize = petal.size * petal.depth;
            const scaleX = Math.cos(petal.flipAngle);

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(petal.rotation);
            ctx.scale(scaleX, 1);
            ctx.globalAlpha = 0.4 + petal.depth * 0.6;
            ctx.drawImage(
                this.#sprites[petal.colorIndex % this.#sprites.length],
                -displaySize / 2,
                -displaySize / 2,
                displaySize,
                displaySize
            );
            ctx.restore();
        }

        ctx.globalAlpha = 1;
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;
        const speedFactor = (this.height / 540) / this.#speed;

        this.#time += 0.012 * dt;

        const globalWind = Math.sin(this.#time * 0.4) * 0.3
                         + Math.sin(this.#time * 1.1 + 1.5) * 0.15
                         + Math.sin(this.#time * 2.7) * 0.08;

        for (let index = 0; index < this.#petals.length; index++) {
            const petal = this.#petals[index];

            const swing = Math.sin(this.#time * petal.swingFrequency + petal.swingOffset) * petal.swingAmplitude;

            petal.x += (swing + (this.#wind + globalWind * 0.4) * petal.depth) / (3000 * speedFactor);
            petal.y += (petal.fallSpeed * 1.5 + petal.depth * 0.5) / (600 * speedFactor);

            petal.rotation += petal.rotationSpeed * dt;
            petal.flipAngle += petal.flipSpeed * dt;

            if (petal.x > 1.15 || petal.x < -0.15 || petal.y > 1.05) {
                const recycled = this.#createPetal(false);

                if (this.#wind + globalWind > 0.1) {
                    recycled.x = -0.15;
                    recycled.y = MULBERRY.next() * 0.6;
                } else {
                    recycled.x = MULBERRY.next();
                    recycled.y = -0.05 - MULBERRY.next() * 0.15;
                }

                this.#petals[index] = recycled;
            }
        }
    }

    #createSprites(): HTMLCanvasElement[] {
        const sprites: HTMLCanvasElement[] = [];

        for (const color of this.#colors) {
            sprites.push(this.#createPetalSprite(color));
        }

        return sprites;
    }

    #createPetalSprite(color: string): HTMLCanvasElement {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        const cx = size / 2;
        const cy = size / 2;
        const hw = size * 0.28;
        const hh = size * 0.38;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - hh);
        ctx.bezierCurveTo(cx + hw * 1.4, cy - hh * 0.6, cx + hw * 1.1, cy + hh * 0.3, cx, cy + hh);
        ctx.bezierCurveTo(cx - hw * 1.1, cy + hh * 0.3, cx - hw * 1.4, cy - hh * 0.6, cx, cy - hh);
        ctx.fill();

        // Subtle center vein
        ctx.strokeStyle = 'rgba(200, 100, 120, 0.15)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy - hh * 0.6);
        ctx.quadraticCurveTo(cx + 1, cy, cx, cy + hh * 0.7);
        ctx.stroke();

        return canvas;
    }

    #createPetal(initialSpread: boolean): Petal {
        const depth = 0.5 + MULBERRY.next() * 0.5;

        return {
            x: MULBERRY.next(),
            y: initialSpread ? MULBERRY.next() * 2 - 1 : -0.05 - MULBERRY.next() * 0.15,
            size: (MULBERRY.next() * 0.4 + 0.6) * this.#size,
            depth,
            rotation: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.03,
            flipAngle: MULBERRY.next() * Math.PI * 2,
            flipSpeed: 0.015 + MULBERRY.next() * 0.03,
            swingAmplitude: 0.5 + MULBERRY.next() * 1.0,
            swingFrequency: 0.4 + MULBERRY.next() * 1.2,
            swingOffset: MULBERRY.next() * Math.PI * 2,
            fallSpeed: 0.2 + MULBERRY.next() * 0.5,
            colorIndex: Math.floor(MULBERRY.next() * this.#colors.length)
        };
    }
}
