import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { GlitchBlock, GlitchConfig, GlitchSlice } from './types';

const BURST_COLORS = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ff00ff',
    '#00ffff',
    '#ffff00',
    '#ffffff'
];

export class Glitch extends Effect<GlitchConfig> {
    #scale: number;
    #intensity: number;
    #speed: number;
    #rgbSplit: number;
    #scanlines: boolean;
    #noiseBlocks: boolean;
    #sliceDisplacement: boolean;
    #colorRGB: [number, number, number];

    #slices: GlitchSlice[] = [];
    #blocks: GlitchBlock[] = [];
    #time: number = 0;
    #burstTimer: number = 0;
    #burstDuration: number = 0;
    #isBursting: boolean = false;
    #nextBurstIn: number = 0;
    #width: number = 960;
    #height: number = 540;

    constructor(config: GlitchConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#intensity = config.intensity ?? 0.5;
        this.#speed = config.speed ?? 1;
        this.#rgbSplit = (config.rgbSplit ?? 3) * this.#scale;
        this.#scanlines = config.scanlines ?? true;
        this.#noiseBlocks = config.noiseBlocks ?? true;
        this.#sliceDisplacement = config.sliceDisplacement ?? true;
        this.#colorRGB = hexToRGB(config.color ?? '#00ff41');
        this.#nextBurstIn = 30 + MULBERRY.next() * 60;
    }

    configure(config: Partial<GlitchConfig>): void {
        if (config.intensity !== undefined) {
            this.#intensity = config.intensity;
        }
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.rgbSplit !== undefined) {
            this.#rgbSplit = config.rgbSplit * this.#scale;
        }
        if (config.scanlines !== undefined) {
            this.#scanlines = config.scanlines;
        }
        if (config.noiseBlocks !== undefined) {
            this.#noiseBlocks = config.noiseBlocks;
        }
        if (config.sliceDisplacement !== undefined) {
            this.#sliceDisplacement = config.sliceDisplacement;
        }
        if (config.color !== undefined) {
            this.#colorRGB = hexToRGB(config.color);
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const speedDt = dt * this.#speed;
        this.#time += speedDt;

        // Update existing slices.
        let writeIndex = 0;
        for (let index = 0; index < this.#slices.length; ++index) {
            const slice = this.#slices[index];
            slice.life -= speedDt;

            if (slice.life > 0) {
                this.#slices[writeIndex++] = slice;
            }
        }
        this.#slices.length = writeIndex;

        // Update existing blocks.
        writeIndex = 0;
        for (let index = 0; index < this.#blocks.length; ++index) {
            const block = this.#blocks[index];
            block.life -= speedDt;

            if (block.life > 0) {
                this.#blocks[writeIndex++] = block;
            }
        }
        this.#blocks.length = writeIndex;

        // Burst logic.
        if (this.#isBursting) {
            this.#burstTimer -= speedDt;

            // Spawn slices during burst.
            if (this.#sliceDisplacement && MULBERRY.next() < 0.4 * this.#intensity) {
                const sliceCount = 1 + Math.floor(MULBERRY.next() * 3 * this.#intensity);

                for (let index = 0; index < sliceCount; ++index) {
                    this.#slices.push(this.#createSlice(width, height));
                }
            }

            // Spawn noise blocks during burst.
            if (this.#noiseBlocks && MULBERRY.next() < 0.3 * this.#intensity) {
                const blockCount = 1 + Math.floor(MULBERRY.next() * 4 * this.#intensity);

                for (let index = 0; index < blockCount; ++index) {
                    this.#blocks.push(this.#createBlock(width, height));
                }
            }

            if (this.#burstTimer <= 0) {
                this.#isBursting = false;
                this.#nextBurstIn = (20 + MULBERRY.next() * 80) * (1 - this.#intensity * 0.7);
            }
        } else {
            this.#nextBurstIn -= speedDt;

            if (this.#nextBurstIn <= 0) {
                this.#isBursting = true;
                this.#burstDuration = 5 + MULBERRY.next() * 15 * this.#intensity;
                this.#burstTimer = this.#burstDuration;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const [cr, cg, cb] = this.#colorRGB;

        // Scanlines (always subtle, more visible during burst).
        if (this.#scanlines) {
            const scanlineAlpha = this.#isBursting ? 0.08 + this.#intensity * 0.07 : 0.03;
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${scanlineAlpha})`;

            const spacing = 3 * this.#scale;

            for (let scanY = 0; scanY < height; scanY += spacing) {
                ctx.fillRect(0, scanY, width, 1);
            }
        }

        // Slice displacement.
        if (this.#sliceDisplacement) {
            for (const slice of this.#slices) {
                const lifeRatio = slice.life / slice.maxLife;
                const alpha = lifeRatio * 0.3 * this.#intensity;

                // Red channel shifted left.
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.6})`;
                ctx.fillRect(slice.offset - this.#rgbSplit, slice.y, width, slice.height);

                // Blue channel shifted right.
                ctx.fillStyle = `rgba(0, 0, 255, ${alpha * 0.6})`;
                ctx.fillRect(slice.offset + this.#rgbSplit, slice.y, width, slice.height);

                // Main slice color.
                ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
                ctx.fillRect(slice.offset, slice.y, width, slice.height);
            }
        }

        // RGB split overlay during burst.
        if (this.#isBursting && this.#rgbSplit > 0) {
            const burstProgress = this.#burstTimer / this.#burstDuration;
            const splitAlpha = burstProgress * 0.04 * this.#intensity;

            ctx.fillStyle = `rgba(255, 0, 0, ${splitAlpha})`;
            ctx.fillRect(-this.#rgbSplit, 0, width + this.#rgbSplit * 2, height);

            ctx.fillStyle = `rgba(0, 0, 255, ${splitAlpha})`;
            ctx.fillRect(this.#rgbSplit, 0, width + this.#rgbSplit * 2, height);
        }

        // Noise blocks.
        if (this.#noiseBlocks) {
            for (const block of this.#blocks) {
                const lifeRatio = block.life / block.maxLife;
                const alpha = lifeRatio * 0.5 * this.#intensity;

                ctx.fillStyle = block.color;
                ctx.globalAlpha = alpha;
                ctx.fillRect(block.x, block.y, block.width, block.height);
            }
            ctx.globalAlpha = 1;
        }

        // Horizontal scan bar during burst.
        if (this.#isBursting) {
            const barY = (this.#time * 3 % (height + 20)) - 10;
            const barHeight = 2 + MULBERRY.next() * 4 * this.#scale;
            const barAlpha = 0.15 * this.#intensity;

            ctx.fillStyle = `rgba(255, 255, 255, ${barAlpha})`;
            ctx.fillRect(0, barY, width, barHeight);
        }
    }

    #createSlice(width: number, height: number): GlitchSlice {
        const maxLife = 2 + MULBERRY.next() * 6;

        return {
            y: MULBERRY.next() * height,
            height: 1 + MULBERRY.next() * 30 * this.#scale,
            offset: (MULBERRY.next() - 0.5) * width * 0.15 * this.#intensity,
            life: maxLife,
            maxLife
        };
    }

    #createBlock(width: number, height: number): GlitchBlock {
        const maxLife = 1 + MULBERRY.next() * 4;

        return {
            x: MULBERRY.next() * width,
            y: MULBERRY.next() * height,
            width: 5 + MULBERRY.next() * 60 * this.#scale,
            height: 2 + MULBERRY.next() * 20 * this.#scale,
            life: maxLife,
            maxLife,
            color: BURST_COLORS[Math.floor(MULBERRY.next() * BURST_COLORS.length)]
        };
    }
}
