import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { Lightning, Raindrop, RainVariant, Splash } from './types';

export interface RainSimulationConfig {
    readonly variant?: RainVariant;
    readonly drops?: number;
    readonly wind?: number;
    readonly speed?: number;
    readonly splashes?: boolean;
    readonly lightning?: boolean;
    readonly color?: string;
    readonly groundLevel?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const VARIANT_PRESETS: Record<RainVariant, {drops: number; speed: number; wind: number; splashes: boolean; lightning: boolean}> = {
    drizzle: {drops: 70, speed: 0.55, wind: 0.1, splashes: false, lightning: false},
    downpour: {drops: 200, speed: 0.85, wind: 0.25, splashes: true, lightning: false},
    thunderstorm: {drops: 300, speed: 1, wind: 0.4, splashes: true, lightning: true}
};

export class RainSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #speed: number;
    readonly #wind: number;
    readonly #groundLevel: number;
    readonly #enableSplashes: boolean;
    readonly #enableLightning: boolean;
    readonly #colorR: number;
    readonly #colorG: number;
    readonly #colorB: number;
    #maxDrops: number;
    #drops: Raindrop[] = [];
    #splashes: Splash[] = [];
    #lightning: Lightning | null = null;
    #flashAlpha: number = 0;
    #lightningCooldown: number = 0;

    constructor(canvas: HTMLCanvasElement, config: RainSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        const variant = config.variant ?? 'downpour';
        const preset = VARIANT_PRESETS[variant];

        this.#scale = config.scale ?? 1;
        this.#maxDrops = config.drops ?? preset.drops;
        this.#speed = (config.speed ?? preset.speed);
        this.#wind = config.wind ?? preset.wind;
        this.#groundLevel = config.groundLevel ?? 1.0;
        this.#enableSplashes = config.splashes ?? preset.splashes;
        this.#enableLightning = config.lightning ?? preset.lightning;

        const {r, g, b} = this.#parseColor(config.color ?? 'rgba(174, 194, 224, 0.6)');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxDrops = Math.floor(this.#maxDrops / 2);
        }

        for (let i = 0; i < this.#maxDrops; ++i) {
            this.#drops.push(this.#createDrop(true));
        }

        this.#lightningCooldown = 180 + MULBERRY.next() * 300;
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        // Flash overlay
        if (this.#flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.#flashAlpha})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // Raindrops
        ctx.lineCap = 'round';
        for (const drop of this.#drops) {
            const px = drop.x * this.width;
            const py = drop.y * this.height;
            const lineWidth = (0.4 + drop.depth * 1) * this.#scale;

            // Draw line along velocity direction
            const speed = Math.sqrt(drop.vx * drop.vx + drop.vy * drop.vy);
            const nx = speed > 0 ? drop.vx / speed : 0;
            const ny = speed > 0 ? drop.vy / speed : -1;
            const tailLength = drop.length * drop.depth;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - nx * tailLength, py - ny * tailLength);
            ctx.strokeStyle = `rgba(${this.#colorR}, ${this.#colorG}, ${this.#colorB}, ${drop.opacity * drop.depth})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }

        // Splashes
        for (const splash of this.#splashes) {
            const px = splash.x * this.width;
            const py = splash.y * this.height;

            ctx.beginPath();
            ctx.arc(px, py, splash.size * this.#scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.#colorR}, ${this.#colorG}, ${this.#colorB}, ${splash.alpha})`;
            ctx.fill();
        }

        // Lightning
        if (this.#lightning && this.#lightning.alpha > 0) {
            const segments = this.#lightning.segments;

            ctx.globalCompositeOperation = 'lighter';

            // Outer glow
            ctx.beginPath();
            ctx.moveTo(segments[0].x * this.width, segments[0].y * this.height);
            for (let i = 1; i < segments.length; i++) {
                ctx.lineTo(segments[i].x * this.width, segments[i].y * this.height);
            }
            ctx.strokeStyle = `rgba(180, 200, 255, ${this.#lightning.alpha * 0.4})`;
            ctx.lineWidth = 6 * this.#scale;
            ctx.stroke();

            // Inner bright line
            ctx.beginPath();
            ctx.moveTo(segments[0].x * this.width, segments[0].y * this.height);
            for (let i = 1; i < segments.length; i++) {
                ctx.lineTo(segments[i].x * this.width, segments[i].y * this.height);
            }
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.#lightning.alpha})`;
            ctx.lineWidth = 2 * this.#scale;
            ctx.stroke();

            ctx.globalCompositeOperation = 'source-over';
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        // Update raindrops
        let aliveDrops = 0;

        for (let i = 0; i < this.#drops.length; i++) {
            const drop = this.#drops[i];

            drop.x += (drop.vx * dt) / this.width;
            drop.y += (drop.vy * dt) / this.height;

            if (drop.y >= this.#groundLevel) {
                if (this.#enableSplashes) {
                    this.#createSplashBurst(drop.x, this.#groundLevel);
                }

                this.#drops[aliveDrops++] = this.#createDrop(false);
            } else {
                this.#drops[aliveDrops++] = drop;
            }
        }

        this.#drops.length = aliveDrops;

        // Refill drops
        while (this.#drops.length < this.#maxDrops) {
            this.#drops.push(this.#createDrop(false));
        }

        // Update splashes
        let aliveSplashes = 0;

        for (let i = 0; i < this.#splashes.length; i++) {
            const splash = this.#splashes[i];

            splash.x += (splash.vx * dt) / this.width;
            splash.y += (splash.vy * dt) / this.height;
            splash.vy += splash.gravity * dt;
            splash.alpha -= 0.04 * dt;

            if (splash.alpha > 0) {
                this.#splashes[aliveSplashes++] = splash;
            }
        }

        this.#splashes.length = aliveSplashes;

        // Lightning
        if (this.#enableLightning) {
            this.#lightningCooldown -= dt;

            if (this.#lightningCooldown <= 0) {
                this.#lightning = this.#createLightning();
                this.#flashAlpha = 0.3;
                this.#lightningCooldown = 180 + MULBERRY.next() * 300;
            }

            if (this.#lightning) {
                this.#lightning.ticksAlive += dt;
                this.#lightning.alpha = Math.max(0, 1 - this.#lightning.ticksAlive / this.#lightning.lifetime);

                if (this.#lightning.alpha <= 0) {
                    this.#lightning = null;
                }
            }

            if (this.#flashAlpha > 0) {
                this.#flashAlpha -= 0.05 * dt;

                if (this.#flashAlpha < 0) {
                    this.#flashAlpha = 0;
                }
            }
        }
    }

    #parseColor(color: string): {r: number; g: number; b: number} {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return {r: data[0], g: data[1], b: data[2]};
    }

    #createDrop(initialSpread: boolean): Raindrop {
        const depth = 0.3 + MULBERRY.next() * 0.7;
        const fallSpeed = (3.5 + MULBERRY.next() * 5) * depth * this.#speed;

        return {
            x: MULBERRY.next(),
            y: initialSpread ? MULBERRY.next() * this.#groundLevel : -MULBERRY.next() * 0.1,
            vx: this.#wind * fallSpeed * 0.6,
            vy: fallSpeed,
            length: (8 + MULBERRY.next() * 15) * this.#scale,
            speed: fallSpeed,
            depth,
            opacity: 0.3 + MULBERRY.next() * 0.4
        };
    }

    #createSplashBurst(x: number, y: number): void {
        const count = 2 + Math.floor(MULBERRY.next() * 2);

        for (let i = 0; i < count; i++) {
            this.#splashes.push({
                x,
                y,
                vx: (MULBERRY.next() - 0.5) * 2,
                vy: -(1 + MULBERRY.next() * 2),
                alpha: 0.5 + MULBERRY.next() * 0.3,
                size: 1 + MULBERRY.next() * 2,
                gravity: 0.15
            });
        }
    }

    #createLightning(): Lightning {
        const startX = 0.2 + MULBERRY.next() * 0.6;
        const segments: {x: number; y: number}[] = [{x: startX, y: 0}];

        let currentX = startX;
        let currentY = 0;
        const steps = 8 + Math.floor(MULBERRY.next() * 8);

        for (let i = 0; i < steps; i++) {
            currentX += (MULBERRY.next() - 0.5) * 0.08;
            currentY += (0.6 + MULBERRY.next() * 0.4) / steps;
            segments.push({x: currentX, y: Math.min(currentY, this.#groundLevel)});

            if (currentY >= this.#groundLevel) {
                break;
            }
        }

        return {
            segments,
            alpha: 1,
            lifetime: 8,
            ticksAlive: 0
        };
    }
}
