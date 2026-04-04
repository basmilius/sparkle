import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { VoronoiCell } from './types';

export interface VoronoiConfig {
    readonly cells?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly edgeColor?: string;
    readonly edgeWidth?: number;
    readonly scale?: number;
}

const DEFAULT_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#e17055'];

export class Voronoi extends Effect<VoronoiConfig> {
    #speed: number;
    #scale: number;
    readonly #cellCount: number;
    #edgeWidth: number;
    #colorStrings: string[];
    #edgeColor: string;
    #cells: VoronoiCell[] = [];

    constructor(config: VoronoiConfig = {}) {
        super();

        this.#speed = config.speed ?? 0.5;
        this.#scale = config.scale ?? 1;
        this.#cellCount = config.cells ?? 20;
        this.#edgeWidth = config.edgeWidth ?? 2;

        const colors = config.colors ?? DEFAULT_COLORS;
        const colorRGBs = colors.map(c => hexToRGB(c));
        this.#colorStrings = colorRGBs.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);

        const [er, eg, eb] = hexToRGB(config.edgeColor ?? '#ffffff');
        this.#edgeColor = `rgb(${er}, ${eg}, ${eb})`;
    }

    configure(config: Partial<VoronoiConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
        if (config.edgeWidth !== undefined) {
            this.#edgeWidth = config.edgeWidth;
        }
        if (config.edgeColor !== undefined) {
            const [er, eg, eb] = hexToRGB(config.edgeColor);
            this.#edgeColor = `rgb(${er}, ${eg}, ${eb})`;
        }
        if (config.colors !== undefined) {
            const colorRGBs = config.colors.map(color => hexToRGB(color));
            this.#colorStrings = colorRGBs.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);

            for (let idx = 0; idx < this.#cells.length; idx++) {
                this.#cells[idx].color = idx % this.#colorStrings.length;
            }
        }
    }

    onResize(width: number, height: number): void {
        this.#cells = [];

        for (let idx = 0; idx < this.#cellCount; idx++) {
            this.#cells.push({
                x: MULBERRY.next() * width,
                y: MULBERRY.next() * height,
                vx: (MULBERRY.next() - 0.5) * 60,
                vy: (MULBERRY.next() - 0.5) * 60,
                color: idx % this.#colorStrings.length
            });
        }
    }

    tick(dt: number, width: number, height: number): void {
        const speed = this.#speed;

        for (let idx = 0; idx < this.#cells.length; idx++) {
            const cell = this.#cells[idx];

            cell.x += cell.vx * dt * 0.02 * speed;
            cell.y += cell.vy * dt * 0.02 * speed;

            if (cell.x < 0) {
                cell.x = 0;
                cell.vx = -cell.vx;
            } else if (cell.x > width) {
                cell.x = width;
                cell.vx = -cell.vx;
            }

            if (cell.y < 0) {
                cell.y = 0;
                cell.vy = -cell.vy;
            } else if (cell.y > height) {
                cell.y = height;
                cell.vy = -cell.vy;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const cells = this.#cells;
        const cellCount = cells.length;

        if (cellCount === 0) {
            return;
        }

        const edgeWidth = this.#edgeWidth * this.#scale;
        const pad = 2;
        const bounds: [number, number][] = [
            [-pad, -pad],
            [width + pad, -pad],
            [width + pad, height + pad],
            [-pad, height + pad]
        ];

        for (let ci = 0; ci < cellCount; ci++) {
            const cell = cells[ci];
            let polygon = bounds;

            for (let cj = 0; cj < cellCount; cj++) {
                if (ci === cj) {
                    continue;
                }

                const other = cells[cj];
                const mx = (cell.x + other.x) * 0.5;
                const my = (cell.y + other.y) * 0.5;
                const nx = other.x - cell.x;
                const ny = other.y - cell.y;

                polygon = this.#clipPolygon(polygon, mx, my, nx, ny);

                if (polygon.length === 0) {
                    break;
                }
            }

            if (polygon.length < 3) {
                continue;
            }

            ctx.fillStyle = this.#colorStrings[cell.color];
            ctx.beginPath();
            ctx.moveTo(polygon[0][0], polygon[0][1]);

            for (let vi = 1; vi < polygon.length; vi++) {
                ctx.lineTo(polygon[vi][0], polygon[vi][1]);
            }

            ctx.closePath();
            ctx.fill();

            if (edgeWidth > 0) {
                ctx.strokeStyle = this.#edgeColor;
                ctx.lineWidth = edgeWidth;
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        }
    }

    #clipPolygon(polygon: [number, number][], mx: number, my: number, nx: number, ny: number): [number, number][] {
        const output: [number, number][] = [];
        const len = polygon.length;

        if (len === 0) {
            return output;
        }

        let prevX = polygon[len - 1][0];
        let prevY = polygon[len - 1][1];
        let prevDot = (prevX - mx) * nx + (prevY - my) * ny;

        for (let vi = 0; vi < len; vi++) {
            const currX = polygon[vi][0];
            const currY = polygon[vi][1];
            const currDot = (currX - mx) * nx + (currY - my) * ny;

            if (currDot <= 0) {
                if (prevDot > 0) {
                    const t = prevDot / (prevDot - currDot);
                    output.push([
                        prevX + (currX - prevX) * t,
                        prevY + (currY - prevY) * t
                    ]);
                }

                output.push([currX, currY]);
            } else if (prevDot <= 0) {
                const t = prevDot / (prevDot - currDot);
                output.push([
                    prevX + (currX - prevX) * t,
                    prevY + (currY - prevY) * t
                ]);
            }

            prevX = currX;
            prevY = currY;
            prevDot = currDot;
        }

        return output;
    }
}
