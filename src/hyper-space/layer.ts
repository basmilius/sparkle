import { isSmallScreen } from '../mobile';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { HyperSpaceStar } from './types';

export interface HyperSpaceConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly scale?: number;
}

export class HyperSpace extends Effect<HyperSpaceConfig> {
    #scale: number;
    #speed: number;
    #colorR: number;
    #colorG: number;
    #colorB: number;
    #stars: HyperSpaceStar[] = [];
    #maxCount: number;
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: HyperSpaceConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#maxCount = config.count ?? 250;

        const parsed = this.#parseHex(config.color ?? '#ffffff');
        this.#colorR = parsed[0];
        this.#colorG = parsed[1];
        this.#colorB = parsed[2];

        if (isSmallScreen()) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }
    }

    configure(config: Partial<HyperSpaceConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }

        if (config.color !== undefined) {
            const parsed = this.#parseHex(config.color);
            this.#colorR = parsed[0];
            this.#colorG = parsed[1];
            this.#colorB = parsed[2];
        }

        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized && width > 0 && height > 0) {
            this.#initialized = true;
            this.#stars = [];

            for (let i = 0; i < this.#maxCount; ++i) {
                this.#stars.push(this.#createStar(true));
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const maxRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);

        for (let i = 0; i < this.#stars.length; ++i) {
            const star = this.#stars[i];

            star.prevRadius = star.radius;

            const acceleration = 1 + (star.radius / maxRadius) * 4;
            star.radius += star.speed * this.#speed * acceleration * dt * 0.3 * this.#scale;

            if (star.radius >= maxRadius + 10) {
                this.#stars[i] = this.#createStar(false);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const cx = width / 2;
        const cy = height / 2;
        const maxRadius = Math.sqrt(cx * cx + cy * cy);
        const cr = this.#colorR;
        const cg = this.#colorG;
        const cb = this.#colorB;

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb(0, 0, 8)';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'lighter';

        for (const star of this.#stars) {
            const normalizedRadius = star.radius / maxRadius;
            const alpha = Math.min(1, 0.1 + normalizedRadius * 0.9) * star.brightness;
            const lineWidth = Math.max(0.5, this.#scale * (0.3 + normalizedRadius * 1.5));

            const px = cx + Math.cos(star.angle) * star.radius;
            const py = cy + Math.sin(star.angle) * star.radius;

            const trailLength = Math.max(star.radius - star.prevRadius, 1);
            const prevRadius = Math.max(0, star.prevRadius);
            const tx = cx + Math.cos(star.angle) * prevRadius;
            const ty = cy + Math.sin(star.angle) * prevRadius;

            const gradient = ctx.createLinearGradient(tx, ty, px, py);
            gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0)`);
            gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, ${alpha})`);

            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(px, py);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();

            if (normalizedRadius > 0.5) {
                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
                ctx.beginPath();
                ctx.arc(px, py, lineWidth * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    #createStar(spread: boolean): HyperSpaceStar {
        const maxRadius = Math.sqrt((this.#width / 2) ** 2 + (this.#height / 2) ** 2);
        const angle = MULBERRY.next() * Math.PI * 2;
        const radius = spread ? MULBERRY.next() * maxRadius * 0.8 : MULBERRY.next() * maxRadius * 0.05;

        return {
            angle,
            radius,
            prevRadius: radius,
            speed: 0.5 + MULBERRY.next() * 1.5,
            size: 0.5 + MULBERRY.next() * 1.5,
            brightness: 0.5 + MULBERRY.next() * 0.5
        };
    }

    #parseHex(hex: string): [number, number, number] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            return [255, 255, 255];
        }

        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
}
