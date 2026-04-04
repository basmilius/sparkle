import { isSmallScreen } from '../mobile';
import { parseColor } from '../color';
import { createGlowSprite } from '../sprite';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { PollenParticle } from './types';

const TAU = Math.PI * 2;
const SPRITE_SIZE = 64;
const SPRITE_CENTER = SPRITE_SIZE / 2;
const SPRITE_RADIUS = SPRITE_SIZE / 2;

export interface PollenConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly size?: number;
    readonly color?: string;
    readonly glowSize?: number;
    readonly wind?: number;
    readonly scale?: number;
}

export class Pollen extends Effect<PollenConfig> {
    #scale: number;
    #size: number;
    #glowSize: number;
    #speed: number;
    #wind: number;
    #maxCount: number;
    #time: number = 0;
    #particles: PollenParticle[] = [];
    #sprite: HTMLCanvasElement;
    #width: number = 0;
    #height: number = 0;

    constructor(config: PollenConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 40;
        this.#size = (config.size ?? 3) * this.#scale;
        this.#speed = config.speed ?? 0.5;
        this.#wind = config.wind ?? 0.3;
        this.#glowSize = config.glowSize ?? 2;

        if (isSmallScreen()) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        const {r, g, b} = parseColor(config.color ?? '#fff8e1');
        this.#sprite = this.#createSprite(r, g, b);
    }

    configure(config: Partial<PollenConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.wind !== undefined) {
            this.#wind = config.wind;
        }
        if (config.color !== undefined) {
            const {r, g, b} = parseColor(config.color);
            this.#sprite = this.#createSprite(r, g, b);
        }
        if (config.size !== undefined) {
            this.#size = config.size * this.#scale;
        }
        if (config.glowSize !== undefined) {
            this.#glowSize = config.glowSize;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        this.#particles = [];

        for (let idx = 0; idx < this.#maxCount; ++idx) {
            this.#particles.push(this.#createParticle(
                MULBERRY.next() * width,
                MULBERRY.next() * height
            ));
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.02 * dt * this.#speed;

        const windForce = this.#wind * this.#speed;

        for (const particle of this.#particles) {
            // Brownian-like motion with gentle drift.
            const brownianX = Math.sin(this.#time * 3 + particle.phase) * 0.4;
            const brownianY = Math.cos(this.#time * 2.5 + particle.phase * 1.3) * 0.3;

            particle.x += (windForce + brownianX) * particle.drift * dt * 0.5;
            particle.y += (-0.2 * particle.speed * this.#speed + brownianY) * dt * 0.5;

            // Pulsing opacity (catching sunlight).
            particle.opacity = 0.3 + 0.7 * Math.abs(Math.sin(this.#time * particle.phaseSpeed + particle.phase));

            // Recycle particles that leave bounds.
            if (particle.x > width + 20) {
                particle.x = -10;
                particle.y = MULBERRY.next() * height;
            } else if (particle.x < -20) {
                particle.x = width + 10;
                particle.y = MULBERRY.next() * height;
            }

            if (particle.y < -20) {
                particle.y = height + 10;
                particle.x = MULBERRY.next() * width;
            } else if (particle.y > height + 20) {
                particle.y = -10;
                particle.x = MULBERRY.next() * width;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        ctx.globalCompositeOperation = 'lighter';

        for (const particle of this.#particles) {
            if (particle.opacity < 0.05) {
                continue;
            }

            const displaySize = particle.size * this.#glowSize * 2;

            ctx.globalAlpha = particle.opacity;
            ctx.drawImage(
                this.#sprite,
                particle.x - displaySize / 2,
                particle.y - displaySize / 2,
                displaySize,
                displaySize
            );
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createSprite(r: number, g: number, b: number): HTMLCanvasElement {
        return createGlowSprite(r, g, b, SPRITE_SIZE, [[0, 1], [0.15, 0.6], [0.4, 0.2], [0.7, 0.05], [1, 0]]);
    }

    #createParticle(px: number, py: number): PollenParticle {
        return {
            x: px,
            y: py,
            size: (MULBERRY.next() * 0.6 + 0.7) * this.#size,
            speed: 0.3 + MULBERRY.next() * 0.7,
            phase: MULBERRY.next() * TAU,
            phaseSpeed: 0.5 + MULBERRY.next() * 1.5,
            opacity: MULBERRY.next(),
            drift: 0.5 + MULBERRY.next() * 1
        };
    }
}
