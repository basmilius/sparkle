import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { TessellationTile } from './types';

export interface TessellationConfig {
    readonly speed?: number;
    readonly colors?: string[];
    readonly tileSize?: number;
    readonly morphSpeed?: number;
    readonly lineWidth?: number;
    readonly lineColor?: string;
    readonly scale?: number;
}

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#e879f9', '#38bdf8'];
const TWO_PI = Math.PI * 2;
const TILE_SHAPES = [3, 4, 6];

export class Tessellation extends Effect<TessellationConfig> {
    readonly #scale: number;
    readonly #tileSize: number;
    readonly #lineWidth: number;
    readonly #lineR: number;
    readonly #lineG: number;
    readonly #lineB: number;
    readonly #colorRGB: [number, number, number][];
    #speed: number;
    #morphSpeed: number;
    #tiles: TessellationTile[] = [];
    #time: number = 0;
    #morphTimer: number = 0;
    #width: number = 0;
    #height: number = 0;

    constructor(config: TessellationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#tileSize = (config.tileSize ?? 60) * this.#scale;
        this.#speed = config.speed ?? 1;
        this.#morphSpeed = config.morphSpeed ?? 0.5;
        this.#lineWidth = (config.lineWidth ?? 1.5) * this.#scale;

        const [lr, lg, lb] = hexToRGB(config.lineColor ?? '#ffffff');
        this.#lineR = lr;
        this.#lineG = lg;
        this.#lineB = lb;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#colorRGB = colors.map((color) => hexToRGB(color));
    }

    configure(config: Partial<TessellationConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.morphSpeed !== undefined) {
            this.#morphSpeed = config.morphSpeed;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#buildTiles(width, height);
    }

    tick(dt: number, _width: number, _height: number): void {
        const speed = this.#speed;
        const dtNorm = dt / 16.667;
        this.#time += 0.005 * dtNorm * speed;
        this.#morphTimer += 0.005 * dtNorm * speed;

        const morphInterval = 6 / this.#morphSpeed;

        if (this.#morphTimer >= morphInterval) {
            this.#morphTimer -= morphInterval;
            this.#triggerMorph();
        }

        const lerpFactor = 1 - Math.pow(0.97, dtNorm * this.#morphSpeed);

        for (let index = 0; index < this.#tiles.length; index++) {
            const tile = this.#tiles[index];

            tile.rotation += (tile.targetRotation - tile.rotation) * lerpFactor;
            tile.scale += (tile.targetScale - tile.scale) * lerpFactor;
            tile.colorIndex += (tile.targetColorIndex - tile.colorIndex) * lerpFactor;
            tile.sides += (tile.targetSides - tile.sides) * lerpFactor * 0.3;

            // Gentle breathing — slow and subtle.
            const breathe = Math.sin(this.#time * tile.breatheSpeed + tile.phase) * 0.04 + 1;
            tile.opacity = 0.7 + Math.sin(this.#time * tile.breatheSpeed * 0.5 + tile.phase + 1) * 0.15;
            tile.targetScale = 0.9 + Math.sin(this.#time * 0.15 + tile.phase) * 0.1;
            tile.scale *= breathe;
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const colorCount = this.#colorRGB.length;
        const lineWidth = this.#lineWidth;

        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';

        for (let index = 0; index < this.#tiles.length; index++) {
            const tile = this.#tiles[index];

            const maxExtent = this.#tileSize * tile.scale * 1.5;
            if (tile.x + maxExtent < 0 || tile.x - maxExtent > width ||
                tile.y + maxExtent < 0 || tile.y - maxExtent > height) {
                continue;
            }

            const sides = Math.round(tile.sides);
            const radius = this.#tileSize * 0.45 * tile.scale;

            if (radius < 0.5) {
                continue;
            }

            const ci = ((tile.colorIndex % colorCount) + colorCount) % colorCount;
            const ciFloor = Math.floor(ci);
            const ciFrac = ci - ciFloor;
            const colA = this.#colorRGB[ciFloor % colorCount];
            const colB = this.#colorRGB[(ciFloor + 1) % colorCount];

            const fillR = Math.round(colA[0] + (colB[0] - colA[0]) * ciFrac);
            const fillG = Math.round(colA[1] + (colB[1] - colA[1]) * ciFrac);
            const fillB = Math.round(colA[2] + (colB[2] - colA[2]) * ciFrac);

            const cos = Math.cos(tile.rotation);
            const sin = Math.sin(tile.rotation);

            ctx.setTransform(cos, sin, -sin, cos, tile.x, tile.y);
            ctx.globalAlpha = tile.opacity;

            ctx.beginPath();
            const angleStep = TWO_PI / sides;
            const startAngle = -Math.PI / 2;

            for (let vertex = 0; vertex <= sides; vertex++) {
                const angle = startAngle + vertex * angleStep;
                const vx = Math.cos(angle) * radius;
                const vy = Math.sin(angle) * radius;

                if (vertex === 0) {
                    ctx.moveTo(vx, vy);
                } else {
                    ctx.lineTo(vx, vy);
                }
            }

            ctx.closePath();

            ctx.fillStyle = `rgb(${fillR}, ${fillG}, ${fillB})`;
            ctx.fill();

            ctx.globalAlpha = tile.opacity * 0.4;
            ctx.strokeStyle = `rgb(${this.#lineR}, ${this.#lineG}, ${this.#lineB})`;
            ctx.stroke();
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
    }

    #buildTiles(width: number, height: number): void {
        this.#tiles = [];

        const size = this.#tileSize;
        const spacingX = size * 0.85;
        const spacingY = size * 0.75;
        const cols = Math.ceil(width / spacingX) + 2;
        const rows = Math.ceil(height / spacingY) + 2;
        const colorCount = this.#colorRGB.length;

        // Center the grid on the canvas.
        const totalWidth = cols * spacingX;
        const totalHeight = rows * spacingY;
        const offsetXBase = (width - totalWidth) * 0.5;
        const offsetYBase = (height - totalHeight) * 0.5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const rowOffset = (row % 2 === 0) ? 0 : spacingX * 0.5;
                const tileX = col * spacingX + rowOffset + offsetXBase;
                const tileY = row * spacingY + offsetYBase;

                const shapeIndex = Math.abs((row + col) % TILE_SHAPES.length);
                const sides = TILE_SHAPES[shapeIndex];

                const colorIdx = ((row * 3 + col * 2) % colorCount + colorCount) % colorCount;
                const baseRotation = MULBERRY.next() * TWO_PI;
                const phase = MULBERRY.next() * TWO_PI;

                this.#tiles.push({
                    x: tileX,
                    y: tileY,
                    rotation: baseRotation,
                    scale: 0.9 + MULBERRY.next() * 0.1,
                    colorIndex: colorIdx + MULBERRY.next() * 0.5,
                    targetRotation: baseRotation,
                    targetScale: 0.9 + MULBERRY.next() * 0.1,
                    targetColorIndex: colorIdx + MULBERRY.next() * 0.5,
                    sides: sides,
                    targetSides: sides,
                    phase: phase,
                    breatheSpeed: 0.15 + MULBERRY.next() * 0.2,
                    opacity: 0.7 + MULBERRY.next() * 0.2
                });
            }
        }
    }

    #triggerMorph(): void {
        const colorCount = this.#colorRGB.length;

        const cx = MULBERRY.next() * this.#width;
        const cy = MULBERRY.next() * this.#height;
        const morphRadius = Math.max(this.#width, this.#height) * 0.5;

        for (let index = 0; index < this.#tiles.length; index++) {
            const tile = this.#tiles[index];
            const dx = tile.x - cx;
            const dy = tile.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > morphRadius) {
                continue;
            }

            const influence = 1 - dist / morphRadius;

            if (MULBERRY.next() < influence * 0.4) {
                tile.targetRotation += (MULBERRY.next() - 0.5) * Math.PI * 0.5 * influence;
            }

            if (MULBERRY.next() < influence * 0.3) {
                const newShape = TILE_SHAPES[Math.floor(MULBERRY.next() * TILE_SHAPES.length)];
                tile.targetSides = newShape;
            }

            if (MULBERRY.next() < influence * 0.4) {
                tile.targetColorIndex = Math.floor(MULBERRY.next() * colorCount) + MULBERRY.next() * 0.5;
            }
        }
    }
}
