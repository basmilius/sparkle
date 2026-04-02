import { LimitedFrameRateCanvas } from '../canvas';
import { DEFAULT_CONFIG, MULBERRY } from './consts';
import type { Donut } from './donut';

export interface DonutSimulationConfig {
    readonly background?: string;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
    readonly collisionPadding?: number;
    readonly colors?: string[];
    readonly count?: number;
    readonly radiusRange?: [number, number];
    readonly repulsionStrength?: number;
    readonly rotationSpeedRange?: [number, number];
    readonly scale?: number;
    readonly speedRange?: [number, number];
    readonly thickness?: number;
}

export class DonutSimulation extends LimitedFrameRateCanvas {
    readonly #background: string;
    readonly #collisionPadding: number;
    readonly #colors: string[];
    readonly #count: number;
    readonly #radiusRange: [number, number];
    readonly #repulsionStrength: number;
    readonly #rotationSpeedRange: [number, number];
    readonly #scale: number;
    readonly #speedRange: [number, number];
    readonly #thickness: number;
    #donuts: Donut[] = [];

    constructor(canvas: HTMLCanvasElement, config: DonutSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        const scale = config.scale ?? 1;

        this.#background = config.background ?? DEFAULT_CONFIG.background!;
        this.#collisionPadding = (config.collisionPadding ?? DEFAULT_CONFIG.collisionPadding!) * scale;
        this.#colors = config.colors ?? DEFAULT_CONFIG.colors!;
        this.#count = config.count ?? DEFAULT_CONFIG.count!;
        this.#radiusRange = [
            (config.radiusRange ?? DEFAULT_CONFIG.radiusRange!)[0] * scale,
            (config.radiusRange ?? DEFAULT_CONFIG.radiusRange!)[1] * scale
        ];
        this.#repulsionStrength = config.repulsionStrength ?? DEFAULT_CONFIG.repulsionStrength!;
        this.#rotationSpeedRange = config.rotationSpeedRange ?? DEFAULT_CONFIG.rotationSpeedRange!;
        this.#scale = scale;
        this.#speedRange = [
            (config.speedRange ?? DEFAULT_CONFIG.speedRange!)[0] * scale,
            (config.speedRange ?? DEFAULT_CONFIG.speedRange!)[1] * scale
        ];
        this.#thickness = config.thickness ?? DEFAULT_CONFIG.thickness!;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';
    }

    start(): void {
        this.#donuts = [];

        for (let i = 0; i < this.#count; i++) {
            this.#donuts.push(this.#createNonOverlapping());
        }

        super.start();
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;

        ctx.globalAlpha = 1;
        ctx.fillStyle = this.#background;
        ctx.fillRect(0, 0, this.width, this.height);

        for (const donut of this.#donuts) {
            ctx.save();
            ctx.translate(donut.x, donut.y);
            ctx.rotate(donut.angle);

            ctx.beginPath();
            ctx.arc(0, 0, donut.outerRadius, 0, Math.PI * 2);
            ctx.arc(0, 0, donut.innerRadius, 0, Math.PI * 2, true);
            ctx.closePath();

            ctx.fillStyle = donut.color;
            ctx.fill();
            ctx.restore();
        }
    }

    tick(): void {
        const df = this.deltaFactor;

        this.#resolveCollisions(df);

        for (const donut of this.#donuts) {
            this.#updateDonut(donut, df);
        }
    }

    #updateDonut(donut: Donut, df: number): void {
        const currentSpeed = Math.sqrt(donut.vx * donut.vx + donut.vy * donut.vy);

        if (currentSpeed > donut.speed) {
            const damping = Math.pow(0.995, df);
            donut.vx *= damping;
            donut.vy *= damping;
        }

        donut.x += donut.vx * df;
        donut.y += donut.vy * df;
        donut.angle += donut.rotationSpeed * df;

        const limit = donut.outerRadius * 0.5;
        const width = this.width;
        const height = this.height;

        if (donut.x < -limit) {
            donut.x = -limit;
            donut.vx = Math.abs(donut.vx);
        }

        if (donut.x > width + limit) {
            donut.x = width + limit;
            donut.vx = -Math.abs(donut.vx);
        }

        if (donut.y < -limit) {
            donut.y = -limit;
            donut.vy = Math.abs(donut.vy);
        }

        if (donut.y > height + limit) {
            donut.y = height + limit;
            donut.vy = -Math.abs(donut.vy);
        }
    }

    #resolveCollisions(df: number): void {
        const padding = this.#collisionPadding;
        const strength = this.#repulsionStrength;

        for (let i = 0; i < this.#donuts.length; i++) {
            for (let j = i + 1; j < this.#donuts.length; j++) {
                const a = this.#donuts[i];
                const b = this.#donuts[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = a.outerRadius + b.outerRadius + padding;

                if (dist < minDist && dist > 0) {
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const force = overlap * strength * df;

                    a.vx -= nx * force;
                    a.vy -= ny * force;
                    b.vx += nx * force;
                    b.vy += ny * force;
                }
            }
        }
    }

    #createDonut(): Donut {
        const outerRadius = this.#rand(this.#radiusRange[0], this.#radiusRange[1]);
        const innerRadius = outerRadius * (1 - this.#thickness);
        const speed = this.#rand(this.#speedRange[0], this.#speedRange[1]);
        const direction = MULBERRY.next() * Math.PI * 2;

        return {
            outerRadius,
            innerRadius,
            x: this.#rand(-outerRadius, this.width + outerRadius),
            y: this.#rand(-outerRadius, this.height + outerRadius),
            angle: MULBERRY.next() * Math.PI * 2,
            speed,
            rotationSpeed: this.#rand(this.#rotationSpeedRange[0], this.#rotationSpeedRange[1]) * (MULBERRY.next() > 0.5 ? 1 : -1),
            color: this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)],
            vx: Math.cos(direction) * speed,
            vy: Math.sin(direction) * speed
        };
    }

    #createNonOverlapping(maxAttempts: number = 200): Donut {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const donut = this.#createDonut();

            if (!this.#overlapsAny(donut)) {
                return donut;
            }
        }

        return this.#createDonut();
    }

    #overlapsAny(donut: Donut): boolean {
        const minDist = this.#collisionPadding;

        return this.#donuts.some((other) => {
            const dx = donut.x - other.x;
            const dy = donut.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            return dist < donut.outerRadius + other.outerRadius + minDist;
        });
    }

    #rand(min: number, max: number): number {
        return MULBERRY.next() * (max - min) + min;
    }
}
