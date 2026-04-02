import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { Snowflake } from './snowflake';

export interface SnowSimulationConfig {
    readonly fillStyle?: string;
    readonly particles?: number;
    readonly scale?: number;
    readonly size?: number;
    readonly speed?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const SPRITE_SIZE = 64;
const SPRITE_CENTER = SPRITE_SIZE / 2;
const SPRITE_RADIUS = SPRITE_SIZE / 2;

export class SnowSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #size: number;
    readonly #speed: number;
    readonly #baseOpacity: number;
    #maxParticles: number;
    #time: number = 0;
    #ratio: number = 1;
    #snowflakes: Snowflake[] = [];
    #sprites: HTMLCanvasElement[] = [];

    constructor(canvas: HTMLCanvasElement, config: SnowSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#maxParticles = config.particles ?? 200;
        this.#size = (config.size ?? 9) * this.#scale;
        this.#speed = config.speed ?? 2;

        const {r, g, b, a} = this.#parseColor(config.fillStyle ?? 'rgb(255 255 255 / .75)');
        this.#baseOpacity = a;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxParticles = Math.floor(this.#maxParticles / 2);
        }

        this.#sprites = this.#createSprites(r, g, b);

        for (let i = 0; i < this.#maxParticles; ++i) {
            this.#snowflakes.push(this.#createSnowflake(true));
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        for (const snowflake of this.#snowflakes) {
            const px = snowflake.x * this.width;
            const py = snowflake.y * this.height;
            const displayRadius = snowflake.radius * snowflake.depth * this.#ratio;
            const displaySize = displayRadius * 2;

            if (displaySize < 0.5) {
                continue;
            }

            ctx.globalAlpha = this.#baseOpacity * (0.15 + snowflake.depth * 0.85);

            if (snowflake.spriteIndex === 3) {
                ctx.save();
                ctx.translate(px, py);
                ctx.rotate(snowflake.rotation);
                ctx.drawImage(
                    this.#sprites[snowflake.spriteIndex],
                    -displayRadius,
                    -displayRadius,
                    displaySize,
                    displaySize
                );
                ctx.restore();
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

    tick(): void {
        const speedFactor = (this.height / (420 * this.#ratio) / this.#speed) * this.deltaFactor;

        this.#time += 0.015 * speedFactor;

        // Multi-frequency wind for organic movement
        const wind = Math.sin(this.#time * 0.7) * 0.5
                   + Math.sin(this.#time * 1.9 + 3) * 0.25
                   + Math.sin(this.#time * 4.3 + 1) * 0.1;

        for (let index = 0; index < this.#snowflakes.length; index++) {
            const snowflake = this.#snowflakes[index];

            // Individual swing oscillation
            const swing = Math.sin(this.#time * snowflake.swingFrequency + snowflake.swingOffset) * snowflake.swingAmplitude;

            // Horizontal: personal swing + global wind (deeper = more wind influence)
            snowflake.x += (swing + wind * snowflake.depth * 2) / (4000 * speedFactor);

            // Vertical: individual speed + depth + size influence
            snowflake.y += (snowflake.fallSpeed * 2 + snowflake.depth + snowflake.radius * 0.15) / (700 * speedFactor);

            // Rotation (only visually relevant for crystal sprites)
            snowflake.rotation += snowflake.rotationSpeed / speedFactor;

            // Recycle out-of-bounds particles
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

    #parseColor(fillStyle: string): {r: number; g: number; b: number; a: number} {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = fillStyle;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return {r: data[0], g: data[1], b: data[2], a: data[3] / 255};
    }

    #createSprites(r: number, g: number, b: number): HTMLCanvasElement[] {
        const sprites: HTMLCanvasElement[] = [];

        const gradientProfiles: [number, number][][] = [
            // 0: Soft glow
            [[0, 0.8], [0.3, 0.4], [0.7, 0.1], [1, 0]],
            // 1: Bright center
            [[0, 1], [0.15, 0.7], [0.5, 0.2], [1, 0]],
            // 2: Compact dot
            [[0, 0.9], [0.25, 0.5], [0.5, 0.1], [1, 0]]
        ];

        for (const profile of gradientProfiles) {
            const canvas = document.createElement('canvas');
            canvas.width = SPRITE_SIZE;
            canvas.height = SPRITE_SIZE;
            const ctx = canvas.getContext('2d')!;

            const gradient = ctx.createRadialGradient(
                SPRITE_CENTER, SPRITE_CENTER, 0,
                SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS
            );

            for (const [stop, alpha] of profile) {
                gradient.addColorStop(stop, `rgba(${r}, ${g}, ${b}, ${alpha})`);
            }

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            sprites.push(canvas);
        }

        // 3: Crystal snowflake
        sprites.push(this.#createCrystalSprite(r, g, b));

        return sprites;
    }

    #createCrystalSprite(r: number, g: number, b: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = SPRITE_SIZE;
        canvas.height = SPRITE_SIZE;
        const ctx = canvas.getContext('2d')!;

        // Soft glow base
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

        // Crystal arms
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        const armLength = SPRITE_RADIUS * 0.75;

        for (let arm = 0; arm < 6; arm++) {
            const angle = (arm / 6) * Math.PI * 2 - Math.PI / 2;
            const tipX = SPRITE_CENTER + Math.cos(angle) * armLength;
            const tipY = SPRITE_CENTER + Math.sin(angle) * armLength;

            // Main arm
            ctx.beginPath();
            ctx.moveTo(SPRITE_CENTER, SPRITE_CENTER);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();

            // Side branches at 40% and 65% along the arm
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

        // Center dot
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
