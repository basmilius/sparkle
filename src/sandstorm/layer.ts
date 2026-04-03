import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { SandGrain } from './types';

export interface SandstormConfig {
    readonly count?: number;
    readonly wind?: number;
    readonly turbulence?: number;
    readonly color?: string;
    readonly hazeOpacity?: number;
    readonly scale?: number;
}

export class Sandstorm extends Effect<SandstormConfig> {
    readonly #scale: number;
    #wind: number;
    #turbulence: number;
    readonly #colorR: number;
    readonly #colorG: number;
    readonly #colorB: number;
    readonly #hazeOpacity: number;
    #maxCount: number;
    #time: number = 0;
    #grains: SandGrain[] = [];

    constructor(config: SandstormConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 300;
        this.#wind = config.wind ?? 1;
        this.#turbulence = config.turbulence ?? 1;
        this.#hazeOpacity = config.hazeOpacity ?? 0.15;

        const {r, g, b} = this.#parseColor(config.color ?? '#c2956b');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;

        if (innerWidth < 991) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#grains.push(this.#createGrain(true));
        }
    }

    configure(config: Partial<SandstormConfig>): void {
        if (config.wind !== undefined) {
            this.#wind = config.wind;
        }
        if (config.turbulence !== undefined) {
            this.#turbulence = config.turbulence;
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.02 * dt;

        const gustX = Math.sin(this.#time * 0.3) * 0.5
            + Math.sin(this.#time * 0.8 + 1) * 0.3
            + Math.sin(this.#time * 2.1) * 0.2;

        const gustY = Math.sin(this.#time * 0.5 + 2) * 0.15;

        const baseWindX = (3 + gustX * 2) * this.#wind;
        const baseWindY = gustY * this.#turbulence;

        for (let index = 0; index < this.#grains.length; index++) {
            const grain = this.#grains[index];

            const turbX = Math.sin(this.#time * 3 + grain.turbulenceOffset) * this.#turbulence * 0.5;
            const turbY = Math.cos(this.#time * 2.5 + grain.turbulenceOffset * 1.3) * this.#turbulence * 0.3;

            grain.vx = (baseWindX + turbX) * grain.depth;
            grain.vy = (baseWindY + turbY) * grain.depth + 0.3 * grain.depth;

            grain.x += (grain.vx * dt) / width;
            grain.y += (grain.vy * dt) / height;

            if (grain.x > 1.1 || grain.x < -0.1 || grain.y > 1.1 || grain.y < -0.1) {
                const recycled = this.#createGrain(false);

                if (baseWindX > 0) {
                    recycled.x = -0.1;
                } else {
                    recycled.x = 1.1;
                }

                recycled.y = MULBERRY.next();
                this.#grains[index] = recycled;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

        const hazeFlicker = 0.9 + Math.sin(this.#time * 0.7) * 0.1;
        ctx.fillStyle = `rgba(${this.#colorR}, ${this.#colorG}, ${this.#colorB}, ${this.#hazeOpacity * hazeFlicker})`;
        ctx.fillRect(0, 0, width, height);

        for (const grain of this.#grains) {
            const px = grain.x * width;
            const py = grain.y * height;
            const size = grain.size * grain.depth * this.#scale;

            if (size < 0.3) {
                continue;
            }

            const speed = Math.sqrt(grain.vx * grain.vx + grain.vy * grain.vy);
            const nx = speed > 0 ? grain.vx / speed : 1;
            const ny = speed > 0 ? grain.vy / speed : 0;
            const streakLength = size * 2 + speed * 3;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - nx * streakLength, py - ny * streakLength);
            ctx.strokeStyle = `rgba(${this.#colorR}, ${this.#colorG}, ${this.#colorB}, ${grain.opacity * grain.depth})`;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    #parseColor(color: string): { r: number; g: number; b: number } {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return {r: data[0], g: data[1], b: data[2]};
    }

    #createGrain(initialSpread: boolean): SandGrain {
        const depth = 0.2 + MULBERRY.next() * 0.8;

        return {
            x: initialSpread ? MULBERRY.next() : -0.1,
            y: MULBERRY.next(),
            vx: 0,
            vy: 0,
            size: (0.5 + MULBERRY.next() * 2) * this.#scale,
            depth,
            opacity: 0.3 + MULBERRY.next() * 0.5,
            turbulenceOffset: MULBERRY.next() * Math.PI * 2
        };
    }
}
