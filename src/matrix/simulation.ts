import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MATRIX_CHARS, MULBERRY } from './consts';
import type { MatrixColumn } from './types';

export interface MatrixSimulationConfig {
    readonly columns?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly fontSize?: number;
    readonly trailLength?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class MatrixSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #speed: number;
    readonly #fontSize: number;
    readonly #trailLength: number;
    readonly #colorRGB: [number, number, number];
    #maxColumns: number;
    #columns: MatrixColumn[] = [];
    #respawnTimers: number[] = [];

    constructor(canvas: HTMLCanvasElement, config: MatrixSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#maxColumns = config.columns ?? 40;
        this.#speed = config.speed ?? 1;
        this.#fontSize = (config.fontSize ?? 14) * this.#scale;
        this.#trailLength = config.trailLength ?? 20;
        this.#colorRGB = hexToRGB(config.color ?? '#00ff41');

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxColumns = Math.floor(this.#maxColumns / 2);
        }
    }

    start(): void {
        super.start();

        this.#columns = [];
        this.#respawnTimers = [];

        const columnWidth = this.#fontSize;
        const totalSlots = Math.floor(this.width / columnWidth);
        const columnCount = Math.min(this.#maxColumns, totalSlots);

        for (let i = 0; i < columnCount; ++i) {
            const column = this.#createColumn(totalSlots);
            this.#columns.push(column);
            this.#respawnTimers.push(0);
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;

        // Fill with black background
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, this.width, this.height);

        const [cr, cg, cb] = this.#colorRGB;

        ctx.font = `${this.#fontSize}px monospace`;
        ctx.textAlign = 'center';

        for (const column of this.#columns) {
            const charCount = column.chars.length;

            for (let ci = 0; ci < charCount; ++ci) {
                const charY = column.y - (charCount - 1 - ci) * this.#fontSize;

                if (charY < -this.#fontSize || charY > this.height + this.#fontSize) {
                    continue;
                }

                const isHead = ci === charCount - 1;

                if (isHead) {
                    // Head character: bright white/green
                    const headAlpha = column.headBrightness;
                    ctx.fillStyle = `rgba(255, 255, 255, ${headAlpha})`;
                } else {
                    // Trail characters: fade from bright to dim
                    const trailProgress = ci / (charCount - 1);
                    const alpha = trailProgress * 0.8 + 0.05;
                    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
                }

                ctx.fillText(column.chars[ci], column.x, charY);
            }
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;
        const columnWidth = this.#fontSize;
        const totalSlots = Math.floor(this.width / columnWidth);

        for (let i = 0; i < this.#columns.length; ++i) {
            if (this.#respawnTimers[i] > 0) {
                this.#respawnTimers[i] -= dt;

                if (this.#respawnTimers[i] <= 0) {
                    this.#columns[i] = this.#createColumn(totalSlots);
                }

                continue;
            }

            const column = this.#columns[i];

            // Move column down
            column.y += column.speed * this.#speed * dt;

            // Randomly change characters
            for (let ci = 0; ci < column.chars.length; ++ci) {
                if (MULBERRY.next() < 0.03) {
                    column.chars[ci] = MATRIX_CHARS[Math.floor(MULBERRY.next() * MATRIX_CHARS.length)];
                }
            }

            // Check if the entire trail has moved off-screen
            const topOfTrail = column.y - (column.chars.length - 1) * this.#fontSize;

            if (topOfTrail > this.height) {
                this.#respawnTimers[i] = 10 + MULBERRY.next() * 60;
            }
        }
    }

    #createColumn(totalSlots: number): MatrixColumn {
        const columnWidth = this.#fontSize;
        const slot = Math.floor(MULBERRY.next() * totalSlots);
        const length = Math.floor(this.#trailLength * 0.5 + MULBERRY.next() * this.#trailLength);
        const chars: string[] = [];

        for (let ci = 0; ci < length; ++ci) {
            chars.push(MATRIX_CHARS[Math.floor(MULBERRY.next() * MATRIX_CHARS.length)]);
        }

        return {
            x: slot * columnWidth + columnWidth / 2,
            y: -(MULBERRY.next() * this.height),
            speed: 1.5 + MULBERRY.next() * 3,
            chars,
            length,
            headBrightness: 0.8 + MULBERRY.next() * 0.2
        };
    }
}
