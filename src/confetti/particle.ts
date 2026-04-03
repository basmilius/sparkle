import type { Point } from '../point';
import { SHAPE_PATHS } from './shapes';
import type { Shape } from './types';

export interface ConfettiParticleConfig {
    readonly decay?: number;
    readonly gravity?: number;
    readonly scale?: number;
    readonly spread?: number;
    readonly startVelocity?: number;
    readonly ticks?: number;
}

export class ConfettiParticle {
    readonly #colorStr: string;
    readonly #gravity: number;
    readonly #shape: Shape;
    readonly #size: number;
    readonly #totalTicks: number;
    #decay: number;
    #flipAngle: number;
    #flipSpeed: number;
    #rotAngle: number;
    #rotCos: number;
    #rotSin: number;
    #rotSpeed: number;
    #swing: number;
    #swingAmp: number;
    #swingSpeed: number;
    #tick: number = 0;
    #vx: number;
    #vy: number;
    #x: number;
    #y: number;

    get isDead(): boolean {
        return this.#tick >= this.#totalTicks;
    }

    get position(): Point {
        return {x: this.#x, y: this.#y};
    }

    constructor(position: Point, direction: number, shape: Shape, color: string, config: ConfettiParticleConfig = {}) {
        const scale = config.scale ?? 1;
        const spread = config.spread ?? 45;
        const startVelocity = (config.startVelocity ?? 45) * scale;
        const launchAngle = -(direction * Math.PI / 180)
            + (0.5 * spread * Math.PI / 180)
            - (Math.random() * spread * Math.PI / 180);
        const speed = startVelocity * (0.5 + Math.random());
        const rotAngle = Math.random() * Math.PI * 2;

        this.#colorStr = color;
        this.#gravity = (config.gravity ?? 1) * scale;
        this.#shape = shape;
        this.#size = (5 + Math.random() * 5) * scale;
        this.#totalTicks = config.ticks ?? 200;
        this.#x = position.x;
        this.#y = position.y;
        this.#vx = Math.cos(launchAngle) * speed;
        this.#vy = Math.sin(launchAngle) * speed;
        this.#decay = (config.decay ?? 0.9) - 0.05 + Math.random() * 0.1;
        this.#flipAngle = Math.random() * Math.PI * 2;
        this.#flipSpeed = 0.03 + Math.random() * 0.05;
        this.#rotAngle = rotAngle;
        this.#rotCos = Math.cos(rotAngle);
        this.#rotSin = Math.sin(rotAngle);
        this.#rotSpeed = (Math.random() - 0.5) * 0.06;
        this.#swing = Math.random() * Math.PI * 2;
        this.#swingAmp = 0.5 + Math.random() * 1.5;
        this.#swingSpeed = 0.025 + Math.random() * 0.035;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.setTransform(
            this.#rotCos * Math.cos(this.#flipAngle) * this.#size,
            this.#rotSin * Math.cos(this.#flipAngle) * this.#size,
            -this.#rotSin * this.#size,
            this.#rotCos * this.#size,
            this.#x,
            this.#y
        );
        ctx.globalAlpha = 1 - this.#tick / this.#totalTicks;
        ctx.fillStyle = this.#colorStr;
        ctx.fill(SHAPE_PATHS[this.#shape]);
        ctx.restore();
    }

    tick(dt: number = 1): void {
        const decayFactor = Math.pow(this.#decay, dt);
        this.#vx *= decayFactor;
        this.#vy *= decayFactor;
        this.#vy += this.#gravity * 0.35 * dt;
        this.#swing += this.#swingSpeed * dt;
        this.#x += (this.#vx + this.#swingAmp * Math.cos(this.#swing)) * dt;
        this.#y += this.#vy * dt;
        this.#rotAngle += this.#rotSpeed * dt;
        this.#rotCos = Math.cos(this.#rotAngle);
        this.#rotSin = Math.sin(this.#rotAngle);
        this.#flipAngle += this.#flipSpeed * dt;
        this.#tick += dt;
    }
}
