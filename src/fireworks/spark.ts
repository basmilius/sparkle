import type { Point } from '../point';
import { MULBERRY } from './consts';

export class Spark {
    readonly #position: Point;
    readonly #velocity: Point;
    readonly #hue: number;
    readonly #size: number;
    readonly #decay: number;
    readonly #friction: number = 0.94;
    readonly #gravity: number = 0.6;
    #alpha: number = 1;

    get isDead(): boolean {
        return this.#alpha <= 0;
    }

    get position(): Point {
        return this.#position;
    }

    constructor(position: Point, hue: number, velocityX: number = 0, velocityY: number = 0) {
        this.#position = {...position};
        this.#hue = hue + MULBERRY.nextBetween(-20, 20);
        this.#size = MULBERRY.nextBetween(0.5, 1.5);
        this.#decay = MULBERRY.nextBetween(0.03, 0.08);
        this.#velocity = {
            x: velocityX + MULBERRY.nextBetween(-1.5, 1.5),
            y: velocityY + MULBERRY.nextBetween(-2, 0.5)
        };
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.#position.x, this.#position.y, this.#size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.#hue}, 80%, 70%, ${this.#alpha})`;
        ctx.fill();
    }

    tick(): void {
        this.#velocity.x *= this.#friction;
        this.#velocity.y *= this.#friction;
        this.#velocity.y += this.#gravity;

        this.#position.x += this.#velocity.x;
        this.#position.y += this.#velocity.y;

        this.#alpha -= this.#decay;
    }
}
