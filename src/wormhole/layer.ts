import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { WormholeDirection, WormholeParticle } from './types';

export interface WormholeConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly direction?: WormholeDirection;
    readonly scale?: number;
}

export class Wormhole extends Effect<WormholeConfig> {
    #speed: number;
    readonly #colorRGB: [number, number, number];
    readonly #direction: WormholeDirection;
    #scale: number;
    #count: number;
    #particles: WormholeParticle[] = [];
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: WormholeConfig = {}) {
        super();

        let count = config.count ?? 200;

        this.#speed = config.speed ?? 1;
        this.#colorRGB = hexToRGB(config.color ?? '#6699ff');
        this.#direction = config.direction ?? 'inward';
        this.#scale = config.scale ?? 1;

        if (innerWidth < 991) {
            count = Math.floor(count / 2);
        }

        this.#count = count;
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized) {
            this.#initialized = true;
            this.#particles = [];

            for (let i = 0; i < this.#count; ++i) {
                this.#particles.push(this.#createParticle(true));
            }
        }
    }

    configure(config: Partial<WormholeConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed as number;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale as number;
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const maxRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);

        let alive = 0;

        for (let i = 0; i < this.#particles.length; ++i) {
            const particle = this.#particles[i];

            if (this.#direction === 'inward') {
                const normalizedDistance = particle.distance / maxRadius;
                const acceleration = 1 + (1 - normalizedDistance) * 3;
                particle.distance -= particle.speed * this.#speed * acceleration * dt * this.#scale;

                particle.trail = 5 + (1 - normalizedDistance) * 25;

                if (particle.distance > 0) {
                    this.#particles[alive++] = particle;
                } else {
                    this.#particles[alive++] = this.#createParticle(false);
                }
            } else {
                const normalizedDistance = particle.distance / maxRadius;
                const acceleration = 1 + normalizedDistance * 3;
                particle.distance += particle.speed * this.#speed * acceleration * dt * this.#scale;

                particle.trail = 5 + normalizedDistance * 25;

                if (particle.distance < maxRadius + 20) {
                    this.#particles[alive++] = particle;
                } else {
                    this.#particles[alive++] = this.#createParticle(false);
                }
            }

            particle.angle += (MULBERRY.next() - 0.5) * 0.002 * dt;
        }

        this.#particles.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const cx = width / 2;
        const cy = height / 2;
        const maxRadius = Math.sqrt(cx * cx + cy * cy);
        const [cr, cg, cb] = this.#colorRGB;


        const glowRadius = 40 * this.#scale;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.25)`);
        glow.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.08)`);
        glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        for (const particle of this.#particles) {
            const normalizedDistance = particle.distance / maxRadius;
            const px = cx + Math.cos(particle.angle) * particle.distance;
            const py = cy + Math.sin(particle.angle) * particle.distance;

            const trailFactor = this.#direction === 'inward' ? 1 : -1;
            const trailLength = particle.trail * this.#scale;
            const tx = px + Math.cos(particle.angle) * trailLength * trailFactor;
            const ty = py + Math.sin(particle.angle) * trailLength * trailFactor;

            let intensity: number;

            if (this.#direction === 'inward') {
                intensity = particle.brightness * (1 - normalizedDistance);
            } else {
                intensity = particle.brightness * normalizedDistance;
            }

            const alpha = Math.max(0.05, Math.min(1, intensity));
            const lineWidth = Math.max(0.5, particle.size * this.#scale * (0.5 + intensity * 0.5));

            const gradient = ctx.createLinearGradient(px, py, tx, ty);
            gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha})`);
            gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, lineWidth * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createParticle(spread: boolean): WormholeParticle {
        const maxRadius = Math.sqrt((this.#width / 2) ** 2 + (this.#height / 2) ** 2);
        const angle = MULBERRY.next() * Math.PI * 2;

        let distance: number;

        if (this.#direction === 'inward') {
            distance = spread
                ? MULBERRY.next() * maxRadius
                : maxRadius * (0.8 + MULBERRY.next() * 0.2);
        } else {
            distance = spread
                ? MULBERRY.next() * maxRadius
                : MULBERRY.next() * maxRadius * 0.1;
        }

        return {
            angle,
            distance,
            speed: 0.5 + MULBERRY.next() * 1.5,
            size: 0.8 + MULBERRY.next() * 2.2,
            brightness: 0.4 + MULBERRY.next() * 0.6,
            trail: 5
        };
    }
}
