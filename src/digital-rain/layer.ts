import { isSmallScreen } from '../mobile';
import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { BINARY_CHARS, HEX_CHARS, MIXED_CHARS, MULBERRY } from './consts';
import type { DigitalRainColumn, DigitalRainMode } from './types';

export interface DigitalRainConfig {
    readonly speed?: number;
    readonly fontSize?: number;
    readonly columns?: number;
    readonly mode?: DigitalRainMode;
    readonly color?: string;
    readonly trailLength?: number;
    readonly scale?: number;
}

export class DigitalRain extends Effect<DigitalRainConfig> {
    #speed: number;
    #trailLength: number;
    readonly #fontSize: number;
    readonly #mode: DigitalRainMode;
    readonly #colorRGB: [number, number, number];
    readonly #scale: number;
    #maxColumns: number;
    #columns: DigitalRainColumn[] = [];
    #respawnTimers: number[] = [];
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: DigitalRainConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#fontSize = (config.fontSize ?? 14) * this.#scale;
        this.#maxColumns = config.columns ?? 0;
        this.#mode = config.mode ?? 'hex';
        this.#colorRGB = hexToRGB(config.color ?? '#00ffaa');
        this.#trailLength = config.trailLength ?? 20;

        if (isSmallScreen() && this.#maxColumns > 0) {
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
            let columnCount: number;

            if (this.#maxColumns === 0) {
                columnCount = totalSlots;
            } else {
                columnCount = Math.min(this.#maxColumns, totalSlots);
            }

            if (isSmallScreen() && this.#maxColumns === 0) {
                columnCount = Math.floor(columnCount / 2);
            }

            for (let i = 0; i < columnCount; ++i) {
                const column = this.#createColumn(totalSlots, height);
                this.#columns.push(column);
                this.#respawnTimers.push(0);
            }
        }
    }

    configure(config: Partial<DigitalRainConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.trailLength !== undefined) {
            this.#trailLength = config.trailLength;
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
            // Randomly change characters as they fall
            for (let ci = 0; ci < column.chars.length; ++ci) {
                if (MULBERRY.next() < 0.04) {
                    column.chars[ci] = this.#randomChar();
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
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                } else {
                    const trailProgress = ci / (charCount - 1);
                    const alpha = trailProgress * 0.8 + 0.05;
                    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
                }

                ctx.fillText(column.chars[ci], column.x, charY);
            }
        }
    }

    #randomChar(): string {
        let charset: string;

        switch (this.#mode) {
            case 'binary':
                charset = BINARY_CHARS;
                break;
            case 'hex':
                charset = HEX_CHARS;
                break;
            case 'mixed':
                charset = MIXED_CHARS;
                break;
        }

        return charset[Math.floor(MULBERRY.next() * charset.length)];
    }

    #createColumn(totalSlots: number, height: number): DigitalRainColumn {
        const columnWidth = this.#fontSize;
        const slot = Math.floor(MULBERRY.next() * totalSlots);
        const length = Math.floor(this.#trailLength * 0.5 + MULBERRY.next() * this.#trailLength);
        const chars: string[] = [];

        for (let ci = 0; ci < length; ++ci) {
            chars.push(this.#randomChar());
        }

        return {
            x: slot * columnWidth + columnWidth / 2,
            y: -(MULBERRY.next() * height),
            speed: 1.5 + MULBERRY.next() * 3,
            chars,
            length
        };
    }
}
