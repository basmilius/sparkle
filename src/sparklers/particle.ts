import type { Point } from '../point';

export interface SparklerParticleConfig {
    readonly decay?: number;
    readonly friction?: number;
    readonly gravity?: number;
    readonly scale?: number;
    readonly size?: number;
    readonly trailLength?: number;
}

export class SparklerParticle {
    readonly #color: [number, number, number];
    readonly #decay: number;
    readonly #friction: number;
    readonly #gravity: number;
    readonly #scale: number;
    readonly #size: number;
    readonly #trailLength: number;
    readonly #trail: Point[] = [];
    #x: number;
    #y: number;
    #vx: number;
    #vy: number;
    #alpha: number = 1;

    get isDead(): boolean {
        return this.#alpha <= 0;
    }

    get position(): Point {
        return {x: this.#x, y: this.#y};
    }

    constructor(position: Point, velocity: Point, color: [number, number, number], config: SparklerParticleConfig = {}) {
        this.#x = position.x;
        this.#y = position.y;
        this.#vx = velocity.x;
        this.#vy = velocity.y;
        this.#color = color;
        this.#decay = config.decay ?? (0.02 + Math.random() * 0.03);
        this.#friction = config.friction ?? 0.96;
        this.#gravity = config.gravity ?? 0.8;
        this.#scale = config.scale ?? 1;
        this.#size = config.size ?? (1 + Math.random() * 2);
        this.#trailLength = config.trailLength ?? 3;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const [r, g, b] = this.#color;

        for (let t = 0; t < this.#trail.length; t++) {
            const trailAlpha = this.#alpha * (t / this.#trail.length) * 0.5;

            if (trailAlpha < 0.01) {
                continue;
            }

            const trailSize = this.#size * (t / this.#trail.length) * this.#scale;

            ctx.beginPath();
            ctx.arc(this.#trail[t].x, this.#trail[t].y, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailAlpha})`;
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.#x, this.#y, this.#size * this.#scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.#alpha})`;
        ctx.fill();
    }

    tick(dt: number = 1): void {
        this.#trail.push({x: this.#x, y: this.#y});

        if (this.#trail.length > this.#trailLength) {
            this.#trail.shift();
        }

        this.#vx *= Math.pow(this.#friction, dt);
        this.#vy *= Math.pow(this.#friction, dt);
        this.#vy += this.#gravity * this.#scale * dt;

        this.#x += this.#vx * dt;
        this.#y += this.#vy * dt;

        this.#alpha -= this.#decay * dt;
    }
}
