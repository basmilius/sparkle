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
    readonly #trail: Point[];
    #trailHead: number = 0;
    #trailSize: number = 0;
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
        this.#trail = new Array(this.#trailLength).fill(null).map(() => ({x: position.x, y: position.y}));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const [r, g, b] = this.#color;
        const trailSize = this.#trailSize;

        for (let t = 0; t < trailSize; t++) {
            const trailAlpha = this.#alpha * (t / trailSize) * 0.5;

            if (trailAlpha < 0.01) {
                continue;
            }

            const dotSize = this.#size * (t / trailSize) * this.#scale;
            const i = (this.#trailHead + t) % this.#trailLength;

            ctx.beginPath();
            ctx.arc(this.#trail[i].x, this.#trail[i].y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailAlpha})`;
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.#x, this.#y, this.#size * this.#scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.#alpha})`;
        ctx.fill();
    }

    tick(dt: number = 1): void {
        this.#trail[this.#trailHead] = {x: this.#x, y: this.#y};
        this.#trailHead = (this.#trailHead + 1) % this.#trailLength;

        if (this.#trailSize < this.#trailLength) {
            this.#trailSize++;
        }

        this.#vx *= Math.pow(this.#friction, dt);
        this.#vy *= Math.pow(this.#friction, dt);
        this.#vy += this.#gravity * this.#scale * dt;

        this.#x += this.#vx * dt;
        this.#y += this.#vy * dt;

        this.#alpha -= this.#decay * dt;
    }
}
