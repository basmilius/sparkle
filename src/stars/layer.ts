import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { ShootingStarSystem } from '../shooting-stars';
import { MULBERRY } from './consts';
import type { Star, StarMode } from './types';

export interface StarsConfig {
    readonly mode?: StarMode;
    readonly starCount?: number;
    readonly shootingInterval?: [number, number];
    readonly shootingSpeed?: number;
    readonly twinkleSpeed?: number;
    readonly color?: string;
    readonly shootingColor?: string;
    readonly trailLength?: number;
    readonly scale?: number;
}

export class Stars extends Effect<StarsConfig> {
    readonly #mode: StarMode;
    #twinkleSpeed: number;
    readonly #colorRGB: [number, number, number];
    #scale: number;
    readonly #shootingStarSystem: ShootingStarSystem | null;
    #starCount: number;
    #time: number = 0;
    #stars: Star[] = [];

    constructor(config: StarsConfig = {}) {
        super();

        this.#mode = config.mode ?? 'both';
        this.#starCount = config.starCount ?? 150;
        this.#twinkleSpeed = config.twinkleSpeed ?? 1;
        this.#scale = config.scale ?? 1;

        this.#colorRGB = hexToRGB(config.color ?? '#ffffff');

        const shootingColorRGB = hexToRGB(config.shootingColor ?? '#ffffff');
        const enableShooting = this.#mode === 'shooting' || this.#mode === 'both';

        this.#shootingStarSystem = enableShooting
            ? new ShootingStarSystem(
                {
                    interval: config.shootingInterval ?? [120, 360],
                    color: shootingColorRGB,
                    trailLength: config.trailLength ?? 15,
                    trailAlphaFactor: 0.6,
                    speed: config.shootingSpeed ?? 1,
                    scale: this.#scale,
                    alphaMin: 0.8,
                    alphaRange: 0.2,
                    decayMin: 0.01,
                    decayRange: 0.015
                },
                () => MULBERRY.next()
            )
            : null;

        if (this.#mode === 'sky' || this.#mode === 'both') {
            for (let i = 0; i < this.#starCount; ++i) {
                this.#stars.push(this.#createStar());
            }
        }
    }

    configure(config: Partial<StarsConfig>): void {
        if (config.twinkleSpeed !== undefined) {
            this.#twinkleSpeed = config.twinkleSpeed;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.02 * dt;
        this.#shootingStarSystem?.tick(dt, width, height);
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const [sr, sg, sb] = this.#colorRGB;

        // Background stars
        if (this.#mode === 'sky' || this.#mode === 'both') {
            ctx.globalCompositeOperation = 'source-over';

            for (const star of this.#stars) {
                const px = star.x * width;
                const py = star.y * height;
                const alpha = star.brightness * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(this.#time * star.twinkleSpeed * this.#twinkleSpeed + star.twinklePhase)));
                const size = star.size * this.#scale;

                ctx.globalAlpha = alpha;

                // Star dot
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${sr}, ${sg}, ${sb})`;
                ctx.fill();

                // Cross sparkle for larger stars
                if (star.size > 1.5) {
                    const sparkleLength = size * 3;
                    const sparkleAlpha = alpha * 0.4;
                    ctx.globalAlpha = sparkleAlpha;
                    ctx.strokeStyle = `rgb(${sr}, ${sg}, ${sb})`;
                    ctx.lineWidth = 0.5;

                    ctx.beginPath();
                    ctx.moveTo(px - sparkleLength, py);
                    ctx.lineTo(px + sparkleLength, py);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(px, py - sparkleLength);
                    ctx.lineTo(px, py + sparkleLength);
                    ctx.stroke();
                }
            }
        }

        // Shooting stars
        this.#shootingStarSystem?.draw(ctx);

        ctx.globalAlpha = 1;
    }

    #createStar(): Star {
        return {
            x: MULBERRY.next(),
            y: MULBERRY.next(),
            size: 0.5 + MULBERRY.next() * 2,
            twinklePhase: MULBERRY.next() * Math.PI * 2,
            twinkleSpeed: 0.5 + MULBERRY.next() * 2,
            brightness: 0.3 + MULBERRY.next() * 0.7
        };
    }
}
