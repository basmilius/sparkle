import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { PortalDirection, PortalParticle } from './types';

export interface PortalConfig {
    readonly speed?: number;
    readonly particles?: number;
    readonly size?: number;
    readonly color?: string;
    readonly secondaryColor?: string;
    readonly direction?: PortalDirection;
    readonly scale?: number;
}

export class Portal extends Effect<PortalConfig> {
    #speed: number;
    #scale: number;
    readonly #size: number;
    readonly #colorRGB: [number, number, number];
    readonly #secondaryRGB: [number, number, number];
    readonly #direction: PortalDirection;
    #count: number;
    #particles: PortalParticle[] = [];
    #width: number = 960;
    #height: number = 540;
    #time: number = 0;
    #initialized: boolean = false;

    constructor(config: PortalConfig = {}) {
        super();

        let count = config.particles ?? 100;

        this.#speed = config.speed ?? 1;
        this.#scale = config.scale ?? 1;
        this.#size = config.size ?? 0.3;
        this.#colorRGB = hexToRGB(config.color ?? '#8844ff');
        this.#secondaryRGB = hexToRGB(config.secondaryColor ?? '#44aaff');
        this.#direction = config.direction ?? 'inward';

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

    configure(config: Partial<PortalConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#time += dt * this.#speed * 0.01;

        const portalRadius = Math.min(width, height) * this.#size * this.#scale;
        const maxDistance = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);

        let alive = 0;

        for (let i = 0; i < this.#particles.length; ++i) {
            const particle = this.#particles[i];

            particle.angle += particle.rotationSpeed * this.#speed * dt * this.#scale;

            if (this.#direction === 'inward') {
                const normalizedDistance = particle.distance / maxDistance;
                const acceleration = 1 + (1 - normalizedDistance) * 2;
                particle.distance -= particle.speed * this.#speed * acceleration * dt * this.#scale;

                particle.opacity = Math.min(1, normalizedDistance * 2);

                if (particle.distance > portalRadius * 0.1) {
                    this.#particles[alive++] = particle;
                } else {
                    this.#particles[alive++] = this.#createParticle(false);
                }
            } else {
                const normalizedDistance = particle.distance / maxDistance;
                const acceleration = 1 + normalizedDistance * 2;
                particle.distance += particle.speed * this.#speed * acceleration * dt * this.#scale;

                particle.opacity = Math.min(1, (1 - normalizedDistance) * 2);

                if (particle.distance < maxDistance + 20) {
                    this.#particles[alive++] = particle;
                } else {
                    this.#particles[alive++] = this.#createParticle(false);
                }
            }
        }

        this.#particles.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const cx = width / 2;
        const cy = height / 2;
        const portalRadius = Math.min(width, height) * this.#size * this.#scale;
        const [pr, pg, pb] = this.#colorRGB;
        const [sr, sg, sb] = this.#secondaryRGB;

        ctx.globalCompositeOperation = 'lighter';

        // Inner glow
        const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, portalRadius * 0.5);
        innerGlow.addColorStop(0, `rgba(255, 255, 255, 0.15)`);
        innerGlow.addColorStop(0.3, `rgba(${pr}, ${pg}, ${pb}, 0.1)`);
        innerGlow.addColorStop(1, `rgba(${pr}, ${pg}, ${pb}, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, portalRadius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();

        // Ring with distortion and swirl
        const ringSegments = 6;
        const time = this.#time;

        for (let ring = 0; ring < ringSegments; ++ring) {
            const ringPhase = (ring / ringSegments) * Math.PI * 2;
            const ringAlpha = 0.15 - ring * 0.015;
            const ringWidth = 3 + ring * 1.5;

            ctx.beginPath();
            ctx.lineWidth = ringWidth * this.#scale;

            for (let angle = 0; angle <= Math.PI * 2; angle += 0.02) {
                const distortion = 1
                    + Math.sin(angle * 3 + time * 2 + ringPhase) * 0.04
                    + Math.sin(angle * 5 + time * 3.7) * 0.02
                    + Math.sin(angle * 7 + time * 1.3 + ringPhase) * 0.015;

                const radius = portalRadius * distortion;
                const px = cx + Math.cos(angle + time * 0.5 + ringPhase * 0.3) * radius;
                const py = cy + Math.sin(angle + time * 0.5 + ringPhase * 0.3) * radius;

                if (angle === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }

            ctx.closePath();

            const mixFactor = ring / ringSegments;
            const colorR = Math.round(pr + (sr - pr) * mixFactor);
            const colorG = Math.round(pg + (sg - pg) * mixFactor);
            const colorB = Math.round(pb + (sb - pb) * mixFactor);

            ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${ringAlpha})`;
            ctx.stroke();
        }

        // Ring glow
        const ringGlow = ctx.createRadialGradient(cx, cy, portalRadius * 0.8, cx, cy, portalRadius * 1.3);
        ringGlow.addColorStop(0, `rgba(${pr}, ${pg}, ${pb}, 0)`);
        ringGlow.addColorStop(0.5, `rgba(${pr}, ${pg}, ${pb}, 0.08)`);
        ringGlow.addColorStop(1, `rgba(${pr}, ${pg}, ${pb}, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, portalRadius * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = ringGlow;
        ctx.fill();

        // Particles
        for (const particle of this.#particles) {
            const px = cx + Math.cos(particle.angle) * particle.distance;
            const py = cy + Math.sin(particle.angle) * particle.distance;

            const trailAngle = this.#direction === 'inward' ? particle.angle + Math.PI : particle.angle;
            const trailLength = (8 + particle.speed * 4) * this.#scale;
            const tx = px + Math.cos(trailAngle) * trailLength;
            const ty = py + Math.sin(trailAngle) * trailLength;

            const alpha = Math.max(0.05, Math.min(1, particle.opacity));
            const lineWidth = Math.max(0.5, particle.size * this.#scale);

            const gradient = ctx.createLinearGradient(px, py, tx, ty);
            gradient.addColorStop(0, `rgba(${sr}, ${sg}, ${sb}, ${alpha})`);
            gradient.addColorStop(1, `rgba(${sr}, ${sg}, ${sb}, 0)`);

            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            // Glowing dot at particle head
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, lineWidth * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${sr}, ${sg}, ${sb})`;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createParticle(spread: boolean): PortalParticle {
        const maxDistance = Math.sqrt((this.#width / 2) ** 2 + (this.#height / 2) ** 2);
        const portalRadius = Math.min(this.#width, this.#height) * this.#size * this.#scale;
        const angle = MULBERRY.next() * Math.PI * 2;

        let distance: number;

        if (this.#direction === 'inward') {
            distance = spread
                ? portalRadius + MULBERRY.next() * (maxDistance - portalRadius)
                : maxDistance * (0.7 + MULBERRY.next() * 0.3);
        } else {
            distance = spread
                ? portalRadius + MULBERRY.next() * (maxDistance - portalRadius)
                : portalRadius * (1 + MULBERRY.next() * 0.2);
        }

        return {
            angle,
            distance,
            speed: 0.3 + MULBERRY.next() * 1.2,
            size: 0.8 + MULBERRY.next() * 2,
            opacity: 1,
            rotationSpeed: (0.002 + MULBERRY.next() * 0.006) * (MULBERRY.next() > 0.5 ? 1 : -1)
        };
    }
}
