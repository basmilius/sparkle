import { isSmallScreen } from '../mobile';
import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { GLITTER_COLORS, MULBERRY } from './consts';
import type { FallingGlitter, GlitterConfig, SettledGlitter } from './types';

export class Glitter extends Effect<GlitterConfig> {
    readonly #scale: number;
    readonly #size: number;
    #speed: number;
    #groundLevel: number;
    readonly #maxSettled: number;
    readonly #colorRGBs: [number, number, number][];
    #maxCount: number;
    #time: number = 0;
    #falling: FallingGlitter[] = [];
    #settled: SettledGlitter[] = [];

    constructor(config: GlitterConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 80;
        this.#size = (config.size ?? 4) * this.#scale;
        this.#speed = config.speed ?? 1;
        this.#groundLevel = config.groundLevel ?? 0.85;
        this.#maxSettled = config.maxSettled ?? 200;

        const colors = config.colors ?? GLITTER_COLORS;
        this.#colorRGBs = colors.map(c => hexToRGB(c));

        if (isSmallScreen()) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#falling.push(this.#createFallingPiece(true));
        }
    }

    configure(config: Partial<GlitterConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.groundLevel !== undefined) {
            this.#groundLevel = config.groundLevel;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.03 * dt;

        let alive = 0;

        for (let i = 0; i < this.#falling.length; i++) {
            const piece = this.#falling[i];

            piece.y += piece.vy * this.#speed * dt;
            piece.rotation += piece.rotationSpeed * dt;
            piece.flipAngle += piece.flipSpeed * dt;

            piece.sparkle = 0.3 + 0.7 * Math.max(0, Math.sin(this.#time * 3 + piece.flipAngle * 2));

            if (piece.y >= this.#groundLevel) {
                this.#settleGlitter(piece);
                this.#falling[alive++] = this.#createFallingPiece(false);
            } else if (piece.y > 1.1) {
                this.#falling[alive++] = this.#createFallingPiece(false);
            } else {
                this.#falling[alive++] = piece;
            }
        }

        this.#falling.length = alive;

        while (this.#settled.length > this.#maxSettled) {
            this.#settled.shift();
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

        for (const piece of this.#settled) {
            const px = piece.x * width;
            const py = piece.y * height;
            const [r, g, b] = this.#colorRGBs[piece.colorIndex % this.#colorRGBs.length];

            const sparkle = 0.3 + 0.7 * Math.max(0, Math.sin(this.#time * piece.sparkleSpeed + piece.sparklePhase));
            const alpha = 0.4 + 0.6 * sparkle;

            this.#drawDiamond(ctx, px, py, piece.size, piece.rotation, r, g, b, alpha, sparkle);
        }

        for (const piece of this.#falling) {
            const px = piece.x * width;
            const py = piece.y * height;
            const [r, g, b] = this.#colorRGBs[piece.colorIndex % this.#colorRGBs.length];

            const flipFactor = Math.abs(Math.cos(piece.flipAngle));
            const alpha = 0.5 + 0.5 * piece.sparkle;

            this.#drawDiamond(ctx, px, py, piece.size, piece.rotation, r, g, b, alpha, piece.sparkle, flipFactor);
        }
    }

    #drawDiamond(
        ctx: CanvasRenderingContext2D,
        cx: number,
        cy: number,
        size: number,
        rotation: number,
        r: number,
        g: number,
        b: number,
        alpha: number,
        sparkle: number,
        flipFactor: number = 1
    ): void {
        const halfW = size * flipFactor;
        const halfH = size;

        if (halfW < 0.3) {
            return;
        }

        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        const points = [
            {x: 0, y: -halfH},
            {x: halfW, y: 0},
            {x: 0, y: halfH},
            {x: -halfW, y: 0}
        ];

        ctx.beginPath();
        ctx.moveTo(cx + points[0].x * cos - points[0].y * sin, cy + points[0].x * sin + points[0].y * cos);

        for (let p = 1; p < points.length; p++) {
            ctx.lineTo(cx + points[p].x * cos - points[p].y * sin, cy + points[p].x * sin + points[p].y * cos);
        }

        ctx.closePath();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
        ctx.fill();

        if (sparkle > 0.5) {
            const highlightAlpha = (sparkle - 0.5) * 2 * alpha;
            ctx.fillStyle = `rgba(255, 255, 255, ${highlightAlpha * 0.6})`;
            ctx.fill();
        }
    }

    #settleGlitter(piece: FallingGlitter): void {
        this.#settled.push({
            x: piece.x,
            y: this.#groundLevel + MULBERRY.next() * 0.05,
            size: piece.size * 0.8,
            rotation: piece.rotation,
            sparklePhase: MULBERRY.next() * Math.PI * 2,
            sparkleSpeed: 0.5 + MULBERRY.next() * 2,
            colorIndex: piece.colorIndex
        });
    }

    #createFallingPiece(initialSpread: boolean): FallingGlitter {
        return {
            x: MULBERRY.next(),
            y: initialSpread ? MULBERRY.next() * this.#groundLevel : -0.05 - MULBERRY.next() * 0.1,
            vy: (0.0008 + MULBERRY.next() * 0.0015) * this.#scale,
            size: (0.5 + MULBERRY.next() * 1) * this.#size,
            rotation: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.08,
            flipAngle: MULBERRY.next() * Math.PI * 2,
            flipSpeed: 0.03 + MULBERRY.next() * 0.07,
            sparkle: MULBERRY.next(),
            colorIndex: Math.floor(MULBERRY.next() * this.#colorRGBs.length),
            settled: false
        };
    }
}
