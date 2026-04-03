import { hexToRGB } from '@basmilius/utils';
import { SimulationLayer } from '../layer';
import { MULBERRY, ORBIT_COLORS } from './consts';
import type { OrbitSimulationConfig } from './simulation';
import type { OrbitalCenter, Orbiter } from './types';

export class OrbitLayer extends SimulationLayer {
    readonly #centerCount: number;
    readonly #orbitersPerCenter: number;
    #speed: number;
    readonly #colors: string[];
    #trailLength: number;
    #showCenters: boolean;
    #scale: number;
    #centers: OrbitalCenter[] = [];
    #orbiters: Orbiter[] = [];
    #time: number = 0;
    #initialized: boolean = false;

    constructor(config: OrbitSimulationConfig = {}) {
        super();

        this.#centerCount = config.centers ?? 3;
        this.#orbitersPerCenter = config.orbitersPerCenter ?? 8;
        this.#speed = config.speed ?? 1;
        this.#colors = config.colors ?? ORBIT_COLORS;
        this.#trailLength = config.trailLength ?? 15;
        this.#showCenters = config.showCenters ?? true;
        this.#scale = config.scale ?? 1;
    }

    onResize(_width: number, _height: number): void {
        if (!this.#initialized) {
            this.#initialized = true;
            this.#centers = [];
            this.#orbiters = [];

            for (let i = 0; i < this.#centerCount; i++) {
                this.#centers.push({
                    x: 0.15 + MULBERRY.next() * 0.7,
                    y: 0.15 + MULBERRY.next() * 0.7
                });
            }

            const count = innerWidth < 991
                ? Math.floor(this.#orbitersPerCenter / 2)
                : this.#orbitersPerCenter;

            for (let ci = 0; ci < this.#centers.length; ci++) {
                for (let oi = 0; oi < count; oi++) {
                    this.#orbiters.push(this.#createOrbiter(ci));
                }
            }
        }
    }

    configure(config: Record<string, unknown>): void {
        if (config.speed !== undefined) { this.#speed = config.speed as number; }
        if (config.trailLength !== undefined) { this.#trailLength = config.trailLength as number; }
        if (config.showCenters !== undefined) { this.#showCenters = config.showCenters as boolean; }
        if (config.scale !== undefined) { this.#scale = config.scale as number; }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.01 * dt * this.#speed;

        for (const orbiter of this.#orbiters) {
            const center = this.#centers[orbiter.centerIndex];
            const cx = center.x * width;
            const cy = center.y * height;

            orbiter.angle += orbiter.angularSpeed * dt * this.#speed;

            const cosAngle = Math.cos(orbiter.angle);
            const sinAngle = Math.sin(orbiter.angle);
            const cosTilt = Math.cos(orbiter.tilt);

            const localX = cosAngle * orbiter.radiusX * this.#scale;
            const localY = sinAngle * orbiter.radiusY * this.#scale * cosTilt;

            const rotatedX = localX * Math.cos(orbiter.tilt * 0.3) - localY * Math.sin(orbiter.tilt * 0.3);
            const rotatedY = localX * Math.sin(orbiter.tilt * 0.3) + localY * Math.cos(orbiter.tilt * 0.3);

            const px = cx + rotatedX;
            const py = cy + rotatedY;

            orbiter.trail.push({x: px, y: py});

            if (orbiter.trail.length > this.#trailLength) {
                orbiter.trail.shift();
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

        if (this.#showCenters) {
            ctx.globalCompositeOperation = 'lighter';

            for (const center of this.#centers) {
                const cx = center.x * width;
                const cy = center.y * height;
                const glowRadius = 30 * this.#scale;

                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(0.4, 'rgba(200, 200, 255, 0.1)');
                gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');

                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';
        }

        ctx.globalCompositeOperation = 'lighter';

        for (const orbiter of this.#orbiters) {
            const [cr, cg, cb] = hexToRGB(orbiter.color);

            if (orbiter.trail.length > 1) {
                for (let ti = 0; ti < orbiter.trail.length - 1; ti++) {
                    const progress = (ti + 1) / orbiter.trail.length;
                    const trailAlpha = progress * 0.5;
                    const trailWidth = orbiter.size * progress * this.#scale;

                    if (trailAlpha < 0.01) {
                        continue;
                    }

                    ctx.globalAlpha = trailAlpha;
                    ctx.strokeStyle = `rgb(${cr}, ${cg}, ${cb})`;
                    ctx.lineWidth = trailWidth;
                    ctx.beginPath();
                    ctx.moveTo(orbiter.trail[ti].x, orbiter.trail[ti].y);
                    ctx.lineTo(orbiter.trail[ti + 1].x, orbiter.trail[ti + 1].y);
                    ctx.stroke();
                }
            }

            if (orbiter.trail.length > 0) {
                const head = orbiter.trail[orbiter.trail.length - 1];
                const headSize = orbiter.size * this.#scale;

                const glow = ctx.createRadialGradient(
                    head.x, head.y, 0,
                    head.x, head.y, headSize * 3
                );
                glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.9)`);
                glow.addColorStop(0.3, `rgba(${cr}, ${cg}, ${cb}, 0.3)`);
                glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.arc(head.x, head.y, headSize * 3, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(head.x, head.y, headSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createOrbiter(centerIndex: number): Orbiter {
        const minRadius = 40;
        const maxRadius = 160;

        return {
            centerIndex,
            angle: MULBERRY.next() * Math.PI * 2,
            angularSpeed: 0.01 + MULBERRY.next() * 0.03,
            radiusX: minRadius + MULBERRY.next() * (maxRadius - minRadius),
            radiusY: (minRadius + MULBERRY.next() * (maxRadius - minRadius)) * (0.3 + MULBERRY.next() * 0.7),
            tilt: MULBERRY.next() * Math.PI,
            size: 1.5 + MULBERRY.next() * 2.5,
            color: this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)],
            trail: []
        };
    }
}
