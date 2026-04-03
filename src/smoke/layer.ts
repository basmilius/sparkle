import { parseColor } from '../color';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { SmokeParticle } from './types';

export interface SmokeConfig {
    readonly color?: string;
    readonly count?: number;
    readonly scale?: number;
    readonly speed?: number;
    readonly spread?: number;
}

const SPRITE_SIZE = 128;
const SPRITE_CENTER = SPRITE_SIZE / 2;
const SPRITE_RADIUS = SPRITE_SIZE / 2;
const SPRITE_VARIANTS = 4;

export class Smoke extends Effect<SmokeConfig> {
    readonly #scale: number;
    #speed: number;
    #count: number;
    #spread: number;
    #time: number = 0;
    #particles: SmokeParticle[] = [];
    #sprites: HTMLCanvasElement[] = [];
    #colorR: number = 136;
    #colorG: number = 136;
    #colorB: number = 136;

    constructor(config: SmokeConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#count = config.count ?? 40;
        this.#spread = config.spread ?? 0.3;

        const {r, g, b} = parseColor(config.color ?? '#888888');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;

        if (innerWidth < 991) {
            this.#count = Math.floor(this.#count / 2);
        }

        this.#sprites = this.#createSprites(r, g, b);

        for (let i = 0; i < this.#count; ++i) {
            this.#particles.push(this.#createParticle(true));
        }
    }

    configure(config: Partial<SmokeConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }

        if (config.spread !== undefined) {
            this.#spread = config.spread;
        }

        if (config.color !== undefined) {
            const {r, g, b} = parseColor(config.color);
            this.#colorR = r;
            this.#colorG = g;
            this.#colorB = b;
            this.#sprites = this.#createSprites(r, g, b);
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.008 * dt;

        for (let index = 0; index < this.#particles.length; index++) {
            const particle = this.#particles[index];

            particle.age += dt;

            const progress = particle.age / particle.lifetime;

            const turbulence = Math.sin(this.#time * particle.turbulenceSpeed + particle.turbulenceOffset) * 0.0002
                + Math.sin(this.#time * particle.turbulenceSpeed * 1.7 + particle.turbulenceOffset + 2.1) * 0.0001;

            particle.x += (particle.vx + turbulence) * dt;
            particle.y += particle.vy * dt;
            particle.radius = particle.maxRadius * Math.min(1, progress * 3);
            particle.opacity = progress < 0.15
                ? progress / 0.15 * 0.35
                : (1 - progress) * 0.35;

            if (particle.age >= particle.lifetime || particle.y < -0.3) {
                this.#particles[index] = this.#createParticle(false);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalCompositeOperation = 'screen';

        for (const particle of this.#particles) {
            const px = particle.x * width;
            const py = particle.y * height;
            const displayRadius = particle.radius * this.#scale * Math.min(width, height) * 0.5;

            if (displayRadius < 1) {
                continue;
            }

            ctx.globalAlpha = particle.opacity;
            ctx.drawImage(
                this.#sprites[particle.spriteIndex],
                px - displayRadius,
                py - displayRadius,
                displayRadius * 2,
                displayRadius * 2
            );
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.resetTransform();
    }

    #createSprites(r: number, g: number, b: number): HTMLCanvasElement[] {
        const sprites: HTMLCanvasElement[] = [];

        for (let variant = 0; variant < SPRITE_VARIANTS; variant++) {
            const canvas = document.createElement('canvas');
            canvas.width = SPRITE_SIZE;
            canvas.height = SPRITE_SIZE;
            const spriteCtx = canvas.getContext('2d')!;

            const offsets = [
                {dx: 0, dy: 0, r: SPRITE_RADIUS},
                {dx: SPRITE_RADIUS * 0.15, dy: -SPRITE_RADIUS * 0.1, r: SPRITE_RADIUS * 0.85},
                {dx: -SPRITE_RADIUS * 0.1, dy: SPRITE_RADIUS * 0.05, r: SPRITE_RADIUS * 0.7}
            ];

            for (const offset of offsets) {
                const cx = SPRITE_CENTER + offset.dx;
                const cy = SPRITE_CENTER + offset.dy;
                const gradient = spriteCtx.createRadialGradient(cx, cy, 0, cx, cy, offset.r);
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`);
                gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.12)`);
                gradient.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, 0.03)`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                spriteCtx.fillStyle = gradient;
                spriteCtx.beginPath();
                spriteCtx.arc(cx, cy, offset.r, 0, Math.PI * 2);
                spriteCtx.fill();
            }

            sprites.push(canvas);
        }

        return sprites;
    }

    #createParticle(initialSpread: boolean): SmokeParticle {
        const lifetime = (4 + MULBERRY.next() * 6) * (1 / this.#speed) * 60;
        const startX = 0.5 + (MULBERRY.next() - 0.5) * this.#spread;
        const startY = initialSpread ? 0.6 + MULBERRY.next() * 0.5 : 1.05;

        return {
            x: startX,
            y: startY,
            vx: (MULBERRY.next() - 0.5) * 0.0002,
            vy: -(0.0008 + MULBERRY.next() * 0.001) * this.#speed,
            age: initialSpread ? MULBERRY.next() * lifetime : 0,
            lifetime,
            radius: 0,
            maxRadius: 0.15 + MULBERRY.next() * 0.25,
            opacity: 0,
            turbulenceOffset: MULBERRY.next() * Math.PI * 2,
            turbulenceSpeed: 0.5 + MULBERRY.next() * 1.5,
            spriteIndex: Math.floor(MULBERRY.next() * SPRITE_VARIANTS)
        };
    }
}
