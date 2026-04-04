import { parseColor } from '../color';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { TornadoDebris, TornadoParticle } from './types';

export interface TornadoConfig {
    readonly speed?: number;
    readonly debris?: number;
    readonly width?: number;
    readonly intensity?: number;
    readonly color?: string;
    readonly scale?: number;
}

export class Tornado extends Effect<TornadoConfig> {
    readonly #scale: number;
    #speed: number;
    #intensity: number;
    readonly #funnelWidth: number;
    readonly #particleCount: number;
    readonly #debrisCount: number;
    #time: number = 0;
    #particles: TornadoParticle[] = [];
    #debris: TornadoDebris[] = [];
    #colorR: number;
    #colorG: number;
    #colorB: number;

    constructor(config: TornadoConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#funnelWidth = config.width ?? 0.3;
        this.#intensity = config.intensity ?? 1;

        let particleCount = 400;
        let debrisCount = config.debris ?? 40;

        if (innerWidth < 991) {
            particleCount = Math.floor(particleCount / 2);
            debrisCount = Math.floor(debrisCount / 2);
        }

        this.#particleCount = particleCount;
        this.#debrisCount = debrisCount;

        const {r, g, b} = parseColor(config.color ?? '#8B7355');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;

        for (let i = 0; i < this.#particleCount; ++i) {
            this.#particles.push(this.#createParticle());
        }

        for (let i = 0; i < this.#debrisCount; ++i) {
            this.#debris.push(this.#createDebris(true));
        }
    }

    configure(config: Partial<TornadoConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.intensity !== undefined) {
            this.#intensity = config.intensity;
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.015 * dt * this.#speed;

        for (const particle of this.#particles) {
            const speedMultiplier = 1 + (1 - particle.height) * 2;
            particle.angle += particle.speed * speedMultiplier * this.#intensity * 0.06 * dt;
            particle.height += 0.0008 * dt * this.#speed * (0.5 + particle.layer * 0.5);

            if (particle.height > 1.1) {
                particle.height = -0.05;
                particle.angle = MULBERRY.next() * Math.PI * 2;
                particle.radiusOffset = 0.6 + MULBERRY.next() * 0.8;
            }
        }

        const baseY = height * 0.92;
        const swayX = this.#getSway(width);
        const baseCX = width * 0.5 + swayX * 0.3;

        let alive = 0;

        for (let i = 0; i < this.#debris.length; ++i) {
            const debris = this.#debris[i];
            debris.life += dt;

            if (debris.life > debris.maxLife) {
                this.#debris[alive++] = this.#createDebris(false);
                continue;
            }

            debris.vy += 0.12 * dt;
            debris.vx *= 0.995;
            debris.vy *= 0.995;

            const distToCenter = debris.x - baseCX;
            debris.vx -= distToCenter * 0.0003 * dt * this.#intensity;
            debris.vy -= 0.15 * dt * this.#intensity;

            debris.x += debris.vx * dt;
            debris.y += debris.vy * dt;
            debris.rotation += debris.rotationSpeed * dt;
            debris.opacity = 1 - debris.life / debris.maxLife;

            if (debris.y > baseY + 10) {
                debris.y = baseY + 10;
                debris.vy = -Math.abs(debris.vy) * 0.3;
            }

            this.#debris[alive++] = debris;
        }

        this.#debris.length = alive;

        while (this.#debris.length < this.#debrisCount) {
            this.#debris.push(this.#createDebris(false));
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const baseY = height * 0.92;
        const topY = height * 0.05;
        const funnelHeight = baseY - topY;
        const swayX = this.#getSway(width);
        const baseCX = width * 0.5 + swayX * 0.3;
        const topCX = width * 0.5 + swayX;
        const baseRadius = this.#funnelWidth * width * 0.12 * this.#scale;
        const topRadius = this.#funnelWidth * width * 0.5 * this.#scale;
        const cr = this.#colorR;
        const cg = this.#colorG;
        const cb = this.#colorB;

        this.#drawDustCloud(ctx, baseCX, baseY, width, cr, cg, cb);

        for (const particle of this.#particles) {
            if (particle.height < 0 || particle.height > 1) {
                continue;
            }

            const t = particle.height;
            const easeT = t * t;

            const cx = baseCX + (topCX - baseCX) * easeT;
            const cy = baseY - funnelHeight * t;
            const radius = baseRadius + (topRadius - baseRadius) * easeT;

            const orbitRadius = radius * particle.radiusOffset;
            const px = cx + Math.cos(particle.angle) * orbitRadius;
            const py = cy + Math.sin(particle.angle * 0.4) * radius * 0.08;

            const depthFactor = (Math.sin(particle.angle) + 1) * 0.5;
            const heightFade = t < 0.05 ? t / 0.05 : (t > 0.95 ? (1 - t) / 0.05 : 1);
            const layerAlpha = particle.layer === 0 ? 0.3 : (particle.layer === 1 ? 0.2 : 0.12);
            const alpha = particle.opacity * heightFade * (0.4 + depthFactor * 0.6) * layerAlpha * this.#intensity;

            if (alpha < 0.01) {
                continue;
            }

            const size = particle.size * this.#scale * (0.6 + t * 0.8);

            ctx.globalAlpha = alpha;
            ctx.fillStyle = `rgb(${cr + (255 - cr) * depthFactor * 0.3 | 0}, ${cg + (255 - cg) * depthFactor * 0.2 | 0}, ${cb + (255 - cb) * depthFactor * 0.15 | 0})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
        ctx.strokeStyle = `rgb(${cr * 0.6 | 0}, ${cg * 0.6 | 0}, ${cb * 0.6 | 0})`;
        ctx.lineCap = 'round';

        for (const debris of this.#debris) {
            if (debris.opacity < 0.05) {
                continue;
            }

            const size = debris.size * this.#scale;
            ctx.globalAlpha = debris.opacity * 0.8;
            ctx.lineWidth = Math.max(1, size * 0.5);

            const cos = Math.cos(debris.rotation);
            const sin = Math.sin(debris.rotation);
            const hx = cos * size;
            const hy = sin * size;

            ctx.beginPath();
            ctx.moveTo(debris.x - hx, debris.y - hy);
            ctx.lineTo(debris.x + hx, debris.y + hy);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    #drawDustCloud(ctx: CanvasRenderingContext2D, cx: number, baseY: number, _width: number, r: number, g: number, b: number): void {
        const cloudRadius = this.#funnelWidth * 80 * this.#scale;

        const gradient = ctx.createRadialGradient(
            cx, baseY, 0,
            cx, baseY, cloudRadius
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.15 * this.#intensity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.06 * this.#intensity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.globalAlpha = 1;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, baseY, cloudRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    #getSway(width: number): number {
        return Math.sin(this.#time * 0.8) * width * 0.06
            + Math.sin(this.#time * 1.9 + 1.5) * width * 0.03
            + Math.sin(this.#time * 3.1 + 0.7) * width * 0.01;
    }

    #createParticle(): TornadoParticle {
        const layer = MULBERRY.next() < 0.4 ? 0 : (MULBERRY.next() < 0.6 ? 1 : 2);

        return {
            angle: MULBERRY.next() * Math.PI * 2,
            height: MULBERRY.next(),
            radiusOffset: layer === 0
                ? (0.85 + MULBERRY.next() * 0.3)
                : layer === 1
                    ? (0.5 + MULBERRY.next() * 0.5)
                    : (1.1 + MULBERRY.next() * 0.4),
            speed: 0.5 + MULBERRY.next() * 0.8,
            size: (1.5 + MULBERRY.next() * 3) * (layer === 2 ? 0.7 : 1),
            opacity: 0.6 + MULBERRY.next() * 0.4,
            layer
        };
    }

    #createDebris(spread: boolean): TornadoDebris {
        return {
            x: 0,
            y: 0,
            vx: (MULBERRY.next() - 0.5) * 4 * this.#intensity,
            vy: -MULBERRY.next() * 3 * this.#intensity,
            size: 2 + MULBERRY.next() * 5,
            rotation: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.15,
            opacity: spread ? MULBERRY.next() : 1,
            life: spread ? MULBERRY.next() * 120 : 0,
            maxLife: 120 + MULBERRY.next() * 180
        };
    }

}
