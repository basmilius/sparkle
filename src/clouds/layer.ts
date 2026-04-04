import { parseColor } from '../color';
import { Effect } from '../effect';
import { BLOB_LAYOUTS, DEFAULT_CONFIG, FADE_MARGIN, MULBERRY, SPRITE_COUNT, SPRITE_H, SPRITE_W } from './consts';
import type { Cloud } from './types';

export interface CloudsConfig {
    readonly color?: string;
    readonly count?: number;
    readonly opacity?: number;
    readonly scale?: number;
    readonly speed?: number;
}

export class Clouds extends Effect<CloudsConfig> {
    readonly #scale: number;
    readonly #colorStr: string;
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

        const merged = { ...DEFAULT_CONFIG, ...config };
        this.#scale = merged.scale;
        this.#speed = merged.speed;
        this.#count = merged.count;
        this.#opacity = merged.opacity;
        this.#colorStr = merged.color;
    }

    configure(config: Partial<CloudsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }

        if (config.opacity !== undefined) {
            this.#opacity = config.opacity;
        }

        if (config.count !== undefined) {
            this.#count = config.count;
        }

        if (config.color !== undefined) {
            const { r, g, b } = parseColor(config.color);
            this.#colorR = r;
            this.#colorG = g;
            this.#colorB = b;
            this.#sprites = this.#createSprites(r, g, b);
        }
    }

    onMount(_canvas: HTMLCanvasElement): void {
        const { r, g, b } = parseColor(this.#colorStr);
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;
        this.#sprites = this.#createSprites(r, g, b);
    }

    onResize(width: number, _height: number): void {
        if (!this.#sprites.length) {
            return;
        }

        const effectiveCount = width < 991
            ? Math.max(3, Math.floor(this.#count / 2))
            : this.#count;

        if (this.#clouds.length === 0) {
            for (let i = 0; i < effectiveCount; ++i) {
                this.#clouds.push(this.#createCloud(true));
            }
        } else if (this.#clouds.length !== effectiveCount) {
            this.#clouds = this.#clouds.slice(0, effectiveCount);

            while (this.#clouds.length < effectiveCount) {
                this.#clouds.push(this.#createCloud(true));
            }
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
        if (!this.#sprites.length || !this.#clouds.length) {
            return;
        }

        const sortedClouds = [...this.#clouds].sort((a, b) => a.layer - b.layer);

        for (const cloud of sortedClouds) {
            const edgeFade = this.#computeEdgeFade(cloud.x);

            if (edgeFade <= 0) {
                continue;
            }

            const px = cloud.x * width;
            const py = cloud.y * height;
            const cloudWidth = SPRITE_W * cloud.scale * this.#scale * (width / 800);
            const cloudHeight = SPRITE_H * cloud.scale * this.#scale * (width / 800);
            const depthAlpha = 0.4 + cloud.layer * 0.3;

            ctx.globalAlpha = this.#opacity * depthAlpha * cloud.opacity * edgeFade;
            ctx.drawImage(
                this.#sprites[cloud.spriteIndex],
                px - cloudWidth * 0.5,
                py - cloudHeight * 0.5,
                cloudWidth,
                cloudHeight
            );
        }

        ctx.globalAlpha = 1;
    }

    #computeEdgeFade(x: number): number {
        const span = 0.4 + FADE_MARGIN;

        if (x < FADE_MARGIN) {
            return Math.max(0, (x + 0.4) / span);
        }

        if (x > 1 - FADE_MARGIN) {
            return Math.max(0, (1.4 - x) / span);
        }

        return 1;
    }

    #createSprites(r: number, g: number, b: number): HTMLCanvasElement[] {
        const sprites: HTMLCanvasElement[] = [];

        for (let variant = 0; variant < SPRITE_COUNT; variant++) {
            const canvas = document.createElement('canvas');
            canvas.width = SPRITE_W;
            canvas.height = SPRITE_H;

            const spriteCtx = canvas.getContext('2d')!;
            const cx = SPRITE_W * 0.5;
            const cy = SPRITE_H * 0.5;
            const layout = BLOB_LAYOUTS[variant];

            for (const [dx, dy, radiusFactor] of layout) {
                const bx = cx + dx * SPRITE_W;
                const by = cy + dy * SPRITE_W;
                const br = radiusFactor * SPRITE_W;

                const gradient = spriteCtx.createRadialGradient(bx, by, 0, bx, by, br);
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.92)`);
                gradient.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 0.75)`);
                gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.30)`);
                gradient.addColorStop(0.80, `rgba(${r}, ${g}, ${b}, 0.07)`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.00)`);

                spriteCtx.fillStyle = gradient;
                spriteCtx.beginPath();
                spriteCtx.arc(bx, by, br, 0, Math.PI * 2);
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
            y: 0.08 + MULBERRY.next() * 0.50,
            speed: 0.5 + MULBERRY.next() * 0.5,
            layer,
            scale: 0.7 + MULBERRY.next() * 0.8 + layer * 0.25,
            opacity: 0.65 + MULBERRY.next() * 0.35,
            spriteIndex: Math.floor(MULBERRY.next() * SPRITE_COUNT)
        };
    }
}
