import { distance } from '../distance';
import type { Point } from '../point';
import { FIREWORK_TRAIL_MEMORY, MULBERRY } from './consts';
import { Spark } from './spark';

export class Firework extends EventTarget {
    readonly #position: Point;
    readonly #startPosition: Point;
    readonly #acceleration: number = 1.05;
    readonly #angle: number;
    readonly #baseSize: number;
    readonly #brightness: number = MULBERRY.nextBetween(55, 75);
    readonly #distance: number;
    readonly #hue: number;
    readonly #tailWidth: number;
    readonly #trail: Point[] = [];
    #distanceTraveled: number = 0;
    #speed: number = 1;
    #sparkTimer: number = 0;
    #pendingSparks: Spark[] = [];

    get position(): Point {
        return this.#position;
    }

    get hue(): number {
        return this.#hue;
    }

    constructor(start: Point, target: Point, hue: number, tailWidth: number, baseSize: number) {
        super();

        this.#hue = hue;
        this.#tailWidth = tailWidth;
        this.#baseSize = baseSize;
        this.#position = {...start};
        this.#startPosition = {...start};
        this.#angle = Math.atan2(target.y - start.y, target.x - start.x);
        this.#distance = distance(start, target);

        for (let i = 0; i < FIREWORK_TRAIL_MEMORY; i++) {
            this.#trail.push({...start});
        }
    }

    collectSparks(): Spark[] {
        const sparks = this.#pendingSparks;
        this.#pendingSparks = [];
        return sparks;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.lineCap = 'round';

        for (let i = this.#trail.length - 1; i > 0; i--) {
            const progress = i / this.#trail.length;
            const alpha = (1 - progress) * 0.8;
            const width = this.#tailWidth * (1 - progress * 0.5);
            const hue = this.#hue + MULBERRY.nextBetween(-15, 15);

            ctx.beginPath();
            ctx.moveTo(this.#trail[i].x, this.#trail[i].y);
            ctx.lineTo(this.#trail[i - 1].x, this.#trail[i - 1].y);
            ctx.lineWidth = width;
            ctx.strokeStyle = `hsla(${hue}, 100%, ${this.#brightness}%, ${alpha})`;
            ctx.stroke();
        }

        ctx.shadowBlur = this.#baseSize * 4;
        ctx.shadowColor = `hsl(${this.#hue}, 100%, 60%)`;

        ctx.beginPath();
        ctx.moveTo(this.#trail[0].x, this.#trail[0].y);
        ctx.lineTo(this.#position.x, this.#position.y);
        ctx.lineWidth = this.#tailWidth;
        ctx.strokeStyle = `hsl(${this.#hue}, 100%, ${this.#brightness}%)`;
        ctx.stroke();

        ctx.shadowBlur = this.#baseSize * 6;
        ctx.shadowColor = `hsl(${this.#hue}, 80%, 80%)`;
        ctx.beginPath();
        ctx.arc(this.#position.x, this.#position.y, this.#tailWidth * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.#hue}, 20%, 92%)`;
        ctx.fill();

        ctx.restore();
    }

    tick(dt: number): void {
        this.#trail.pop();
        this.#trail.unshift({...this.#position});

        this.#speed *= Math.pow(this.#acceleration, dt);

        const vx = Math.cos(this.#angle) * this.#speed;
        const vy = Math.sin(this.#angle) * this.#speed;

        this.#distanceTraveled = distance(this.#startPosition, {
            x: this.#position.x + vx * dt,
            y: this.#position.y + vy * dt
        });

        if (this.#distanceTraveled >= this.#distance) {
            this.dispatchEvent(new CustomEvent('remove'));
            return;
        }

        this.#position.x += vx * dt;
        this.#position.y += vy * dt;

        this.#sparkTimer += dt;

        if (this.#sparkTimer >= 3) {
            this.#sparkTimer -= 3;
            this.#pendingSparks.push(new Spark(
                this.#position,
                this.#hue,
                -vx * 0.1,
                -vy * 0.1
            ));
        }
    }
}
