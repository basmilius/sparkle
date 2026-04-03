import { parseColor } from '../color';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { Raindrop, RainVariant, Splash } from './types';

export interface RainConfig {
    readonly variant?: RainVariant;
    readonly drops?: number;
    readonly wind?: number;
    readonly speed?: number;
    readonly splashes?: boolean;
    readonly color?: string;
    readonly groundLevel?: number;
    readonly scale?: number;
}

const VARIANT_PRESETS: Record<RainVariant, { drops: number; speed: number; wind: number; splashes: boolean }> = {
    drizzle: {drops: 70, speed: 0.55, wind: 0.1, splashes: false},
    downpour: {drops: 200, speed: 0.85, wind: 0.25, splashes: true},
    thunderstorm: {drops: 300, speed: 1, wind: 0.4, splashes: true}
};

export class Rain extends Effect<RainConfig> {
    readonly #scale: number;
    #speed: number;
    #wind: number;
    readonly #groundLevel: number;
    #enableSplashes: boolean;
    readonly #colorR: number;
    readonly #colorG: number;
    readonly #colorB: number;
    #maxDrops: number;
    #drops: Raindrop[] = [];
    #splashes: Splash[] = [];

    constructor(config: RainConfig = {}) {
        super();

        const variant = config.variant ?? 'downpour';
        const preset = VARIANT_PRESETS[variant];

        this.#scale = config.scale ?? 1;
        this.#maxDrops = config.drops ?? preset.drops;
        this.#speed = config.speed ?? preset.speed;
        this.#wind = config.wind ?? preset.wind;
        this.#groundLevel = config.groundLevel ?? 1.0;
        this.#enableSplashes = config.splashes ?? preset.splashes;

        const {r, g, b} = parseColor(config.color ?? 'rgba(174, 194, 224, 0.6)');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;

        if (innerWidth < 991) {
            this.#maxDrops = Math.floor(this.#maxDrops / 2);
        }

        for (let i = 0; i < this.#maxDrops; ++i) {
            this.#drops.push(this.#createDrop(true));
        }
    }

    configure(config: Partial<RainConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.wind !== undefined) {
            this.#wind = config.wind;
        }
        if (config.splashes !== undefined) {
            this.#enableSplashes = config.splashes;
        }
    }

    tick(dt: number, width: number, height: number): void {
        // Update raindrops
        let aliveDrops = 0;

        for (let i = 0; i < this.#drops.length; i++) {
            const drop = this.#drops[i];

            drop.x += (drop.vx * dt) / width;
            drop.y += (drop.vy * dt) / height;

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

            splash.x += (splash.vx * dt) / width;
            splash.y += (splash.vy * dt) / height;
            splash.vy += splash.gravity * dt;
            splash.alpha -= 0.04 * dt;

            if (splash.alpha > 0) {
                this.#splashes[aliveSplashes++] = splash;
            }
        }

        this.#splashes.length = aliveSplashes;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        // Raindrops
        ctx.lineCap = 'round';
        for (const drop of this.#drops) {
            const px = drop.x * width;
            const py = drop.y * height;
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
            const px = splash.x * width;
            const py = splash.y * height;

            ctx.beginPath();
            ctx.arc(px, py, splash.size * this.#scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.#colorR}, ${this.#colorG}, ${this.#colorB}, ${splash.alpha})`;
            ctx.fill();
        }
    }

    #createDrop(initialSpread: boolean): Raindrop {
        const depth = 0.3 + MULBERRY.next() * 0.7;
        const fallSpeed = (3.5 + MULBERRY.next() * 5) * depth * this.#speed;

        // Extend spawn range upstream of wind direction so the windward edge stays covered.
        // Drops blowing right need to also spawn left of the canvas (negative x), and vice versa.
        const windOffset = Math.abs(this.#wind) * 0.5;
        const xMin = this.#wind > 0 ? -windOffset : 0;
        const xMax = this.#wind < 0 ? 1 + windOffset : 1;

        return {
            x: xMin + MULBERRY.next() * (xMax - xMin),
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

}
