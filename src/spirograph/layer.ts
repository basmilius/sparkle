import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { SpirographCurve } from './types';

const DEFAULT_COLORS = ['#ff3366', '#33aaff', '#ffcc00', '#66ff99', '#cc66ff', '#ff6633'];

export interface SpirographConfig {
    readonly speed?: number;
    readonly curves?: number;
    readonly colors?: string[];
    readonly lineWidth?: number;
    readonly fadeSpeed?: number;
    readonly complexity?: number;
    readonly scale?: number;
}

export class Spirograph extends Effect<SpirographConfig> {
    #speed: number;
    readonly #curveCount: number;
    readonly #colors: string[];
    #lineWidth: number;
    #fadeSpeed: number;
    readonly #complexity: number;
    #scale: number;
    #curves: SpirographCurve[] = [];
    #initialized: boolean = false;

    constructor(config: SpirographConfig = {}) {
        super();

        this.#speed = config.speed ?? 1;
        this.#curveCount = config.curves ?? 3;
        this.#colors = config.colors ?? DEFAULT_COLORS;
        this.#lineWidth = config.lineWidth ?? 1.5;
        this.#fadeSpeed = config.fadeSpeed ?? 0.003;
        this.#complexity = config.complexity ?? 5;
        this.#scale = config.scale ?? 1;
    }

    onResize(_width: number, _height: number): void {
        if (!this.#initialized) {
            this.#initialized = true;
            this.#curves = [];

            for (let i = 0; i < this.#curveCount; i++) {
                this.#curves.push(this.#createCurve());
            }
        }
    }

    configure(config: Partial<SpirographConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.lineWidth !== undefined) {
            this.#lineWidth = config.lineWidth;
        }
        if (config.fadeSpeed !== undefined) {
            this.#fadeSpeed = config.fadeSpeed;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, width: number, height: number): void {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.35 * this.#scale;

        for (const curve of this.#curves) {
            curve.age += this.#fadeSpeed * dt * this.#speed;

            // Add new points each frame
            const stepsPerFrame = 4;
            const phaseStep = 0.02 * this.#speed * dt;

            for (let step = 0; step < stepsPerFrame; step++) {
                curve.phase += phaseStep / stepsPerFrame;

                const outerR = baseRadius * curve.outerRadius;
                const innerR = baseRadius * curve.innerRadius;
                const pen = baseRadius * curve.penOffset;
                const theta = curve.phase;
                const diff = outerR - innerR;
                const ratio = diff / innerR;

                const px = cx + diff * Math.cos(theta) + pen * Math.cos(ratio * theta);
                const py = cy + diff * Math.sin(theta) - pen * Math.sin(ratio * theta);

                if (curve.points.length < curve.maxPoints) {
                    curve.points.push({x: px, y: py});
                    curve.pointHead = curve.points.length - 1;
                } else {
                    const next = (curve.pointHead + 1) % curve.maxPoints;
                    curve.points[next].x = px;
                    curve.points[next].y = py;
                    curve.pointHead = next;
                }
            }

            // Replace curve when it has lived long enough
            if (curve.age >= curve.maxAge) {
                const index = this.#curves.indexOf(curve);

                if (index !== -1) {
                    this.#curves[index] = this.#createCurve();
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'lighter';

        for (const curve of this.#curves) {
            const [cr, cg, cb] = curve.colorRGB;
            const pointCount = curve.points.length;

            if (pointCount < 2) {
                continue;
            }

            const isFull = pointCount === curve.maxPoints;
            const oldest = isFull ? (curve.pointHead + 1) % pointCount : 0;
            const fadeIn = Math.min(1, curve.age * 3);
            const fadeOut = Math.max(0, 1 - Math.max(0, curve.age - curve.maxAge + 0.3) / 0.3);
            const curveAlpha = fadeIn * fadeOut;

            ctx.lineWidth = this.#lineWidth * this.#scale;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Draw trail segments with fading opacity
            for (let ti = 0; ti < pointCount - 1; ti++) {
                const progress = (ti + 1) / pointCount;
                const segmentAlpha = progress * curveAlpha * 0.7;

                if (segmentAlpha < 0.01) {
                    continue;
                }

                const idx0 = (oldest + ti) % pointCount;
                const idx1 = (oldest + ti + 1) % pointCount;
                const point0 = curve.points[idx0];
                const point1 = curve.points[idx1];

                // Skip segments that wrap around the ring buffer
                const dx = point1.x - point0.x;
                const dy = point1.y - point0.y;

                if (dx * dx + dy * dy > 10000) {
                    continue;
                }

                ctx.globalAlpha = segmentAlpha;
                ctx.strokeStyle = `color(display-p3 ${cr / 255} ${cg / 255} ${cb / 255})`;
                ctx.beginPath();
                ctx.moveTo(point0.x, point0.y);
                ctx.lineTo(point1.x, point1.y);
                ctx.stroke();
            }

            // Draw head glow
            if (pointCount > 0) {
                const head = curve.points[curve.pointHead];
                const glowSize = 4 * this.#scale;

                const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, glowSize * 3);
                glow.addColorStop(0, `color(display-p3 ${cr / 255} ${cg / 255} ${cb / 255} / 0.8)`);
                glow.addColorStop(0.4, `color(display-p3 ${cr / 255} ${cg / 255} ${cb / 255} / 0.2)`);
                glow.addColorStop(1, `color(display-p3 ${cr / 255} ${cg / 255} ${cb / 255} / 0)`);

                ctx.globalAlpha = curveAlpha;
                ctx.beginPath();
                ctx.arc(head.x, head.y, glowSize * 3, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createCurve(): SpirographCurve {
        // Generate interesting radius ratios based on complexity
        // Use rational ratios with small denominators for closed patterns
        const denominators = [3, 4, 5, 7, 8, 9, 11, 13];
        const denomIdx = Math.floor(MULBERRY.next() * Math.min(denominators.length, this.#complexity + 2));
        const denom = denominators[denomIdx];
        const numer = Math.floor(MULBERRY.next() * (denom - 1)) + 1;

        const outerRadius = 0.6 + MULBERRY.next() * 0.4;
        const innerRadius = outerRadius * (numer / denom);
        const penOffset = innerRadius * (0.3 + MULBERRY.next() * 0.9);

        const color = this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)];
        const [cr, cg, cb] = hexToRGB(color);

        return {
            outerRadius,
            innerRadius,
            penOffset,
            phase: MULBERRY.next() * Math.PI * 2,
            color,
            colorRGB: [cr, cg, cb],
            points: [],
            pointHead: 0,
            maxPoints: 800 + Math.floor(MULBERRY.next() * 400),
            age: 0,
            maxAge: 8 + MULBERRY.next() * 12
        };
    }
}
