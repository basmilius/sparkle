import { isSmallScreen } from '../mobile';
import { parseColor } from '../color';
import { createGlowSprite } from '../sprite';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { Firefly } from './types';

const SPRITE_SIZE = 64;
const SPRITE_CENTER = SPRITE_SIZE / 2;
const SPRITE_RADIUS = SPRITE_SIZE / 2;

export interface FirefliesConfig {
    readonly count?: number;
    readonly color?: string;
    readonly size?: number;
    readonly speed?: number;
    readonly glowSpeed?: number;
    readonly scale?: number;
}

export class Fireflies extends Effect<FirefliesConfig> {
    readonly #scale: number;
    readonly #size: number;
    #speed: number;
    #glowSpeed: number;
    #maxCount: number;
    #time: number = 0;
    #fireflies: Firefly[] = [];
    #sprite: HTMLCanvasElement;

    constructor(config: FirefliesConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 60;
        this.#size = (config.size ?? 6) * this.#scale;
        this.#speed = config.speed ?? 1;
        this.#glowSpeed = config.glowSpeed ?? 1;

        const {r, g, b} = parseColor(config.color ?? '#b4ff6a');

        if (isSmallScreen()) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        this.#sprite = this.#createSprite(r, g, b);

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#fireflies.push(this.#createFirefly());
        }
    }

    configure(config: Partial<FirefliesConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.glowSpeed !== undefined) {
            this.#glowSpeed = config.glowSpeed;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.02 * dt * this.#speed;

        for (const firefly of this.#fireflies) {
            const moveX = Math.sin(this.#time * firefly.freqX1 + firefly.phaseX1) * firefly.amplitudeX
                + Math.sin(this.#time * firefly.freqX2 + firefly.phaseX2) * firefly.amplitudeX * 0.5;

            const moveY = Math.sin(this.#time * firefly.freqY1 + firefly.phaseY1) * firefly.amplitudeY
                + Math.sin(this.#time * firefly.freqY2 + firefly.phaseY2) * firefly.amplitudeY * 0.5;

            firefly.x += moveX * dt / (3000 * (1 / this.#speed));
            firefly.y += moveY * dt / (3000 * (1 / this.#speed));

            if (firefly.x > 1.1) {
                firefly.x = -0.1;
            } else if (firefly.x < -0.1) {
                firefly.x = 1.1;
            }

            if (firefly.y > 1.1) {
                firefly.y = -0.1;
            } else if (firefly.y < -0.1) {
                firefly.y = 1.1;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalCompositeOperation = 'lighter';

        for (const firefly of this.#fireflies) {
            const alpha = 0.5 + 0.5 * Math.sin(this.#time * firefly.glowSpeed * this.#glowSpeed + firefly.phase);

            if (alpha < 0.05) {
                continue;
            }

            const px = firefly.x * width;
            const py = firefly.y * height;
            const displaySize = firefly.size * 2;

            ctx.globalAlpha = alpha;
            ctx.drawImage(
                this.#sprite,
                px - firefly.size,
                py - firefly.size,
                displaySize,
                displaySize
            );
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createSprite(r: number, g: number, b: number): HTMLCanvasElement {
        return createGlowSprite(r, g, b, SPRITE_SIZE, [[0, 1], [0.1, 0.8], [0.4, 0.3], [0.7, 0.08], [1, 0]]);
    }

    #createFirefly(): Firefly {
        return {
            x: MULBERRY.next(),
            y: MULBERRY.next(),
            size: (MULBERRY.next() * 0.6 + 0.4) * this.#size,
            phase: MULBERRY.next() * Math.PI * 2,
            glowSpeed: 0.5 + MULBERRY.next() * 1.5,
            freqX1: 0.3 + MULBERRY.next() * 0.7,
            freqX2: 1.2 + MULBERRY.next() * 1.8,
            freqY1: 0.3 + MULBERRY.next() * 0.7,
            freqY2: 1.2 + MULBERRY.next() * 1.8,
            phaseX1: MULBERRY.next() * Math.PI * 2,
            phaseX2: MULBERRY.next() * Math.PI * 2,
            phaseY1: MULBERRY.next() * Math.PI * 2,
            phaseY2: MULBERRY.next() * Math.PI * 2,
            amplitudeX: 0.3 + MULBERRY.next() * 0.7,
            amplitudeY: 0.3 + MULBERRY.next() * 0.7
        };
    }
}
