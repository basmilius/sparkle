import { parseColor } from '../color';
import { Effect } from '../effect';
import { DEFAULT_COLORS, MULBERRY } from './consts';
import type { NeonTube, NeonTubeShape } from './types';

export interface NeonConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly flicker?: boolean;
    readonly scale?: number;
}

export class Neon extends Effect<NeonConfig> {
    #scale: number;
    #speed: number;
    #flicker: boolean;
    #colors: string[];
    #tubes: NeonTube[] = [];
    #time: number = 0;
    #initialized: boolean = false;
    readonly #count: number;

    constructor(config: NeonConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#flicker = config.flicker ?? true;
        this.#colors = config.colors ?? DEFAULT_COLORS;
        this.#count = config.count ?? 8;
    }

    configure(config: Partial<NeonConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.flicker !== undefined) {
            this.#flicker = config.flicker;
        }
        if (config.colors !== undefined) {
            this.#colors = config.colors;

            for (let i = 0; i < this.#tubes.length; i++) {
                this.#tubes[i].color = this.#colors[i % this.#colors.length];
            }
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        if (!this.#initialized && width > 0 && height > 0) {
            this.#initialized = true;
            this.#tubes = [];
            for (let i = 0; i < this.#count; i++) {
                this.#tubes.push(this.#createTube());
            }
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.01 * dt * this.#speed;

        for (const tube of this.#tubes) {
            tube.angle += tube.rotationSpeed * dt * this.#speed;

            if (this.#flicker) {
                if (!tube.flickering && MULBERRY.next() < 0.002) {
                    tube.flickering = true;
                    tube.flickerTarget = 0.15 + MULBERRY.next() * 0.25;
                    tube.flickerProgress = 0;
                }

                if (tube.flickering) {
                    tube.flickerProgress += dt * 0.008;

                    if (tube.flickerProgress < 0.3) {
                        tube.flickerAlpha = 1 - (1 - tube.flickerTarget) * (tube.flickerProgress / 0.3);
                    } else if (tube.flickerProgress < 0.6) {
                        tube.flickerAlpha = tube.flickerTarget;
                    } else if (tube.flickerProgress < 1) {
                        tube.flickerAlpha = tube.flickerTarget + (1 - tube.flickerTarget) * ((tube.flickerProgress - 0.6) / 0.4);
                    } else {
                        tube.flickerAlpha = 1;
                        tube.flickering = false;
                        tube.flickerProgress = 0;
                    }
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalCompositeOperation = 'lighter';

        for (const tube of this.#tubes) {
            const alpha = tube.flickerAlpha;
            const parsed = parseColor(tube.color);
            const r = parsed.r;
            const g = parsed.g;
            const b = parsed.b;

            ctx.save();
            ctx.translate(tube.x * width, tube.y * height);
            ctx.rotate(tube.angle);

            const canvasScale = Math.min(width, height) / 600;
            const size = tube.size * this.#scale * canvasScale;

            // Outer blurry glow
            ctx.lineWidth = size * 0.18;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.06 * alpha})`;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            this.#drawTubeShape(ctx, tube, size, this.#time);

            // Medium glow
            ctx.lineWidth = size * 0.1;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.25 * alpha})`;
            this.#drawTubeShape(ctx, tube, size, this.#time);

            // Inner glow
            ctx.lineWidth = size * 0.055;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.55 * alpha})`;
            this.#drawTubeShape(ctx, tube, size, this.#time);

            // Bright core
            ctx.lineWidth = size * 0.022;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
            this.#drawTubeShape(ctx, tube, size, this.#time);

            ctx.restore();
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #drawTubeShape(ctx: CanvasRenderingContext2D, tube: NeonTube, size: number, time: number): void {
        ctx.beginPath();

        switch (tube.shape) {
            case 'circle': {
                const cx = Math.cos(time * 0.3 + tube.phaseOffset) * size * 0.08;
                const cy = Math.sin(time * 0.2 + tube.phaseOffset) * size * 0.08;
                ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
                break;
            }

            case 'wave': {
                const steps = 32;
                const halfW = size * 0.55;
                for (let i = 0; i <= steps; i++) {
                    const tx = (i / steps) * halfW * 2 - halfW;
                    const ty = Math.sin((i / steps) * Math.PI * 2 * tube.frequency + time * tube.frequency * 0.5 + tube.phaseOffset) * size * tube.amplitude;
                    if (i === 0) {
                        ctx.moveTo(tx, ty);
                    } else {
                        ctx.lineTo(tx, ty);
                    }
                }
                break;
            }

            case 'zigzag': {
                const zigSteps = 8;
                const zigW = size * 0.55;
                for (let i = 0; i <= zigSteps; i++) {
                    const tx = (i / zigSteps) * zigW * 2 - zigW;
                    const ty = (i % 2 === 0 ? 1 : -1) * size * 0.28;
                    if (i === 0) {
                        ctx.moveTo(tx, ty);
                    } else {
                        ctx.lineTo(tx, ty);
                    }
                }
                break;
            }

            case 'curve': {
                const cx1 = -size * 0.55;
                const cy1 = Math.sin(time * 0.5 + tube.phaseOffset) * size * 0.35;
                const cx2 = size * 0.55;
                const cy2 = Math.sin(time * 0.5 + tube.phaseOffset + Math.PI) * size * 0.35;
                const cp1x = -size * 0.2;
                const cp1y = size * 0.4 * tube.amplitude;
                const cp2x = size * 0.2;
                const cp2y = -size * 0.4 * tube.amplitude;
                ctx.moveTo(cx1, cy1);
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx2, cy2);
                break;
            }
        }

        ctx.stroke();
    }

    #createTube(): NeonTube {
        const shapes: NeonTubeShape[] = ['circle', 'wave', 'zigzag', 'curve'];
        const shape = shapes[Math.floor(MULBERRY.next() * shapes.length)];
        const color = this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)];

        return {
            shape,
            color,
            x: 0.1 + MULBERRY.next() * 0.8,
            y: 0.1 + MULBERRY.next() * 0.8,
            size: 80 + MULBERRY.next() * 120,
            angle: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.0008,
            phaseOffset: MULBERRY.next() * Math.PI * 2,
            flickerAlpha: 1,
            flickering: false,
            flickerTarget: 1,
            flickerProgress: 0,
            amplitude: 0.2 + MULBERRY.next() * 0.25,
            frequency: 1 + Math.floor(MULBERRY.next() * 3)
        };
    }
}
