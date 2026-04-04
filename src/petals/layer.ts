import { isSmallScreen } from '../mobile';
import { Effect } from '../effect';
import { MULBERRY, PETAL_COLORS } from './consts';
import type { Petal } from './types';

export interface PetalsConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly wind?: number;
    readonly scale?: number;
}

export class Petals extends Effect<PetalsConfig> {
    readonly #scale: number;
    readonly #size: number;
    #speed: number;
    #wind: number;
    readonly #colors: string[];
    #maxCount: number;
    #time: number = 0;
    #petals: Petal[] = [];
    #sprites: HTMLCanvasElement[] = [];

    constructor(config: PetalsConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 100;
        this.#size = (config.size ?? 30) * this.#scale;
        this.#speed = config.speed ?? 0.7;
        this.#wind = config.wind ?? 0.15;
        this.#colors = config.colors ?? PETAL_COLORS;

        if (isSmallScreen()) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        this.#sprites = this.#createSprites();

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#petals.push(this.#createPetal(true));
        }
    }

    configure(config: Partial<PetalsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.wind !== undefined) {
            this.#wind = config.wind;
        }
    }

    tick(dt: number, _width: number, height: number): void {
        const speedFactor = (height / 540) / this.#speed;

        this.#time += 0.012 * dt;

        const globalWind = Math.sin(this.#time * 0.4) * 0.3
            + Math.sin(this.#time * 1.1 + 1.5) * 0.15
            + Math.sin(this.#time * 2.7) * 0.08;

        for (let index = 0; index < this.#petals.length; index++) {
            const petal = this.#petals[index];

            const swing = Math.sin(this.#time * petal.swingFrequency + petal.swingOffset) * petal.swingAmplitude;

            petal.x += (swing + (this.#wind + globalWind * 0.4) * petal.depth) * dt / (3000 * speedFactor);
            petal.y += (petal.fallSpeed * 1.5 + petal.depth * 0.5) * dt / (600 * speedFactor);

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

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const base = ctx.getTransform();

        for (const petal of this.#petals) {
            const px = petal.x * width;
            const py = petal.y * height;
            const displaySize = petal.size * petal.depth;
            const scaleX = Math.cos(petal.flipAngle);
            const cos = Math.cos(petal.rotation);
            const sin = Math.sin(petal.rotation);
            const a = cos * scaleX;
            const b = sin * scaleX;

            ctx.setTransform(
                base.a * a + base.c * b,
                base.b * a + base.d * b,
                base.a * -sin + base.c * cos,
                base.b * -sin + base.d * cos,
                base.a * px + base.c * py + base.e,
                base.b * px + base.d * py + base.f
            );
            ctx.globalAlpha = 0.4 + petal.depth * 0.6;
            ctx.drawImage(
                this.#sprites[petal.colorIndex % this.#sprites.length],
                -displaySize / 2,
                -displaySize / 2,
                displaySize,
                displaySize
            );
        }

        ctx.setTransform(base);
        ctx.globalAlpha = 1;
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
