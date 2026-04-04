import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { SparklerSpark } from './types';

export interface SparklersConfig {
    readonly emitRate?: number;
    readonly maxSparks?: number;
    readonly colors?: string[];
    readonly speed?: [number, number];
    readonly friction?: number;
    readonly gravity?: number;
    readonly decay?: [number, number];
    readonly trailLength?: number;
    readonly hoverMode?: boolean;
    readonly scale?: number;
}

const DEFAULT_COLORS = ['#ffcc33', '#ff9900', '#ffffff', '#ffee88'];

export class Sparklers extends Effect<SparklersConfig> {
    #scale: number;
    #emitRate: number;
    #maxSparks: number;
    #colorRGBs: [number, number, number][];
    readonly #speedRange: [number, number];
    #friction: number;
    #gravity: number;
    readonly #decayRange: [number, number];
    #trailLength: number;
    #hoverMode: boolean;
    readonly #onMouseMoveBound: (evt: MouseEvent) => void;
    readonly #onMouseLeaveBound: () => void;
    #emitX: number = 0.5;
    #emitY: number = 0.5;
    #mouseOnCanvas: boolean = false;
    #sparks: SparklerSpark[] = [];
    #mountedCanvas: HTMLCanvasElement | null = null;
    #cachedRect: DOMRect | null = null;

    constructor(config: SparklersConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#emitRate = config.emitRate ?? 8;
        this.#maxSparks = config.maxSparks ?? 300;
        this.#speedRange = config.speed ?? [2, 8];
        this.#friction = config.friction ?? 0.96;
        this.#gravity = config.gravity ?? 0.8;
        this.#decayRange = config.decay ?? [0.02, 0.05];
        this.#trailLength = config.trailLength ?? 3;
        this.#hoverMode = config.hoverMode ?? false;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#colorRGBs = colors.map(c => hexToRGB(c));

        this.#onMouseMoveBound = this.#onMouseMove.bind(this);
        this.#onMouseLeaveBound = this.#onMouseLeave.bind(this);
    }

    moveTo(x: number, y: number): void {
        this.#emitX = x;
        this.#emitY = y;
    }

    onMount(canvas: HTMLCanvasElement): void {
        this.#mountedCanvas = canvas;
        this.#cachedRect = canvas.getBoundingClientRect();

        if (this.#hoverMode) {
            canvas.addEventListener('mousemove', this.#onMouseMoveBound, {passive: true});
            canvas.addEventListener('mouseleave', this.#onMouseLeaveBound, {passive: true});
        }
    }

    onUnmount(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.#onMouseMoveBound);
        canvas.removeEventListener('mouseleave', this.#onMouseLeaveBound);
        this.#mountedCanvas = null;
        this.#cachedRect = null;
    }

    onResize(): void {
        if (this.#mountedCanvas) {
            this.#cachedRect = this.#mountedCanvas.getBoundingClientRect();
        }
    }

    configure(config: Partial<SparklersConfig>): void {
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
        if (config.emitRate !== undefined) {
            this.#emitRate = config.emitRate;
        }
        if (config.friction !== undefined) {
            this.#friction = config.friction;
        }
        if (config.gravity !== undefined) {
            this.#gravity = config.gravity;
        }
        if (config.trailLength !== undefined) {
            this.#trailLength = config.trailLength;
        }
        if (config.hoverMode !== undefined) {
            this.#hoverMode = config.hoverMode;
        }
        if (config.colors !== undefined) {
            this.#colorRGBs = config.colors.map(c => hexToRGB(c));
        }
        if (config.maxSparks !== undefined) {
            this.#maxSparks = config.maxSparks;
        }
    }

    tick(dt: number, width: number, height: number): void {
        if (!this.#hoverMode || this.#mouseOnCanvas) {
            const emitCount = Math.min(this.#emitRate, this.#maxSparks - this.#sparks.length);

            for (let i = 0; i < emitCount; i++) {
                this.#sparks.push(this.#createSpark(width, height));
            }
        }

        const frictionFactor = Math.pow(this.#friction, dt);
        let alive = 0;

        for (let i = 0; i < this.#sparks.length; i++) {
            const spark = this.#sparks[i];

            spark.trail.push({x: spark.x, y: spark.y});

            if (spark.trail.length > this.#trailLength) {
                spark.trail.shift();
            }

            spark.vx *= frictionFactor;
            spark.vy *= frictionFactor;
            spark.vy += this.#gravity * this.#scale * dt;

            spark.x += spark.vx * dt;
            spark.y += spark.vy * dt;

            spark.alpha -= spark.decay * dt;

            if (spark.alpha > 0) {
                this.#sparks[alive++] = spark;
            }
        }

        this.#sparks.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalCompositeOperation = 'lighter';

        if (!this.#hoverMode || this.#mouseOnCanvas) {
            const cx = this.#emitX * width;
            const cy = this.#emitY * height;
            const glowRadius = 15 * this.#scale;
            const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
            glow.addColorStop(0, 'rgba(255, 220, 100, 0.8)');
            glow.addColorStop(0.3, 'rgba(255, 180, 50, 0.3)');
            glow.addColorStop(1, 'rgba(255, 150, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const spark of this.#sparks) {
            const [r, g, b] = spark.color;

            for (let t = 0; t < spark.trail.length; t++) {
                const trailAlpha = spark.alpha * (t / spark.trail.length) * 0.5;

                if (trailAlpha < 0.01) {
                    continue;
                }

                const trailSize = spark.size * (t / spark.trail.length) * this.#scale;

                ctx.beginPath();
                ctx.arc(spark.trail[t].x, spark.trail[t].y, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailAlpha})`;
                ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size * this.#scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${spark.alpha})`;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    #onMouseMove(evt: MouseEvent): void {
        const rect = this.#cachedRect ?? (evt.currentTarget as HTMLCanvasElement).getBoundingClientRect();
        this.#emitX = (evt.clientX - rect.left) / rect.width;
        this.#emitY = (evt.clientY - rect.top) / rect.height;
        this.#mouseOnCanvas = true;
    }

    #onMouseLeave(): void {
        this.#mouseOnCanvas = false;
    }

    #createSpark(width: number, height: number): SparklerSpark {
        const angle = MULBERRY.next() * Math.PI * 2;
        const speed = this.#speedRange[0] + MULBERRY.next() * (this.#speedRange[1] - this.#speedRange[0]);
        const colorIndex = Math.floor(MULBERRY.next() * this.#colorRGBs.length);

        return {
            x: this.#emitX * width,
            y: this.#emitY * height,
            vx: Math.cos(angle) * speed * this.#scale,
            vy: Math.sin(angle) * speed * this.#scale,
            alpha: 0.8 + MULBERRY.next() * 0.2,
            color: this.#colorRGBs[colorIndex],
            size: 1 + MULBERRY.next() * 2,
            decay: this.#decayRange[0] + MULBERRY.next() * (this.#decayRange[1] - this.#decayRange[0]),
            trail: []
        };
    }
}
