import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { ConstellationStar } from './types';

export interface ConstellationConfig {
    readonly stars?: number;
    readonly speed?: number;
    readonly connectionDistance?: number;
    readonly color?: string;
    readonly lineWidth?: number;
    readonly twinkleSpeed?: number;
    readonly scale?: number;
}

const DEFAULT_STARS = 50;
const DEFAULT_CONNECTION_DISTANCE = 120;
const DEFAULT_LINE_WIDTH = 0.5;
const TWO_PI = Math.PI * 2;
const SPRITE_SIZE = 64;
const SPRITE_CENTER = SPRITE_SIZE / 2;
const SPRITE_RADIUS = SPRITE_SIZE / 2;

export class Constellation extends Effect<ConstellationConfig> {
    readonly #scale: number;
    readonly #r: number;
    readonly #g: number;
    readonly #b: number;
    readonly #lineWidth: number;
    readonly #maxStars: number;
    #speed: number;
    #twinkleSpeed: number;
    #connectionDistance: number;
    #time: number = 0;
    #stars: ConstellationStar[] = [];
    #sprite: HTMLCanvasElement;
    #width: number = 0;
    #height: number = 0;

    constructor(config: ConstellationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxStars = config.stars ?? DEFAULT_STARS;
        this.#speed = config.speed ?? 1;
        this.#connectionDistance = (config.connectionDistance ?? DEFAULT_CONNECTION_DISTANCE) * this.#scale;
        this.#lineWidth = (config.lineWidth ?? DEFAULT_LINE_WIDTH) * this.#scale;
        this.#twinkleSpeed = config.twinkleSpeed ?? 1;

        const [r, g, b] = hexToRGB(config.color ?? '#ffffff');
        this.#r = r;
        this.#g = g;
        this.#b = b;

        this.#sprite = this.#createSprite(r, g, b);
    }

    configure(config: Partial<ConstellationConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.twinkleSpeed !== undefined) {
            this.#twinkleSpeed = config.twinkleSpeed;
        }
        if (config.connectionDistance !== undefined) {
            this.#connectionDistance = config.connectionDistance * this.#scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (this.#stars.length === 0) {
            for (let index = 0; index < this.#maxStars; index++) {
                this.#stars.push(this.#createStar(width, height, true));
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const dtSeconds = dt / 1000 * this.#speed;
        this.#time += dtSeconds;

        for (const star of this.#stars) {
            // Twinkle: oscillate brightness.
            const twinkle = 0.5 + 0.5 * Math.sin(this.#time * star.twinkleSpeed * this.#twinkleSpeed + star.phase);
            star.targetBrightness = twinkle;

            // Smooth brightness transition (fade-in effect).
            star.brightness += (star.targetBrightness - star.brightness) * Math.min(1, dtSeconds * 3);

            // Drift slowly.
            star.x += star.vx * dtSeconds;
            star.y += star.vy * dtSeconds;

            // Recycle stars that drift off-screen.
            if (star.x < -10 || star.x > width + 10 || star.y < -10 || star.y > height + 10) {
                this.#recycleStar(star, width, height);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        const connectionDist = this.#connectionDistance;
        const connectionDistSq = connectionDist * connectionDist;
        const stars = this.#stars;
        const starCount = stars.length;
        const r = this.#r;
        const g = this.#g;
        const b = this.#b;

        // Draw connection lines.
        ctx.lineWidth = this.#lineWidth;

        for (let index = 0; index < starCount; index++) {
            const starA = stars[index];

            if (starA.brightness < 0.05) {
                continue;
            }

            for (let jndex = index + 1; jndex < starCount; jndex++) {
                const starB = stars[jndex];

                if (starB.brightness < 0.05) {
                    continue;
                }

                const dx = starA.x - starB.x;
                const dy = starA.y - starB.y;
                const distSq = dx * dx + dy * dy;

                if (distSq > connectionDistSq) {
                    continue;
                }

                const dist = Math.sqrt(distSq);
                const opacity = Math.min(starA.brightness, starB.brightness) * (1 - dist / connectionDist);

                if (opacity < 0.01) {
                    continue;
                }

                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`;
                ctx.beginPath();
                ctx.moveTo(starA.x, starA.y);
                ctx.lineTo(starB.x, starB.y);
                ctx.stroke();
            }
        }

        // Draw star sprites.
        for (const star of stars) {
            if (star.brightness < 0.02) {
                continue;
            }

            const displaySize = star.size * 2;

            ctx.globalAlpha = star.brightness;
            ctx.drawImage(
                this.#sprite,
                star.x - star.size,
                star.y - star.size,
                displaySize,
                displaySize
            );
        }

        ctx.globalAlpha = 1;
    }

    #createSprite(r: number, g: number, b: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = SPRITE_SIZE;
        canvas.height = SPRITE_SIZE;
        const ctx = canvas.getContext('2d')!;

        const gradient = ctx.createRadialGradient(
            SPRITE_CENTER, SPRITE_CENTER, 0,
            SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS
        );

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
        gradient.addColorStop(0.1, `rgba(${r}, ${g}, ${b}, 0.7)`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.2)`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.05)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS, 0, TWO_PI);
        ctx.fill();

        return canvas;
    }

    #createStar(width: number, height: number, initialSpread: boolean): ConstellationStar {
        const driftSpeed = 2 + MULBERRY.next() * 4;
        const driftAngle = MULBERRY.next() * TWO_PI;

        return {
            x: initialSpread ? MULBERRY.next() * width : -10,
            y: initialSpread ? MULBERRY.next() * height : -10,
            size: (1.5 + MULBERRY.next() * 3) * this.#scale,
            brightness: initialSpread ? MULBERRY.next() : 0,
            targetBrightness: 0,
            phase: MULBERRY.next() * TWO_PI,
            twinkleSpeed: 0.5 + MULBERRY.next() * 2,
            vx: Math.cos(driftAngle) * driftSpeed,
            vy: Math.sin(driftAngle) * driftSpeed
        };
    }

    #recycleStar(star: ConstellationStar, width: number, height: number): void {
        const edge = Math.floor(MULBERRY.next() * 4);
        const driftSpeed = 2 + MULBERRY.next() * 4;

        switch (edge) {
            case 0: // Top edge.
                star.x = MULBERRY.next() * width;
                star.y = -5;
                star.vx = (MULBERRY.next() - 0.5) * driftSpeed;
                star.vy = Math.abs(MULBERRY.next() * driftSpeed) + 0.5;
                break;
            case 1: // Right edge.
                star.x = width + 5;
                star.y = MULBERRY.next() * height;
                star.vx = -(Math.abs(MULBERRY.next() * driftSpeed) + 0.5);
                star.vy = (MULBERRY.next() - 0.5) * driftSpeed;
                break;
            case 2: // Bottom edge.
                star.x = MULBERRY.next() * width;
                star.y = height + 5;
                star.vx = (MULBERRY.next() - 0.5) * driftSpeed;
                star.vy = -(Math.abs(MULBERRY.next() * driftSpeed) + 0.5);
                break;
            default: // Left edge.
                star.x = -5;
                star.y = MULBERRY.next() * height;
                star.vx = Math.abs(MULBERRY.next() * driftSpeed) + 0.5;
                star.vy = (MULBERRY.next() - 0.5) * driftSpeed;
                break;
        }

        star.size = (1.5 + MULBERRY.next() * 3) * this.#scale;
        star.brightness = 0;
        star.targetBrightness = 0;
        star.phase = MULBERRY.next() * TWO_PI;
        star.twinkleSpeed = 0.5 + MULBERRY.next() * 2;
    }
}
