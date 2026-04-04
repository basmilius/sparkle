import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { HologramConfig, HologramFragment } from './types';

export class Hologram extends Effect<HologramConfig> {
    #scale: number;
    #speed: number;
    #scanlineSpacing: number;
    #flickerIntensity: number;
    #maxFragments: number;
    #colorRGB: [number, number, number];

    #fragments: HologramFragment[] = [];
    #time: number = 0;
    #scanOffset: number = 0;
    #scanBarY: number = -100;
    #scanBarSpeed: number = 0;
    #scanBarActive: boolean = false;
    #flickerAlpha: number = 1;
    #nextDropout: number = 0;
    #dropoutTimer: number = 0;
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: HologramConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#scanlineSpacing = (config.scanlineSpacing ?? 3) * this.#scale;
        this.#flickerIntensity = config.flickerIntensity ?? 0.3;
        this.#maxFragments = config.dataFragments ?? 15;
        this.#colorRGB = hexToRGB(config.color ?? '#00ccff');
        this.#nextDropout = 40 + MULBERRY.next() * 80;
    }

    configure(config: Partial<HologramConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.flickerIntensity !== undefined) {
            this.#flickerIntensity = config.flickerIntensity;
        }
        if (config.color !== undefined) {
            this.#colorRGB = hexToRGB(config.color);
        }
        if (config.scanlineSpacing !== undefined) {
            this.#scanlineSpacing = config.scanlineSpacing * this.#scale;
        }
        if (config.dataFragments !== undefined) {
            this.#maxFragments = config.dataFragments;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized) {
            this.#initialized = true;

            for (let index = 0; index < this.#maxFragments; ++index) {
                this.#fragments.push(this.#createFragment(width, height));
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const speedDt = dt * this.#speed;
        this.#time += speedDt * 0.01;

        // Scrolling scanlines.
        this.#scanOffset = (this.#scanOffset + speedDt * 0.05) % this.#scanlineSpacing;

        // Flicker oscillation.
        const baseFlicker = 1 - this.#flickerIntensity * 0.3;
        const oscillation = Math.sin(this.#time * 12) * 0.05 + Math.sin(this.#time * 31) * 0.03;
        this.#flickerAlpha = baseFlicker + oscillation * this.#flickerIntensity;

        // Occasional dropout.
        if (this.#dropoutTimer > 0) {
            this.#dropoutTimer -= speedDt;
            this.#flickerAlpha = 0.05 + MULBERRY.next() * 0.1;
        } else {
            this.#nextDropout -= speedDt;

            if (this.#nextDropout <= 0) {
                this.#dropoutTimer = 1 + MULBERRY.next() * 3;
                this.#nextDropout = 40 + MULBERRY.next() * 120;
            }
        }

        // Scan bar.
        if (this.#scanBarActive) {
            this.#scanBarY -= this.#scanBarSpeed * speedDt;

            if (this.#scanBarY < -20) {
                this.#scanBarActive = false;
            }
        } else if (MULBERRY.next() < 0.002 * this.#speed) {
            this.#scanBarActive = true;
            this.#scanBarY = height + 10;
            this.#scanBarSpeed = 2 + MULBERRY.next() * 4;
        }

        // Update fragments.
        for (let index = 0; index < this.#fragments.length; ++index) {
            const fragment = this.#fragments[index];
            fragment.life -= speedDt;
            fragment.y -= fragment.speed * speedDt;

            if (fragment.life <= 0 || fragment.y + fragment.height < 0) {
                this.#fragments[index] = this.#createFragment(width, height);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const [cr, cg, cb] = this.#colorRGB;
        const prevComposite = ctx.globalCompositeOperation;

        ctx.globalAlpha = this.#flickerAlpha;
        ctx.globalCompositeOperation = 'lighter';

        // Scanlines.
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.04)`;

        for (let scanY = -this.#scanOffset; scanY < height; scanY += this.#scanlineSpacing) {
            ctx.fillRect(0, scanY, width, 1);
        }

        // Data fragments.
        for (const fragment of this.#fragments) {
            const lifeRatio = fragment.life / fragment.maxLife;
            const fadeIn = Math.min(lifeRatio * 5, 1);
            const fadeOut = Math.min((1 - lifeRatio) * 5, 1);
            const alpha = fragment.opacity * Math.min(fadeIn, fadeOut);

            // Fragment background.
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.15})`;
            ctx.fillRect(fragment.x, fragment.y, fragment.width, fragment.height);

            // Fragment border.
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.3})`;
            ctx.lineWidth = this.#scale;
            ctx.strokeRect(fragment.x, fragment.y, fragment.width, fragment.height);

            // Simulated text rows (small horizontal lines).
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.4})`;
            const lineHeight = 4 * this.#scale;
            const padding = 3 * this.#scale;
            const textWidth = fragment.width - padding * 2;

            if (textWidth > 0) {
                for (let lineY = fragment.y + padding; lineY < fragment.y + fragment.height - padding; lineY += lineHeight + 2) {
                    const rowWidth = textWidth * (0.4 + MULBERRY.next() * 0.6);
                    ctx.fillRect(fragment.x + padding, lineY, rowWidth, lineHeight * 0.5);
                }
            }
        }

        // Scan bar.
        if (this.#scanBarActive) {
            const barHeight = 6 * this.#scale;
            const gradient = ctx.createLinearGradient(0, this.#scanBarY - barHeight, 0, this.#scanBarY + barHeight);
            gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0)`);
            gradient.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.2)`);
            gradient.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.4)`);
            gradient.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, 0.2)`);
            gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, this.#scanBarY - barHeight, width, barHeight * 2);
        }

        // Subtle overall vignette glow at edges.
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.02)`;
        ctx.fillRect(0, 0, width, height);

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = prevComposite;
    }

    #createFragment(width: number, height: number): HologramFragment {
        const maxLife = 30 + MULBERRY.next() * 90;
        const fragmentWidth = (20 + MULBERRY.next() * 80) * this.#scale;
        const fragmentHeight = (12 + MULBERRY.next() * 40) * this.#scale;

        return {
            x: MULBERRY.next() * (width - fragmentWidth),
            y: MULBERRY.next() * height + height * 0.1,
            width: fragmentWidth,
            height: fragmentHeight,
            opacity: 0.3 + MULBERRY.next() * 0.7,
            speed: 0.1 + MULBERRY.next() * 0.5,
            life: maxLife,
            maxLife
        };
    }
}
