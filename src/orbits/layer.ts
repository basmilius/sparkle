import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY, ORBIT_COLORS } from './consts';
import type { OrbitalCenter, Orbiter, OrbitsConfig } from './types';

export class Orbits extends Effect<OrbitsConfig> {
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

    constructor(config: OrbitsConfig = {}) {
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

    configure(config: Partial<OrbitsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.trailLength !== undefined) {
            this.#trailLength = config.trailLength;
        }
        if (config.showCenters !== undefined) {
            this.#showCenters = config.showCenters;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
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

            const trail = orbiter.trail;
            const maxLen = this.#trailLength;

            if (trail.length < maxLen) {
                trail.push({x: px, y: py});
                orbiter.trailHead = trail.length - 1;
            } else {
                const next = (orbiter.trailHead + 1) % maxLen;
                trail[next].x = px;
                trail[next].y = py;
                orbiter.trailHead = next;
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
            const trail = orbiter.trail;
            const trailLen = trail.length;

            if (trailLen > 1) {
                const isFull = trailLen === this.#trailLength;
                const oldest = isFull ? (orbiter.trailHead + 1) % trailLen : 0;

                for (let ti = 0; ti < trailLen - 1; ti++) {
                    const progress = (ti + 1) / trailLen;
                    const trailAlpha = progress * 0.5;
                    const trailWidth = orbiter.size * progress * this.#scale;

                    if (trailAlpha < 0.01) {
                        continue;
                    }

                    const idx0 = (oldest + ti) % trailLen;
                    const idx1 = (oldest + ti + 1) % trailLen;

                    ctx.globalAlpha = trailAlpha;
                    ctx.strokeStyle = `rgb(${cr}, ${cg}, ${cb})`;
                    ctx.lineWidth = trailWidth;
                    ctx.beginPath();
                    ctx.moveTo(trail[idx0].x, trail[idx0].y);
                    ctx.lineTo(trail[idx1].x, trail[idx1].y);
                    ctx.stroke();
                }
            }

            if (trailLen > 0) {
                const head = trail[orbiter.trailHead];
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
            trail: [],
            trailHead: 0
        };
    }
}
