import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { ShootingStar, Star, StarMode } from './types';

export interface StarSimulationConfig {
    readonly mode?: StarMode;
    readonly starCount?: number;
    readonly shootingInterval?: [number, number];
    readonly shootingSpeed?: number;
    readonly twinkleSpeed?: number;
    readonly color?: string;
    readonly shootingColor?: string;
    readonly trailLength?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class StarSimulation extends LimitedFrameRateCanvas {
    readonly #mode: StarMode;
    readonly #twinkleSpeed: number;
    readonly #shootingSpeed: number;
    readonly #shootingInterval: [number, number];
    readonly #trailLength: number;
    readonly #colorRGB: [number, number, number];
    readonly #shootingColorRGB: [number, number, number];
    readonly #scale: number;
    #starCount: number;
    #time: number = 0;
    #shootingCooldown: number = 0;
    #stars: Star[] = [];
    #shootingStars: ShootingStar[] = [];

    constructor(canvas: HTMLCanvasElement, config: StarSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#mode = config.mode ?? 'both';
        this.#starCount = config.starCount ?? 150;
        this.#shootingInterval = config.shootingInterval ?? [120, 360];
        this.#shootingSpeed = config.shootingSpeed ?? 1;
        this.#twinkleSpeed = config.twinkleSpeed ?? 1;
        this.#trailLength = config.trailLength ?? 15;
        this.#scale = config.scale ?? 1;

        this.#colorRGB = hexToRGB(config.color ?? '#ffffff');
        this.#shootingColorRGB = hexToRGB(config.shootingColor ?? '#ffffff');

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#starCount = Math.floor(this.#starCount / 2);
        }

        if (this.#mode === 'sky' || this.#mode === 'both') {
            for (let i = 0; i < this.#starCount; ++i) {
                this.#stars.push(this.#createStar());
            }
        }

        this.#shootingCooldown = this.#shootingInterval[0] + MULBERRY.next() * (this.#shootingInterval[1] - this.#shootingInterval[0]);
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        const [sr, sg, sb] = this.#colorRGB;

        // Background stars
        if (this.#mode === 'sky' || this.#mode === 'both') {
            for (const star of this.#stars) {
                const px = star.x * this.width;
                const py = star.y * this.height;
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
        if (this.#mode === 'shooting' || this.#mode === 'both') {
            const [cr, cg, cb] = this.#shootingColorRGB;

            ctx.globalCompositeOperation = 'lighter';

            for (const shooting of this.#shootingStars) {
                // Trail (tapered)
                for (let t = 0; t < shooting.trail.length; t++) {
                    const progress = t / shooting.trail.length;
                    const trailAlpha = shooting.alpha * progress * 0.6;
                    const trailSize = shooting.size * progress * this.#scale;

                    if (trailAlpha < 0.01) {
                        continue;
                    }

                    ctx.globalAlpha = trailAlpha;
                    ctx.beginPath();
                    ctx.arc(shooting.trail[t].x, shooting.trail[t].y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
                    ctx.fill();
                }

                // Head glow
                const headSize = shooting.size * 2 * this.#scale;
                const glow = ctx.createRadialGradient(
                    shooting.x, shooting.y, 0,
                    shooting.x, shooting.y, headSize
                );
                glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${shooting.alpha})`);
                glow.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, ${shooting.alpha * 0.3})`);
                glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.arc(shooting.x, shooting.y, headSize, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';
        }

        ctx.globalAlpha = 1;
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        this.#time += 0.02 * dt;

        // Spawn shooting stars
        if (this.#mode === 'shooting' || this.#mode === 'both') {
            this.#shootingCooldown -= dt;

            if (this.#shootingCooldown <= 0) {
                this.#shootingStars.push(this.#createShootingStar());
                this.#shootingCooldown = this.#shootingInterval[0] + MULBERRY.next() * (this.#shootingInterval[1] - this.#shootingInterval[0]);
            }

            // Update shooting stars
            let alive = 0;

            for (let i = 0; i < this.#shootingStars.length; i++) {
                const shooting = this.#shootingStars[i];

                shooting.trail.push({x: shooting.x, y: shooting.y});

                if (shooting.trail.length > this.#trailLength) {
                    shooting.trail.shift();
                }

                shooting.x += shooting.vx * this.#shootingSpeed * dt;
                shooting.y += shooting.vy * this.#shootingSpeed * dt;
                shooting.alpha -= shooting.decay * dt;

                if (shooting.alpha > 0 && shooting.x > -50 && shooting.x < this.width + 50 && shooting.y < this.height + 50) {
                    this.#shootingStars[alive++] = shooting;
                }
            }

            this.#shootingStars.length = alive;
        }
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

    #createShootingStar(): ShootingStar {
        const startX = MULBERRY.next() * this.width * 0.8;
        const startY = MULBERRY.next() * this.height * 0.4;
        const angle = 0.3 + MULBERRY.next() * 0.5;
        const speed = 8 + MULBERRY.next() * 12;

        return {
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed * this.#scale,
            vy: Math.sin(angle) * speed * this.#scale,
            alpha: 0.8 + MULBERRY.next() * 0.2,
            size: 1.5 + MULBERRY.next() * 2,
            decay: 0.01 + MULBERRY.next() * 0.015,
            trail: []
        };
    }
}
