import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { Spark } from './types';

export interface SparklerSimulationConfig {
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
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const DEFAULT_COLORS = ['#ffcc33', '#ff9900', '#ffffff', '#ffee88'];

export class SparklerSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #emitRate: number;
    readonly #maxSparks: number;
    readonly #colorRGBs: [number, number, number][];
    readonly #speedRange: [number, number];
    readonly #friction: number;
    readonly #gravity: number;
    readonly #decayRange: [number, number];
    readonly #trailLength: number;
    readonly #hoverMode: boolean;
    readonly #onMouseMoveBound: (evt: MouseEvent) => void;
    readonly #onMouseLeaveBound: () => void;
    #emitX: number = 0.5;
    #emitY: number = 0.5;
    #mouseOnCanvas: boolean = false;
    #sparks: Spark[] = [];

    constructor(canvas: HTMLCanvasElement, config: SparklerSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

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

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        this.#onMouseMoveBound = this.#onMouseMove.bind(this);
        this.#onMouseLeaveBound = this.#onMouseLeave.bind(this);

        if (this.#hoverMode) {
            this.canvas.addEventListener('mousemove', this.#onMouseMoveBound, {passive: true});
            this.canvas.addEventListener('mouseleave', this.#onMouseLeaveBound, {passive: true});
        }
    }

    setPosition(x: number, y: number): void {
        this.#emitX = x;
        this.#emitY = y;
    }

    destroy(): void {
        this.canvas.removeEventListener('mousemove', this.#onMouseMoveBound);
        this.canvas.removeEventListener('mouseleave', this.#onMouseLeaveBound);
        super.destroy();
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.globalCompositeOperation = 'lighter';

        // Core glow at emit position
        if (!this.#hoverMode || this.#mouseOnCanvas) {
            const cx = this.#emitX * this.width;
            const cy = this.#emitY * this.height;
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

        // Sparks with trails
        for (const spark of this.#sparks) {
            const [r, g, b] = spark.color;

            // Trail
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

            // Head
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size * this.#scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${spark.alpha})`;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        // Emit new sparks
        if (!this.#hoverMode || this.#mouseOnCanvas) {
            const emitCount = Math.min(this.#emitRate, this.#maxSparks - this.#sparks.length);

            for (let i = 0; i < emitCount; i++) {
                this.#sparks.push(this.#createSpark());
            }
        }

        // Update sparks
        let alive = 0;

        for (let i = 0; i < this.#sparks.length; i++) {
            const spark = this.#sparks[i];

            // Store trail point
            spark.trail.push({x: spark.x, y: spark.y});

            if (spark.trail.length > this.#trailLength) {
                spark.trail.shift();
            }

            // Physics
            spark.vx *= Math.pow(this.#friction, dt);
            spark.vy *= Math.pow(this.#friction, dt);
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

    #onMouseMove(evt: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this.#emitX = (evt.clientX - rect.left) / rect.width;
        this.#emitY = (evt.clientY - rect.top) / rect.height;
        this.#mouseOnCanvas = true;
    }

    #onMouseLeave(): void {
        this.#mouseOnCanvas = false;
    }

    #createSpark(): Spark {
        const angle = MULBERRY.next() * Math.PI * 2;
        const speed = this.#speedRange[0] + MULBERRY.next() * (this.#speedRange[1] - this.#speedRange[0]);
        const colorIndex = Math.floor(MULBERRY.next() * this.#colorRGBs.length);

        return {
            x: this.#emitX * this.width,
            y: this.#emitY * this.height,
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
