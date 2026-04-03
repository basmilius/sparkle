import { parseColor } from '../color';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { Cloud } from './types';

export interface CloudsConfig {
    readonly color?: string;
    readonly count?: number;
    readonly opacity?: number;
    readonly scale?: number;
    readonly speed?: number;
}

const SPRITE_COUNT = 6;
const SPRITE_SIZE = 256;

export class Clouds extends Effect<CloudsConfig> {
    readonly #scale: number;
    #speed: number;
    #count: number;
    #opacity: number;
    #clouds: Cloud[] = [];
    #sprites: HTMLCanvasElement[] = [];
    #colorR: number = 255;
    #colorG: number = 255;
    #colorB: number = 255;

    constructor(config: CloudsConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 0.3;
        this.#count = config.count ?? 8;
        this.#opacity = config.opacity ?? 0.8;

        const {r, g, b} = parseColor(config.color ?? '#ffffff');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;

        if (innerWidth < 991) {
            this.#count = Math.max(3, Math.floor(this.#count / 2));
        }

        this.#sprites = this.#createSprites(r, g, b);

        for (let i = 0; i < this.#count; ++i) {
            this.#clouds.push(this.#createCloud(true));
        }
    }

    configure(config: Partial<CloudsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }

        if (config.opacity !== undefined) {
            this.#opacity = config.opacity;
        }

        if (config.color !== undefined) {
            const {r, g, b} = parseColor(config.color);
            this.#colorR = r;
            this.#colorG = g;
            this.#colorB = b;
            this.#sprites = this.#createSprites(r, g, b);
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        for (const cloud of this.#clouds) {
            const layerSpeed = this.#speed * (0.5 + cloud.layer * 0.5);
            cloud.x += layerSpeed * 0.002 * dt;

            if (cloud.x > 1.4) {
                cloud.x = -0.4;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const sortedClouds = [...this.#clouds].sort((a, b) => a.layer - b.layer);

        for (const cloud of sortedClouds) {
            const px = cloud.x * width;
            const py = cloud.y * height;
            const cloudWidth = SPRITE_SIZE * cloud.scale * this.#scale * (width / 800);
            const cloudHeight = (SPRITE_SIZE * 0.45) * cloud.scale * this.#scale * (width / 800);

            const depthAlpha = 0.4 + cloud.layer * 0.3;
            ctx.globalAlpha = this.#opacity * depthAlpha * cloud.opacity;

            ctx.drawImage(
                this.#sprites[cloud.spriteIndex],
                px - cloudWidth * 0.5,
                py - cloudHeight * 0.5,
                cloudWidth,
                cloudHeight
            );
        }

        ctx.globalAlpha = 1;
        ctx.resetTransform();
    }

    #createSprites(r: number, g: number, b: number): HTMLCanvasElement[] {
        const sprites: HTMLCanvasElement[] = [];

        for (let variant = 0; variant < SPRITE_COUNT; variant++) {
            const canvas = document.createElement('canvas');
            canvas.width = SPRITE_SIZE;
            canvas.height = Math.floor(SPRITE_SIZE * 0.5);
            const spriteCtx = canvas.getContext('2d')!;

            const blobCount = 3 + Math.floor(MULBERRY.next() * 3);
            const cx = SPRITE_SIZE * 0.5;
            const cy = SPRITE_SIZE * 0.2;

            const blobs: Array<{bx: number; by: number; br: number}> = [];

            blobs.push({bx: cx, by: cy, br: SPRITE_SIZE * (0.18 + MULBERRY.next() * 0.08)});

            for (let i = 1; i < blobCount; i++) {
                const spread = SPRITE_SIZE * 0.28;
                blobs.push({
                    bx: cx + (MULBERRY.next() - 0.5) * spread * 2,
                    by: cy + (MULBERRY.next() - 0.3) * spread * 0.5,
                    br: SPRITE_SIZE * (0.1 + MULBERRY.next() * 0.12)
                });
            }

            for (const blob of blobs) {
                const gradient = spriteCtx.createRadialGradient(
                    blob.bx, blob.by, 0,
                    blob.bx, blob.by, blob.br
                );
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
                gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.7)`);
                gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.25)`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                spriteCtx.fillStyle = gradient;
                spriteCtx.beginPath();
                spriteCtx.arc(blob.bx, blob.by, blob.br, 0, Math.PI * 2);
                spriteCtx.fill();
            }

            sprites.push(canvas);
        }

        return sprites;
    }

    #createCloud(initialSpread: boolean): Cloud {
        const layer = Math.floor(MULBERRY.next() * 3);

        return {
            x: initialSpread ? MULBERRY.next() * 1.8 - 0.4 : -0.4,
            y: 0.05 + MULBERRY.next() * 0.55,
            speed: 0.5 + MULBERRY.next() * 0.5,
            layer,
            scale: 0.6 + MULBERRY.next() * 0.8 + layer * 0.3,
            opacity: 0.6 + MULBERRY.next() * 0.4,
            spriteIndex: Math.floor(MULBERRY.next() * SPRITE_COUNT)
        };
    }
}
