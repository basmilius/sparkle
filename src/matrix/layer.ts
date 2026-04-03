import { hexToRGB } from '@basmilius/utils';
import { SimulationLayer } from '../layer';
import { MATRIX_CHARS, MULBERRY } from './consts';
import type { MatrixSimulationConfig } from './simulation';
import type { MatrixColumn } from './types';

export class MatrixLayer extends SimulationLayer {
    readonly #scale: number;
    readonly #speed: number;
    readonly #fontSize: number;
    readonly #trailLength: number;
    readonly #colorRGB: [number, number, number];
    #maxColumns: number;
    #columns: MatrixColumn[] = [];
    #respawnTimers: number[] = [];
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: MatrixSimulationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxColumns = config.columns ?? 40;
        this.#speed = config.speed ?? 1;
        this.#fontSize = (config.fontSize ?? 14) * this.#scale;
        this.#trailLength = config.trailLength ?? 20;
        this.#colorRGB = hexToRGB(config.color ?? '#00ff41');

        if (innerWidth < 991) {
            this.#maxColumns = Math.floor(this.#maxColumns / 2);
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized) {
            this.#initialized = true;
            this.#columns = [];
            this.#respawnTimers = [];

            const columnWidth = this.#fontSize;
            const totalSlots = Math.floor(width / columnWidth);
            const columnCount = Math.min(this.#maxColumns, totalSlots);

            for (let i = 0; i < columnCount; ++i) {
                const column = this.#createColumn(totalSlots, height);
                this.#columns.push(column);
                this.#respawnTimers.push(0);
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const columnWidth = this.#fontSize;
        const totalSlots = Math.floor(width / columnWidth);

        for (let i = 0; i < this.#columns.length; ++i) {
            if (this.#respawnTimers[i] > 0) {
                this.#respawnTimers[i] -= dt;

                if (this.#respawnTimers[i] <= 0) {
                    this.#columns[i] = this.#createColumn(totalSlots, height);
                }

                continue;
            }

            const column = this.#columns[i];

            column.y += column.speed * this.#speed * dt;

            for (let ci = 0; ci < column.chars.length; ++ci) {
                if (MULBERRY.next() < 0.03) {
                    column.chars[ci] = MATRIX_CHARS[Math.floor(MULBERRY.next() * MATRIX_CHARS.length)];
                }
            }

            const topOfTrail = column.y - (column.chars.length - 1) * this.#fontSize;

            if (topOfTrail > height) {
                this.#respawnTimers[i] = 10 + MULBERRY.next() * 60;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);

        const [cr, cg, cb] = this.#colorRGB;

        ctx.font = `${this.#fontSize}px monospace`;
        ctx.textAlign = 'center';

        for (const column of this.#columns) {
            const charCount = column.chars.length;

            for (let ci = 0; ci < charCount; ++ci) {
                const charY = column.y - (charCount - 1 - ci) * this.#fontSize;

                if (charY < -this.#fontSize || charY > height + this.#fontSize) {
                    continue;
                }

                const isHead = ci === charCount - 1;

                if (isHead) {
                    const headAlpha = column.headBrightness;
                    ctx.fillStyle = `rgba(255, 255, 255, ${headAlpha})`;
                } else {
                    const trailProgress = ci / (charCount - 1);
                    const alpha = trailProgress * 0.8 + 0.05;
                    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
                }

                ctx.fillText(column.chars[ci], column.x, charY);
            }
        }
    }

    #createColumn(totalSlots: number, height: number): MatrixColumn {
        const columnWidth = this.#fontSize;
        const slot = Math.floor(MULBERRY.next() * totalSlots);
        const length = Math.floor(this.#trailLength * 0.5 + MULBERRY.next() * this.#trailLength);
        const chars: string[] = [];

        for (let ci = 0; ci < length; ++ci) {
            chars.push(MATRIX_CHARS[Math.floor(MULBERRY.next() * MATRIX_CHARS.length)]);
        }

        return {
            x: slot * columnWidth + columnWidth / 2,
            y: -(MULBERRY.next() * height),
            speed: 1.5 + MULBERRY.next() * 3,
            chars,
            length,
            headBrightness: 0.8 + MULBERRY.next() * 0.2
        };
    }
}
