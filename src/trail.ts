import { distance } from './distance';
import { Spark } from './fireworks/spark';
import type { Point } from './point';

export interface TrailConfig {
    readonly acceleration?: number;
    readonly brightness?: number;
    readonly glow?: number;
    readonly hue?: number;
    readonly length?: number;
    readonly speed?: number;
    readonly width?: number;
}

export class Trail {
    readonly #startPosition: Point;
    readonly #position: Point;
    readonly #angle: number;
    readonly #totalDistance: number;
    readonly #trail: Point[];
    #trailHead: number = 0;
    readonly #acceleration: number;
    readonly #brightness: number;
    readonly #glow: number;
    readonly #hue: number;
    readonly #width: number;
    #speed: number;
    #distanceTraveled: number = 0;
    #isDone: boolean = false;
    #sparkTimer: number = 0;
    #pendingSparks: Spark[] = [];

    get hue(): number {
        return this.#hue;
    }

    get isDone(): boolean {
        return this.#isDone;
    }

    get position(): Point {
        return {...this.#position};
    }

    collectSparks(): Spark[] {
        const sparks = this.#pendingSparks;
        this.#pendingSparks = [];
        return sparks;
    }

    constructor(start: Point, end: Point, config: TrailConfig = {}) {
        this.#startPosition = {...start};
        this.#position = {...start};
        this.#angle = Math.atan2(end.y - start.y, end.x - start.x);
        this.#totalDistance = distance(start, end);
        this.#acceleration = config.acceleration ?? 1.05;
        this.#brightness = config.brightness ?? 65;
        this.#glow = config.glow ?? 10;
        this.#hue = config.hue ?? Math.random() * 360;
        this.#speed = config.speed ?? 1;
        this.#width = config.width ?? 2;

        const length = config.length ?? 6;
        this.#trail = Array.from({length}, () => ({...start}));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.#isDone) {
            return;
        }

        ctx.save();
        ctx.lineCap = 'round';

        const len = this.#trail.length;

        for (let i = len - 1; i > 0; i--) {
            const progress = i / len;
            const alpha = (1 - progress) * 0.8;
            const width = this.#width * (1 - progress * 0.5);

            const ti = (this.#trailHead + i) % len;
            const ti1 = (this.#trailHead + i - 1) % len;

            ctx.beginPath();
            ctx.moveTo(this.#trail[ti].x, this.#trail[ti].y);
            ctx.lineTo(this.#trail[ti1].x, this.#trail[ti1].y);
            ctx.lineWidth = width;
            ctx.strokeStyle = `hsla(${this.#hue}, 100%, ${this.#brightness}%, ${alpha})`;
            ctx.stroke();
        }

        ctx.shadowBlur = this.#glow;
        ctx.shadowColor = `hsl(${this.#hue}, 100%, 60%)`;

        ctx.beginPath();
        ctx.moveTo(this.#trail[this.#trailHead].x, this.#trail[this.#trailHead].y);
        ctx.lineTo(this.#position.x, this.#position.y);
        ctx.lineWidth = this.#width;
        ctx.strokeStyle = `hsl(${this.#hue}, 100%, ${this.#brightness}%)`;
        ctx.stroke();

        ctx.shadowBlur = this.#glow * 1.5;
        ctx.shadowColor = `hsl(${this.#hue}, 80%, 80%)`;
        ctx.beginPath();
        ctx.arc(this.#position.x, this.#position.y, this.#width * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.#hue}, 20%, 92%)`;
        ctx.fill();

        ctx.restore();
    }

    tick(dt: number = 1): void {
        if (this.#isDone) {
            return;
        }

        this.#trailHead = (this.#trailHead - 1 + this.#trail.length) % this.#trail.length;
        this.#trail[this.#trailHead].x = this.#position.x;
        this.#trail[this.#trailHead].y = this.#position.y;

        this.#speed *= Math.pow(this.#acceleration, dt);

        const vx = Math.cos(this.#angle) * this.#speed;
        const vy = Math.sin(this.#angle) * this.#speed;

        this.#distanceTraveled = distance(this.#startPosition, {
            x: this.#position.x + vx * dt,
            y: this.#position.y + vy * dt
        });

        if (this.#distanceTraveled >= this.#totalDistance) {
            this.#isDone = true;
            return;
        }

        this.#position.x += vx * dt;
        this.#position.y += vy * dt;

        this.#sparkTimer += dt;

        if (this.#sparkTimer >= 3) {
            this.#sparkTimer -= 3;
            this.#pendingSparks.push(new Spark(this.#position, this.#hue, -vx * 0.1, -vy * 0.1));
        }
    }
}
