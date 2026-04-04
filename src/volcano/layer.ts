import { isSmallScreen } from '../mobile';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { VolcanoProjectile } from './types';

export interface VolcanoConfig {
    readonly speed?: number;
    readonly projectiles?: number;
    readonly embers?: number;
    readonly intensity?: number;
    readonly color?: string;
    readonly smokeColor?: string;
    readonly scale?: number;
}

export class Volcano extends Effect<VolcanoConfig> {
    readonly #scale: number;
    readonly #color: string;
    readonly #smokeColor: string;
    #speed: number;
    #intensity: number;
    #maxProjectiles: number;
    #maxEmbers: number;
    #time: number = 0;
    #particles: VolcanoProjectile[] = [];
    #canvasWidth: number = 800;
    #canvasHeight: number = 600;

    constructor(config: VolcanoConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#maxProjectiles = config.projectiles ?? 30;
        this.#maxEmbers = config.embers ?? 60;
        this.#intensity = config.intensity ?? 1;
        this.#color = config.color ?? '#ff4400';
        this.#smokeColor = config.smokeColor ?? '#444444';

        if (isSmallScreen()) {
            this.#maxProjectiles = Math.floor(this.#maxProjectiles / 2);
            this.#maxEmbers = Math.floor(this.#maxEmbers / 2);
        }
    }

    configure(config: Partial<VolcanoConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.intensity !== undefined) {
            this.#intensity = config.intensity;
        }
    }

    onResize(width: number, height: number): void {
        this.#canvasWidth = width;
        this.#canvasHeight = height;
    }

    tick(dt: number, width: number, height: number): void {
        this.#canvasWidth = width;
        this.#canvasHeight = height;
        this.#time += 0.02 * dt * this.#speed;

        const eruptX = width * 0.5;
        const eruptY = height * 0.85;

        let lavaCount = 0;
        let emberCount = 0;
        let smokeCount = 0;

        for (let i = 0; i < this.#particles.length; i++) {
            const t = this.#particles[i].type;
            if (t === 'lava') { lavaCount++; }
            else if (t === 'ember') { emberCount++; }
            else { smokeCount++; }
        }

        if (lavaCount < this.#maxProjectiles && MULBERRY.next() < 0.15 * this.#intensity * dt) {
            this.#particles.push(this.#createLava(eruptX, eruptY));
        }

        if (emberCount < this.#maxEmbers && MULBERRY.next() < 0.4 * this.#intensity * dt) {
            this.#particles.push(this.#createEmber(eruptX, eruptY));
        }

        if (smokeCount < 40 && MULBERRY.next() < 0.2 * this.#intensity * dt) {
            this.#particles.push(this.#createSmoke(eruptX, eruptY));
        }

        let alive = 0;

        for (let i = 0; i < this.#particles.length; i++) {
            const particle = this.#particles[i];

            particle.x += particle.vx * dt * this.#speed;
            particle.y += particle.vy * dt * this.#speed;
            particle.life += dt;

            if (particle.type === 'lava') {
                particle.vy += 0.015 * dt;
                particle.vx *= 0.999;
            } else if (particle.type === 'ember') {
                particle.vy -= 0.002 * dt;
                particle.vx += (MULBERRY.next() - 0.5) * 0.02 * dt;
            } else {
                particle.vy -= 0.003 * dt;
                particle.vx += (MULBERRY.next() - 0.5) * 0.01 * dt;
                particle.size += 0.03 * dt;
            }

            if (particle.life < particle.maxLife) {
                this.#particles[alive++] = particle;
            }
        }

        this.#particles.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        this.#drawGlow(ctx, width, height);
        this.#drawSmoke(ctx);
        this.#drawLavaAndEmbers(ctx);
    }

    #drawGlow(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const eruptX = width * 0.5;
        const eruptY = height * 0.85;
        const glowRadius = 120 * this.#scale * this.#intensity;
        const flicker = 0.8 + Math.sin(this.#time * 5) * 0.2;

        const gradient = ctx.createRadialGradient(eruptX, eruptY, 0, eruptX, eruptY, glowRadius);
        gradient.addColorStop(0, `rgba(255, 200, 50, ${0.4 * flicker * this.#intensity})`);
        gradient.addColorStop(0.3, `rgba(255, 100, 20, ${0.2 * flicker * this.#intensity})`);
        gradient.addColorStop(0.6, `rgba(255, 50, 0, ${0.08 * flicker * this.#intensity})`);
        gradient.addColorStop(1, 'rgba(255, 30, 0, 0)');

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(eruptX, eruptY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }

    #drawSmoke(ctx: CanvasRenderingContext2D): void {
        for (const particle of this.#particles) {
            if (particle.type !== 'smoke') {
                continue;
            }

            const lifeRatio = particle.life / particle.maxLife;
            const alpha = (1 - lifeRatio) * 0.3 * this.#intensity;
            const size = particle.size * this.#scale;

            if (alpha < 0.01) {
                continue;
            }

            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.#smokeColor;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    #drawLavaAndEmbers(ctx: CanvasRenderingContext2D): void {
        ctx.globalCompositeOperation = 'lighter';

        for (const particle of this.#particles) {
            if (particle.type === 'smoke') {
                continue;
            }

            const lifeRatio = particle.life / particle.maxLife;
            const alpha = (1 - lifeRatio) * this.#intensity;
            const size = particle.size * this.#scale;

            if (alpha < 0.02) {
                continue;
            }

            if (particle.type === 'lava') {
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, size * 2
                );
                gradient.addColorStop(0, `rgba(255, 220, 100, ${alpha})`);
                gradient.addColorStop(0.4, `rgba(255, 100, 20, ${alpha * 0.7})`);
                gradient.addColorStop(1, `rgba(200, 30, 0, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(255, 240, 180, ${alpha * 0.9})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = `rgba(255, ${150 + MULBERRY.next() * 80 | 0}, 30, ${alpha})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createLava(eruptX: number, eruptY: number): VolcanoProjectile {
        const angle = -Math.PI / 2 + (MULBERRY.next() - 0.5) * 0.8;
        const force = (3 + MULBERRY.next() * 4) * this.#intensity;

        return {
            x: eruptX + (MULBERRY.next() - 0.5) * 20 * this.#scale,
            y: eruptY,
            vx: Math.cos(angle) * force,
            vy: Math.sin(angle) * force,
            size: 3 + MULBERRY.next() * 5,
            life: 0,
            maxLife: 80 + MULBERRY.next() * 60,
            type: 'lava'
        };
    }

    #createEmber(eruptX: number, eruptY: number): VolcanoProjectile {
        return {
            x: eruptX + (MULBERRY.next() - 0.5) * 30 * this.#scale,
            y: eruptY - MULBERRY.next() * 10,
            vx: (MULBERRY.next() - 0.5) * 1.5,
            vy: -(0.5 + MULBERRY.next() * 1.5),
            size: 1 + MULBERRY.next() * 2,
            life: 0,
            maxLife: 60 + MULBERRY.next() * 80,
            type: 'ember'
        };
    }

    #createSmoke(eruptX: number, eruptY: number): VolcanoProjectile {
        return {
            x: eruptX + (MULBERRY.next() - 0.5) * 40 * this.#scale,
            y: eruptY - MULBERRY.next() * 20,
            vx: (MULBERRY.next() - 0.5) * 0.5,
            vy: -(0.3 + MULBERRY.next() * 0.5),
            size: 8 + MULBERRY.next() * 12,
            life: 0,
            maxLife: 120 + MULBERRY.next() * 100,
            type: 'smoke'
        };
    }
}
