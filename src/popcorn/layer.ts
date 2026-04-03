import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { PopcornKernel } from './types';

export interface PopcornConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly gravity?: number;
    readonly bounciness?: number;
    readonly color?: string;
    readonly popRate?: number;
    readonly scale?: number;
}

export class Popcorn extends Effect<PopcornConfig> {
    readonly #scale: number;
    readonly #maxCount: number;
    readonly #bounciness: number;
    readonly #colorRGB: [number, number, number];
    #speed: number;
    #gravity: number;
    #popRate: number;
    #kernels: PopcornKernel[] = [];
    #spawnAccumulator: number = 0;

    constructor(config: PopcornConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 25;
        this.#speed = config.speed ?? 1;
        this.#gravity = config.gravity ?? 1;
        this.#bounciness = config.bounciness ?? 0.6;
        this.#popRate = config.popRate ?? 2;
        this.#colorRGB = hexToRGB(config.color ?? '#fff8dc');
    }

    configure(config: Partial<PopcornConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.gravity !== undefined) {
            this.#gravity = config.gravity;
        }
        if (config.popRate !== undefined) {
            this.#popRate = config.popRate;
        }
    }

    tick(dt: number, width: number, height: number): void {
        const speed = this.#speed;
        const gravity = this.#gravity;
        const bounciness = this.#bounciness;
        const groundY = height * 0.95;
        const scale = this.#scale;

        this.#spawnAccumulator += this.#popRate * speed * dt / 60;

        while (this.#spawnAccumulator >= 1 && this.#kernels.length < this.#maxCount) {
            this.#spawnAccumulator -= 1;
            this.#kernels.push(this.#createKernel(width, height));
        }

        if (this.#spawnAccumulator >= 1) {
            this.#spawnAccumulator = 0;
        }

        let alive = 0;

        for (let idx = 0; idx < this.#kernels.length; idx++) {
            const kernel = this.#kernels[idx];

            if (kernel.settled) {
                kernel.opacity -= 0.005 * speed * dt;

                if (kernel.opacity <= 0) {
                    continue;
                }

                this.#kernels[alive++] = kernel;
                continue;
            }

            kernel.vy += 0.15 * gravity * scale * speed * dt;
            kernel.x += kernel.vx * speed * dt;
            kernel.y += kernel.vy * speed * dt;
            kernel.rotation += kernel.rotationSpeed * speed * dt;

            if (!kernel.popped && kernel.vy < 0) {
                kernel.popped = true;
                kernel.size *= 2.2;
            }

            if (kernel.y >= groundY) {
                kernel.y = groundY;
                kernel.vy = -Math.abs(kernel.vy) * bounciness;
                kernel.vx *= 0.8;
                kernel.bounces++;

                if (kernel.bounces > 3) {
                    kernel.settled = true;
                    kernel.vy = 0;
                    kernel.vx = 0;
                }
            }

            if (kernel.x < -50 || kernel.x > width + 50) {
                continue;
            }

            this.#kernels[alive++] = kernel;
        }

        this.#kernels.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const [red, green, blue] = this.#colorRGB;

        for (let idx = 0; idx < this.#kernels.length; idx++) {
            const kernel = this.#kernels[idx];
            const alpha = kernel.opacity;

            if (alpha <= 0) {
                continue;
            }

            ctx.globalAlpha = alpha;

            if (!kernel.popped) {
                this.#drawUnpopped(ctx, kernel, red, green, blue);
            } else {
                this.#drawPopped(ctx, kernel, red, green, blue);
            }
        }

        ctx.globalAlpha = 1;
    }

    #drawUnpopped(ctx: CanvasRenderingContext2D, kernel: PopcornKernel, red: number, green: number, blue: number): void {
        const size = kernel.size;
        const cos = Math.cos(kernel.rotation);
        const sin = Math.sin(kernel.rotation);

        ctx.save();
        ctx.transform(cos, sin, -sin, cos, kernel.x, kernel.y);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${(red * 0.7) | 0}, ${(green * 0.7) | 0}, ${(blue * 0.5) | 0})`;
        ctx.fill();
        ctx.restore();
    }

    #drawPopped(ctx: CanvasRenderingContext2D, kernel: PopcornKernel, red: number, green: number, blue: number): void {
        const size = kernel.size;
        const cos = Math.cos(kernel.rotation);
        const sin = Math.sin(kernel.rotation);

        ctx.save();
        ctx.transform(cos, sin, -sin, cos, kernel.x, kernel.y);
        ctx.beginPath();

        const lobes = 5;

        for (let idx = 0; idx < lobes; idx++) {
            const angle = (idx / lobes) * Math.PI * 2;
            const lumpRadius = size * (0.7 + 0.3 * Math.sin(idx * 2.7 + kernel.rotation));
            const lx = Math.cos(angle) * lumpRadius;
            const ly = Math.sin(angle) * lumpRadius;
            const cpAngle = ((idx + 0.5) / lobes) * Math.PI * 2;
            const cpRadius = size * 1.1;
            const cpx = Math.cos(cpAngle) * cpRadius;
            const cpy = Math.sin(cpAngle) * cpRadius;

            if (idx === 0) {
                ctx.moveTo(lx, ly);
            }

            const nextIdx = (idx + 1) % lobes;
            const nextAngle = (nextIdx / lobes) * Math.PI * 2;
            const nextLumpRadius = size * (0.7 + 0.3 * Math.sin(nextIdx * 2.7 + kernel.rotation));
            const nlx = Math.cos(nextAngle) * nextLumpRadius;
            const nly = Math.sin(nextAngle) * nextLumpRadius;

            ctx.quadraticCurveTo(cpx, cpy, nlx, nly);
        }

        ctx.closePath();
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-size * 0.2, -size * 0.2, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
        ctx.fill();

        ctx.restore();
    }

    #createKernel(width: number, height: number): PopcornKernel {
        const scale = this.#scale;

        return {
            x: width * (0.15 + MULBERRY.next() * 0.7),
            y: height * (0.7 + MULBERRY.next() * 0.25),
            vx: (MULBERRY.next() - 0.5) * 2 * scale,
            vy: -(3 + MULBERRY.next() * 5) * scale,
            size: (3 + MULBERRY.next() * 3) * scale,
            rotation: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.15,
            popped: false,
            opacity: 1,
            settled: false,
            bounces: 0
        };
    }
}
