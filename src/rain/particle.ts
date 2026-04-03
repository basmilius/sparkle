import type { Point } from '../point';

export interface RaindropParticleConfig {
    readonly depth?: number;
    readonly groundY?: number;
    readonly length?: number;
    readonly scale?: number;
}

export interface SplashParticleConfig {
    readonly gravity?: number;
    readonly scale?: number;
    readonly size?: number;
}

export class RaindropParticle {
    readonly #color: [number, number, number];
    readonly #depth: number;
    readonly #length: number;
    readonly #groundY: number;
    readonly #scale: number;
    readonly #opacity: number;
    readonly #vx: number;
    readonly #vy: number;
    #x: number;
    #y: number;

    get isDead(): boolean {
        return this.#y >= this.#groundY;
    }

    get position(): Point {
        return {x: this.#x, y: this.#y};
    }

    constructor(position: Point, velocity: Point, color: [number, number, number], config: RaindropParticleConfig = {}) {
        this.#x = position.x;
        this.#y = position.y;
        this.#vx = velocity.x;
        this.#vy = velocity.y;
        this.#color = color;
        this.#depth = config.depth ?? (0.3 + Math.random() * 0.7);
        this.#groundY = config.groundY ?? Number.POSITIVE_INFINITY;
        this.#length = (config.length ?? (8 + Math.random() * 15)) * (config.scale ?? 1);
        this.#opacity = 0.3 + Math.random() * 0.4;
        this.#scale = config.scale ?? 1;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const [r, g, b] = this.#color;
        const speed = Math.sqrt(this.#vx * this.#vx + this.#vy * this.#vy);
        const nx = speed > 0 ? this.#vx / speed : 0;
        const ny = speed > 0 ? this.#vy / speed : -1;

        ctx.beginPath();
        ctx.moveTo(this.#x, this.#y);
        ctx.lineTo(this.#x - nx * this.#length * this.#depth, this.#y - ny * this.#length * this.#depth);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.#opacity * this.#depth})`;
        ctx.lineWidth = (0.4 + this.#depth * 1) * this.#scale;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    tick(dt: number = 1): void {
        this.#x += this.#vx * dt;
        this.#y += this.#vy * dt;
    }
}

export class SplashParticle {
    readonly #color: [number, number, number];
    readonly #gravity: number;
    readonly #size: number;
    readonly #scale: number;
    #x: number;
    #y: number;
    #vx: number;
    #vy: number;
    #alpha: number;

    get isDead(): boolean {
        return this.#alpha <= 0;
    }

    get position(): Point {
        return {x: this.#x, y: this.#y};
    }

    constructor(position: Point, velocity: Point, color: [number, number, number], config: SplashParticleConfig = {}) {
        this.#x = position.x;
        this.#y = position.y;
        this.#vx = velocity.x;
        this.#vy = velocity.y;
        this.#color = color;
        this.#alpha = 0.5 + Math.random() * 0.3;
        this.#gravity = config.gravity ?? 0.15;
        this.#size = config.size ?? (1 + Math.random() * 2);
        this.#scale = config.scale ?? 1;
    }

    static burst(position: Point, color: [number, number, number], config?: SplashParticleConfig): SplashParticle[] {
        const count = 2 + Math.floor(Math.random() * 3);
        const particles: SplashParticle[] = [];

        for (let i = 0; i < count; i++) {
            particles.push(new SplashParticle(
                position,
                {x: (Math.random() - 0.5) * 4, y: -(1 + Math.random() * 3)},
                color,
                config
            ));
        }

        return particles;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const [r, g, b] = this.#color;

        ctx.beginPath();
        ctx.arc(this.#x, this.#y, this.#size * this.#scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.#alpha})`;
        ctx.fill();
    }

    tick(dt: number = 1): void {
        this.#x += this.#vx * dt;
        this.#y += this.#vy * dt;
        this.#vy += this.#gravity * dt;
        this.#alpha -= 0.04 * dt;
    }
}
