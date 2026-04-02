import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { GLITTER_COLORS, MULBERRY } from './consts';
import type { FallingGlitter, SettledGlitter } from './types';

export interface GlitterSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly groundLevel?: number;
    readonly maxSettled?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class GlitterSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #size: number;
    readonly #speed: number;
    readonly #groundLevel: number;
    readonly #maxSettled: number;
    readonly #colorRGBs: [number, number, number][];
    #maxCount: number;
    #time: number = 0;
    #falling: FallingGlitter[] = [];
    #settled: SettledGlitter[] = [];

    constructor(canvas: HTMLCanvasElement, config: GlitterSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 80;
        this.#size = (config.size ?? 4) * this.#scale;
        this.#speed = config.speed ?? 1;
        this.#groundLevel = config.groundLevel ?? 0.85;
        this.#maxSettled = config.maxSettled ?? 200;

        const colors = config.colors ?? GLITTER_COLORS;
        this.#colorRGBs = colors.map(c => hexToRGB(c));

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#falling.push(this.#createFallingPiece(true));
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        // Draw settled glitter first (underneath)
        for (const piece of this.#settled) {
            const px = piece.x * this.width;
            const py = piece.y * this.height;
            const [r, g, b] = this.#colorRGBs[piece.colorIndex % this.#colorRGBs.length];

            // Sparkle pulse for settled pieces
            const sparkle = 0.3 + 0.7 * Math.max(0, Math.sin(this.#time * piece.sparkleSpeed + piece.sparklePhase));
            const alpha = 0.4 + 0.6 * sparkle;

            this.#drawDiamond(ctx, px, py, piece.size, piece.rotation, r, g, b, alpha, sparkle);
        }

        // Draw falling glitter on top
        for (const piece of this.#falling) {
            const px = piece.x * this.width;
            const py = piece.y * this.height;
            const [r, g, b] = this.#colorRGBs[piece.colorIndex % this.#colorRGBs.length];

            // 3D flip effect: use flipAngle to simulate depth via horizontal squash
            const flipFactor = Math.abs(Math.cos(piece.flipAngle));
            const alpha = 0.5 + 0.5 * piece.sparkle;

            this.#drawDiamond(ctx, px, py, piece.size, piece.rotation, r, g, b, alpha, piece.sparkle, flipFactor);
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        this.#time += 0.03 * dt;

        // Update falling pieces
        let alive = 0;

        for (let i = 0; i < this.#falling.length; i++) {
            const piece = this.#falling[i];

            piece.y += piece.vy * this.#speed * dt;
            piece.rotation += piece.rotationSpeed * dt;
            piece.flipAngle += piece.flipSpeed * dt;

            // Update sparkle with random flashes
            piece.sparkle = 0.3 + 0.7 * Math.max(0, Math.sin(this.#time * 3 + piece.flipAngle * 2));

            // Check if piece has reached the ground
            if (piece.y >= this.#groundLevel) {
                this.#settleGlitter(piece);
                // Replace with a new falling piece from the top
                this.#falling[alive++] = this.#createFallingPiece(false);
            } else if (piece.y > 1.1) {
                // Off screen, recycle
                this.#falling[alive++] = this.#createFallingPiece(false);
            } else {
                this.#falling[alive++] = piece;
            }
        }

        this.#falling.length = alive;

        // Fade out oldest settled pieces when over limit
        while (this.#settled.length > this.#maxSettled) {
            this.#settled.shift();
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

        // Diamond vertices (top, right, bottom, left)
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

        // Base fill
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
        ctx.fill();

        // Specular highlight: bright white flash when sparkle is high
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
