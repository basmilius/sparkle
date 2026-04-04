import { isSmallScreen } from '../mobile';
import { parseColor } from '../color';
import { createGlowSprite } from '../sprite';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { LavaBlob } from './types';

export interface LavaConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly scale?: number;
}

const DEFAULT_COLORS = ['#ff4400', '#ff8800', '#ffcc00', '#ff0066'];
const SPRITE_SIZE = 512;
const SPRITE_CENTER = SPRITE_SIZE / 2;
const SPRITE_RADIUS = SPRITE_SIZE / 2;

export class Lava extends Effect<LavaConfig> {
    #scale: number;
    #speed: number;
    #count: number;
    #colors: string[];
    #blobs: LavaBlob[] = [];
    #sprites: HTMLCanvasElement[] = [];
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #time: number = 0;

    constructor(config: LavaConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#count = config.count ?? 12;
        this.#colors = config.colors ?? [...DEFAULT_COLORS];

        if (isSmallScreen()) {
            this.#count = Math.floor(this.#count * 0.7);
        }

        this.#sprites = this.#createSprites();

        for (let index = 0; index < this.#count; index++) {
            this.#blobs.push(this.#createBlob());
        }
    }

    configure(config: Partial<LavaConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }

        if (config.count !== undefined) {
            this.#count = config.count;
        }

        if (config.colors !== undefined) {
            this.#colors = config.colors;
            this.#sprites = this.#createSprites();
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.001 * dt * this.#speed;

        for (const blob of this.#blobs) {
            blob.phase += 0.008 * dt * blob.speed * this.#speed;
            blob.driftPhase += 0.0015 * dt * this.#speed;

            blob.y = blob.baseY + Math.sin(blob.phase) * blob.amplitude;
            blob.x += Math.sin(blob.driftPhase) * blob.driftX * 0.0001 * dt;

            if (blob.x < -0.15) {
                blob.x = 1.15;
            } else if (blob.x > 1.15) {
                blob.x = -0.15;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        if (!this.#offscreen || this.#offscreen.width !== width || this.#offscreen.height !== height) {
            this.#offscreen = document.createElement('canvas');
            this.#offscreen.width = width;
            this.#offscreen.height = height;
            this.#offscreenCtx = this.#offscreen.getContext('2d');
        }

        const offCtx = this.#offscreenCtx!;
        offCtx.clearRect(0, 0, width, height);
        offCtx.globalCompositeOperation = 'screen';

        const canvasScale = Math.min(width, height) / 600;

        for (const blob of this.#blobs) {
            const px = blob.x * width;
            const py = blob.y * height;
            const displayRadius = blob.radius * this.#scale * canvasScale;
            const displaySize = displayRadius * 2;

            offCtx.globalAlpha = 0.6 + 0.4 * Math.sin(this.#time * 3 + blob.phase);
            offCtx.drawImage(
                this.#sprites[blob.colorIndex],
                px - displayRadius,
                py - displayRadius,
                displaySize,
                displaySize
            );
        }

        offCtx.globalCompositeOperation = 'source-over';
        offCtx.globalAlpha = 1;

        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(20px)';
        ctx.drawImage(this.#offscreen, 0, 0);
        ctx.filter = '';
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #createSprites(): HTMLCanvasElement[] {
        return this.#colors.map(color => {
            const {r, g, b} = parseColor(color);
            return createGlowSprite(r, g, b, SPRITE_SIZE, [[0, 1], [0.3, 0.8], [0.6, 0.4], [0.85, 0.1], [1, 0]]);
        });
    }

    #createBlob(): LavaBlob {
        const minRadius = 80 * this.#scale;
        const maxRadius = 160 * this.#scale;

        return {
            x: MULBERRY.next(),
            y: 0.2 + MULBERRY.next() * 0.6,
            baseY: 0.2 + MULBERRY.next() * 0.6,
            radius: minRadius + MULBERRY.next() * (maxRadius - minRadius),
            colorIndex: Math.floor(MULBERRY.next() * this.#colors.length),
            speed: 0.5 + MULBERRY.next() * 1.5,
            phase: MULBERRY.next() * Math.PI * 2,
            amplitude: 0.05 + MULBERRY.next() * 0.2,
            driftX: (MULBERRY.next() - 0.5) * 2,
            driftPhase: MULBERRY.next() * Math.PI * 2
        };
    }
}
