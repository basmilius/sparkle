import { isSmallScreen } from '../mobile';
import { parseColor } from '../color';
import { createGlowSprite } from '../sprite';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { Snowflake } from './snowflake';

export interface SnowConfig {
    readonly fillStyle?: string;
    readonly particles?: number;
    readonly scale?: number;
    readonly size?: number;
    readonly speed?: number;
}

const SPRITE_SIZE = 64;
const SPRITE_CENTER = SPRITE_SIZE / 2;
const SPRITE_RADIUS = SPRITE_SIZE / 2;

export class Snow extends Effect<SnowConfig> {
    #scale: number;
    readonly #size: number;
    #speed: number;
    readonly #baseOpacity: number;
    #maxParticles: number;
    #time: number = 0;
    #snowflakes: Snowflake[] = [];
    #sprites: HTMLCanvasElement[] = [];

    constructor(config: SnowConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxParticles = config.particles ?? 200;
        this.#size = (config.size ?? 9) * this.#scale;
        this.#speed = config.speed ?? 1;

        const {r, g, b, a} = parseColor(config.fillStyle ?? 'rgb(255 255 255 / .75)');
        this.#baseOpacity = a;

        if (isSmallScreen()) {
            this.#maxParticles = Math.floor(this.#maxParticles / 2);
        }

        this.#sprites = this.#createSprites(r, g, b);

        for (let i = 0; i < this.#maxParticles; ++i) {
            this.#snowflakes.push(this.#createSnowflake(true));
        }
    }

    configure(config: Partial<SnowConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.fillStyle !== undefined) {
            const {r, g, b} = parseColor(config.fillStyle);
            this.#sprites = this.#createSprites(r, g, b);
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, _width: number, height: number): void {
        const speedFactor = height / 420 / this.#speed;

        this.#time += 0.015 * speedFactor * dt;

        const wind = Math.sin(this.#time * 0.7) * 0.5
            + Math.sin(this.#time * 1.9 + 3) * 0.25
            + Math.sin(this.#time * 4.3 + 1) * 0.1;

        for (let index = 0; index < this.#snowflakes.length; index++) {
            const snowflake = this.#snowflakes[index];

            const swing = Math.sin(this.#time * snowflake.swingFrequency + snowflake.swingOffset) * snowflake.swingAmplitude;

            snowflake.x += (swing + wind * snowflake.depth * 2) * dt / (4000 * speedFactor);
            snowflake.y += (snowflake.fallSpeed * 2 + snowflake.depth + snowflake.radius * 0.15) * dt / (700 * speedFactor);

            snowflake.rotation += snowflake.rotationSpeed * dt / speedFactor;

            if (snowflake.x > 1.15 || snowflake.x < -0.15 || snowflake.y > 1.05) {
                const recycled = this.#createSnowflake(false);

                if (index % 3 > 0) {
                    recycled.x = MULBERRY.next();
                    recycled.y = -0.05 - MULBERRY.next() * 0.15;
                } else if (wind > 0.2) {
                    recycled.x = -0.15;
                    recycled.y = MULBERRY.next() * 0.8;
                } else if (wind < -0.2) {
                    recycled.x = 1.15;
                    recycled.y = MULBERRY.next() * 0.8;
                } else {
                    recycled.x = MULBERRY.next();
                    recycled.y = -0.05 - MULBERRY.next() * 0.15;
                }

                this.#snowflakes[index] = recycled;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const base = ctx.getTransform();

        for (const snowflake of this.#snowflakes) {
            const px = snowflake.x * width;
            const py = snowflake.y * height;
            const displayRadius = snowflake.radius * snowflake.depth;
            const displaySize = displayRadius * 2;

            if (displaySize < 0.5) {
                continue;
            }

            ctx.globalAlpha = this.#baseOpacity * (0.15 + snowflake.depth * 0.85);

            if (snowflake.spriteIndex === 3) {
                const cos = Math.cos(snowflake.rotation);
                const sin = Math.sin(snowflake.rotation);
                ctx.setTransform(
                    base.a * cos + base.c * sin,
                    base.b * cos + base.d * sin,
                    base.a * -sin + base.c * cos,
                    base.b * -sin + base.d * cos,
                    base.a * px + base.c * py + base.e,
                    base.b * px + base.d * py + base.f
                );
                ctx.drawImage(
                    this.#sprites[snowflake.spriteIndex],
                    -displayRadius,
                    -displayRadius,
                    displaySize,
                    displaySize
                );
                ctx.setTransform(base);
            } else {
                ctx.drawImage(
                    this.#sprites[snowflake.spriteIndex],
                    px - displayRadius,
                    py - displayRadius,
                    displaySize,
                    displaySize
                );
            }
        }

        ctx.globalAlpha = 1;
    }

    #createSprites(r: number, g: number, b: number): HTMLCanvasElement[] {
        const profiles: [number, number][][] = [
            [[0, 0.8], [0.3, 0.4], [0.7, 0.1], [1, 0]],
            [[0, 1], [0.15, 0.7], [0.5, 0.2], [1, 0]],
            [[0, 0.9], [0.25, 0.5], [0.5, 0.1], [1, 0]]
        ];

        const sprites = profiles.map(stops => createGlowSprite(r, g, b, SPRITE_SIZE, stops));
        sprites.push(this.#createCrystalSprite(r, g, b));

        return sprites;
    }

    #createCrystalSprite(r: number, g: number, b: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = SPRITE_SIZE;
        canvas.height = SPRITE_SIZE;
        const ctx = canvas.getContext('2d')!;

        const glow = ctx.createRadialGradient(
            SPRITE_CENTER, SPRITE_CENTER, 0,
            SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS
        );
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`);
        glow.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 0.25)`);
        glow.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.05)`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        const armLength = SPRITE_RADIUS * 0.75;

        for (let arm = 0; arm < 6; arm++) {
            const angle = (arm / 6) * Math.PI * 2 - Math.PI / 2;
            const tipX = SPRITE_CENTER + Math.cos(angle) * armLength;
            const tipY = SPRITE_CENTER + Math.sin(angle) * armLength;

            ctx.beginPath();
            ctx.moveTo(SPRITE_CENTER, SPRITE_CENTER);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();

            for (const position of [0.4, 0.65]) {
                const branchX = SPRITE_CENTER + Math.cos(angle) * armLength * position;
                const branchY = SPRITE_CENTER + Math.sin(angle) * armLength * position;
                const branchLength = armLength * (0.4 - position * 0.3);

                for (const side of [-1, 1]) {
                    const branchAngle = angle + side * Math.PI / 3;
                    ctx.beginPath();
                    ctx.moveTo(branchX, branchY);
                    ctx.lineTo(
                        branchX + Math.cos(branchAngle) * branchLength,
                        branchY + Math.sin(branchAngle) * branchLength
                    );
                    ctx.stroke();
                }
            }
        }

        const centerGlow = ctx.createRadialGradient(
            SPRITE_CENTER, SPRITE_CENTER, 0,
            SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS * 0.12
        );
        centerGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
        centerGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = centerGlow;
        ctx.beginPath();
        ctx.arc(SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS * 0.12, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    #createSnowflake(initialSpread: boolean): Snowflake {
        const depth = 0.3 + MULBERRY.next() * 0.7;
        const radius = MULBERRY.next() * this.#size + 2 * this.#scale;

        let spriteIndex: number;
        if (depth > 0.85 && radius > this.#size * 0.6 && MULBERRY.next() > 0.65) {
            spriteIndex = 3;
        } else if (depth < 0.45) {
            spriteIndex = 2;
        } else {
            spriteIndex = MULBERRY.next() > 0.5 ? 0 : 1;
        }

        return {
            x: MULBERRY.next(),
            y: initialSpread ? MULBERRY.next() * 2 - 1 : -0.05 - MULBERRY.next() * 0.15,
            depth,
            radius,
            rotation: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.03,
            swingAmplitude: 0.3 + MULBERRY.next() * 0.7,
            swingFrequency: 0.5 + MULBERRY.next() * 1.5,
            swingOffset: MULBERRY.next() * Math.PI * 2,
            fallSpeed: 0.5 + MULBERRY.next() * 0.5,
            spriteIndex
        };
    }
}
