import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { BlackHoleParticle } from './types';

export interface BlackHoleConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly size?: number;
    readonly scale?: number;
}

export class BlackHole extends Effect<BlackHoleConfig> {
    readonly #scale: number;
    #speed: number;
    #colorR: number;
    #colorG: number;
    #colorB: number;
    readonly #baseSize: number;
    #particles: BlackHoleParticle[] = [];
    #maxCount: number;
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: BlackHoleConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#baseSize = (config.size ?? 2) * this.#scale;
        this.#maxCount = config.count ?? 300;

        const parsed = this.#parseHex(config.color ?? '#6644ff');
        this.#colorR = parsed[0];
        this.#colorG = parsed[1];
        this.#colorB = parsed[2];

        if (typeof globalThis.innerWidth !== 'undefined' && globalThis.innerWidth < 991) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }
    }

    configure(config: Partial<BlackHoleConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }

        if (config.color !== undefined) {
            const parsed = this.#parseHex(config.color);
            this.#colorR = parsed[0];
            this.#colorG = parsed[1];
            this.#colorB = parsed[2];
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized && width > 0 && height > 0) {
            this.#initialized = true;
            this.#particles = [];

            for (let i = 0; i < this.#maxCount; ++i) {
                this.#particles.push(this.#createParticle(true));
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const maxRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2) * 0.9;
        const eventHorizon = 24 * this.#scale;

        for (let i = 0; i < this.#particles.length; ++i) {
            const particle = this.#particles[i];
            const normalizedRadius = particle.radius / maxRadius;

            particle.angle += particle.angularSpeed * this.#speed * (1 + (1 - normalizedRadius) * 4) * dt * 0.005;
            particle.radius -= particle.radialSpeed * this.#speed * (1 + (1 - normalizedRadius) * 3) * dt * 0.15;

            if (particle.radius <= eventHorizon) {
                this.#particles[i] = this.#createParticle(false);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const cx = width / 2;
        const cy = height / 2;
        const maxRadius = Math.sqrt(cx * cx + cy * cy) * 0.9;
        const eventHorizon = 24 * this.#scale;
        const cr = this.#colorR;
        const cg = this.#colorG;
        const cb = this.#colorB;

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb(2, 0, 10)';
        ctx.fillRect(0, 0, width, height);

        const accretionRadius = eventHorizon * 6;
        const accretionGlow = ctx.createRadialGradient(cx, cy, eventHorizon * 0.5, cx, cy, accretionRadius);
        accretionGlow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.0)`);
        accretionGlow.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.12)`);
        accretionGlow.addColorStop(0.7, `rgba(255, 200, 100, 0.08)`);
        accretionGlow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, accretionRadius, 0, Math.PI * 2);
        ctx.fillStyle = accretionGlow;
        ctx.fill();

        for (const particle of this.#particles) {
            const px = cx + Math.cos(particle.angle) * particle.radius;
            const py = cy + Math.sin(particle.angle) * particle.radius;

            const normalizedRadius = Math.max(0, Math.min(1, particle.radius / maxRadius));
            const proximity = 1 - normalizedRadius;

            const r = Math.round(cr + (255 - cr) * proximity * 0.8);
            const g = Math.round(cg + (255 - cg) * proximity * 0.5);
            const b = Math.round(cb + (255 - cb) * proximity * 0.3);

            const alpha = Math.max(0.05, Math.min(1, particle.brightness * (0.2 + proximity * 0.8)));
            const particleSize = Math.max(0.3, this.#baseSize * (0.4 + proximity * 0.6));

            ctx.globalAlpha = alpha;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.beginPath();
            ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            ctx.fill();

            if (proximity > 0.6) {
                ctx.globalAlpha = alpha * 0.3;
                ctx.beginPath();
                ctx.arc(px, py, particleSize * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;

        const holeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eventHorizon);
        holeGrad.addColorStop(0, 'rgb(0, 0, 0)');
        holeGrad.addColorStop(0.7, 'rgb(0, 0, 0)');
        holeGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.fillStyle = holeGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, eventHorizon, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.resetTransform();
        ctx.globalCompositeOperation = 'source-over';
    }

    #createParticle(spread: boolean): BlackHoleParticle {
        const maxRadius = Math.sqrt((this.#width / 2) ** 2 + (this.#height / 2) ** 2) * 0.9;
        const eventHorizon = 24 * this.#scale;

        const angle = MULBERRY.next() * Math.PI * 2;
        const radius = spread
            ? eventHorizon + MULBERRY.next() * (maxRadius - eventHorizon)
            : maxRadius * (0.75 + MULBERRY.next() * 0.25);

        return {
            angle,
            radius,
            angularSpeed: 0.4 + MULBERRY.next() * 1.2,
            radialSpeed: 0.3 + MULBERRY.next() * 0.8,
            size: 0.5 + MULBERRY.next() * 1.5,
            brightness: 0.4 + MULBERRY.next() * 0.6
        };
    }

    #parseHex(hex: string): [number, number, number] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            return [102, 68, 255];
        }

        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
}
