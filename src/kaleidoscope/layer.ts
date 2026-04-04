import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { DEFAULT_COLORS, MULBERRY } from './consts';
import type { KaleidoscopeConfig, KaleidoscopeShape } from './types';

export class Kaleidoscope extends Effect<KaleidoscopeConfig> {
    #segments: number;
    #speed: number;
    #shapeCount: number;
    #colors: string[];
    #scale: number;
    #shapes: KaleidoscopeShape[] = [];
    #sourceCanvas: HTMLCanvasElement | null = null;
    #sourceCtx: CanvasRenderingContext2D | null = null;
    #sourceRadius: number = 0;
    #time: number = 0;
    #initialized: boolean = false;

    constructor(config: KaleidoscopeConfig = {}) {
        super();

        this.#segments = config.segments ?? 8;
        this.#speed = config.speed ?? 1;
        this.#shapeCount = config.shapes ?? 15;
        this.#colors = config.colors ?? DEFAULT_COLORS;
        this.#scale = config.scale ?? 1;
    }

    configure(config: Partial<KaleidoscopeConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.colors !== undefined) {
            this.#colors = config.colors;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#sourceRadius = Math.min(width, height) / 2;

        const size = Math.ceil(this.#sourceRadius * 2);
        this.#sourceCanvas = document.createElement('canvas');
        this.#sourceCanvas.width = size;
        this.#sourceCanvas.height = size;
        this.#sourceCtx = this.#sourceCanvas.getContext('2d')!;

        if (!this.#initialized) {
            this.#initialized = true;
            this.#shapes = [];

            for (let index = 0; index < this.#shapeCount; index++) {
                this.#shapes.push(this.#createShape());
            }
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        const speedMul = this.#speed * dt;
        this.#time += 0.02 * speedMul;

        const radius = this.#sourceRadius * 0.8;

        for (const shape of this.#shapes) {
            shape.x += shape.vx * speedMul;
            shape.y += shape.vy * speedMul;
            shape.rotation += shape.rotationSpeed * speedMul;

            const dist = Math.sqrt(shape.x * shape.x + shape.y * shape.y);

            if (dist + shape.size > radius) {
                const nx = shape.x / dist;
                const ny = shape.y / dist;
                const dot = shape.vx * nx + shape.vy * ny;
                shape.vx -= 2 * dot * nx;
                shape.vy -= 2 * dot * ny;

                const overlap = dist + shape.size - radius;
                shape.x -= nx * overlap;
                shape.y -= ny * overlap;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        if (!this.#sourceCanvas || !this.#sourceCtx) {
            return;
        }

        const sourceCtx = this.#sourceCtx;
        const radius = this.#sourceRadius;
        const segmentAngle = (Math.PI * 2) / this.#segments;
        const centerX = width / 2;
        const centerY = height / 2;

        sourceCtx.clearRect(0, 0, this.#sourceCanvas.width, this.#sourceCanvas.height);
        sourceCtx.save();

        sourceCtx.beginPath();
        sourceCtx.moveTo(radius, radius);
        sourceCtx.arc(radius, radius, radius, -segmentAngle / 2, segmentAngle / 2);
        sourceCtx.closePath();
        sourceCtx.clip();

        for (const shape of this.#shapes) {
            const px = radius + shape.x * this.#scale;
            const py = radius + shape.y * this.#scale;
            const size = shape.size * this.#scale;
            const [cr, cg, cb] = hexToRGB(shape.color);

            sourceCtx.save();
            sourceCtx.translate(px, py);
            sourceCtx.rotate(shape.rotation);

            if (shape.type === 0) {
                const gradient = sourceCtx.createRadialGradient(0, 0, 0, 0, 0, size);
                gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.9)`);
                gradient.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.5)`);
                gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
                sourceCtx.fillStyle = gradient;
                sourceCtx.beginPath();
                sourceCtx.arc(0, 0, size, 0, Math.PI * 2);
                sourceCtx.fill();
            } else if (shape.type === 1) {
                sourceCtx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.7)`;
                sourceCtx.beginPath();
                for (let point = 0; point < 6; point++) {
                    const angle = (point / 6) * Math.PI * 2;
                    const hx = Math.cos(angle) * size;
                    const hy = Math.sin(angle) * size;

                    if (point === 0) {
                        sourceCtx.moveTo(hx, hy);
                    } else {
                        sourceCtx.lineTo(hx, hy);
                    }
                }
                sourceCtx.closePath();
                sourceCtx.fill();

                sourceCtx.strokeStyle = `rgba(${Math.min(255, cr + 60)}, ${Math.min(255, cg + 60)}, ${Math.min(255, cb + 60)}, 0.5)`;
                sourceCtx.lineWidth = 1.5;
                sourceCtx.stroke();
            } else if (shape.type === 2) {
                const petalCount = 5;

                sourceCtx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.6)`;

                for (let petal = 0; petal < petalCount; petal++) {
                    const angle = (petal / petalCount) * Math.PI * 2;
                    sourceCtx.save();
                    sourceCtx.rotate(angle);
                    sourceCtx.beginPath();
                    sourceCtx.ellipse(0, -size * 0.5, size * 0.3, size * 0.6, 0, 0, Math.PI * 2);
                    sourceCtx.fill();
                    sourceCtx.restore();
                }

                const coreGradient = sourceCtx.createRadialGradient(0, 0, 0, 0, 0, size * 0.25);
                coreGradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`);
                coreGradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0.3)`);
                sourceCtx.fillStyle = coreGradient;
                sourceCtx.beginPath();
                sourceCtx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
                sourceCtx.fill();
            } else {
                const gradient = sourceCtx.createRadialGradient(0, 0, size * 0.3, 0, 0, size);
                gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0)`);
                gradient.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.6)`);
                gradient.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, 0.6)`);
                gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
                sourceCtx.fillStyle = gradient;
                sourceCtx.beginPath();
                sourceCtx.arc(0, 0, size, 0, Math.PI * 2);
                sourceCtx.fill();
            }

            sourceCtx.restore();
        }

        sourceCtx.restore();

        for (let index = 0; index < this.#segments; index++) {
            const angle = segmentAngle * index;
            const mirrored = index % 2 === 1;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);

            if (mirrored) {
                ctx.scale(1, -1);
            }

            ctx.drawImage(this.#sourceCanvas, -radius, -radius);
            ctx.restore();
        }
    }

    #createShape(): KaleidoscopeShape {
        const maxDist = this.#sourceRadius * 0.6;
        const angle = MULBERRY.next() * Math.PI * 2;
        const dist = MULBERRY.next() * maxDist;

        return {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            vx: (MULBERRY.next() - 0.5) * 1.2,
            vy: (MULBERRY.next() - 0.5) * 1.2,
            size: 8 + MULBERRY.next() * 25,
            color: this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)],
            type: Math.floor(MULBERRY.next() * 4),
            rotation: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.06
        };
    }
}
