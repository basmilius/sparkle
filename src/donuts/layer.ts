import { parseColor } from '../color';
import { Effect } from '../effect';
import { MouseTracker } from '../mouse';
import { setRotatedTransform } from '../transform';
import { DEFAULT_CONFIG, MULBERRY } from './consts';
import type { Donut } from './donut';

export interface DonutsConfig {
    readonly background?: string;
    readonly collisionPadding?: number;
    readonly colors?: string[];
    readonly count?: number;
    readonly gradient?: boolean;
    readonly mouseAvoidance?: boolean;
    readonly mouseAvoidanceRadius?: number;
    readonly mouseAvoidanceStrength?: number;
    readonly radiusRange?: [number, number];
    readonly repulsionStrength?: number;
    readonly rotationSpeedRange?: [number, number];
    readonly scale?: number;
    readonly speedRange?: [number, number];
    readonly thickness?: number;
}

export class Donuts extends Effect<DonutsConfig> {
    readonly #background: string;
    #gradient: boolean;
    #collisionPadding: number;
    #colors: string[];
    readonly #count: number;
    #mouseAvoidance: boolean;
    #mouseAvoidanceRadius: number;
    #mouseAvoidanceStrength: number;
    #radiusRange: [number, number];
    #repulsionStrength: number;
    readonly #rotationSpeedRange: [number, number];
    #scale: number;
    readonly #speedRange: [number, number];
    #thickness: number;
    readonly #mouse = new MouseTracker();
    #time: number = 0;
    #donuts: Donut[] = [];
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: DonutsConfig = {}) {
        super();

        const scale = config.scale ?? 1;

        this.#background = config.background ?? DEFAULT_CONFIG.background!;
        this.#gradient = config.gradient ?? false;
        this.#collisionPadding = (config.collisionPadding ?? DEFAULT_CONFIG.collisionPadding!) * scale;
        this.#colors = config.colors ?? DEFAULT_CONFIG.colors!;
        this.#count = config.count ?? DEFAULT_CONFIG.count!;
        this.#mouseAvoidance = config.mouseAvoidance ?? DEFAULT_CONFIG.mouseAvoidance!;
        this.#mouseAvoidanceRadius = (config.mouseAvoidanceRadius ?? DEFAULT_CONFIG.mouseAvoidanceRadius!) * scale;
        this.#mouseAvoidanceStrength = config.mouseAvoidanceStrength ?? DEFAULT_CONFIG.mouseAvoidanceStrength!;
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
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized) {
            this.#initialized = true;
            this.#donuts = [];

            for (let i = 0; i < this.#count; i++) {
                this.#donuts.push(this.#createNonOverlapping());
            }
        }
    }

    onMount(canvas: HTMLCanvasElement): void {
        if (this.#mouseAvoidance) {
            this.#mouse.attach(canvas);
        }
    }

    onUnmount(canvas: HTMLCanvasElement): void {
        this.#mouse.detach(canvas);
    }

    configure(config: Partial<DonutsConfig>): void {
        if (config.gradient !== undefined) {
            this.#gradient = config.gradient;
        }
        if (config.mouseAvoidance !== undefined) {
            this.#mouseAvoidance = config.mouseAvoidance;
        }
        if (config.mouseAvoidanceRadius !== undefined) {
            this.#mouseAvoidanceRadius = config.mouseAvoidanceRadius;
        }
        if (config.mouseAvoidanceStrength !== undefined) {
            this.#mouseAvoidanceStrength = config.mouseAvoidanceStrength;
        }
        if (config.repulsionStrength !== undefined) {
            this.#repulsionStrength = config.repulsionStrength;
        }
        if (config.colors !== undefined) {
            this.#colors = config.colors;

            for (let i = 0; i < this.#donuts.length; i++) {
                const color = this.#colors[i % this.#colors.length];
                const {r, g, b} = parseColor(color);
                this.#donuts[i].color = color;
                this.#donuts[i].highlightColor = `rgb(${Math.min(255, r + (255 - r) * 0.4)}, ${Math.min(255, g + (255 - g) * 0.4)}, ${Math.min(255, b + (255 - b) * 0.4)})`;
            }
        }
        if (config.thickness !== undefined) {
            this.#thickness = config.thickness;

            for (const donut of this.#donuts) {
                donut.innerRadius = donut.outerRadius * (1 - this.#thickness);
            }
        }
        if (config.scale !== undefined && config.scale !== this.#scale) {
            const ratio = config.scale / this.#scale;
            this.#scale = config.scale;
            this.#collisionPadding *= ratio;
            this.#mouseAvoidanceRadius *= ratio;
            this.#radiusRange = [this.#radiusRange[0] * ratio, this.#radiusRange[1] * ratio];

            for (const donut of this.#donuts) {
                donut.outerRadius *= ratio;
                donut.innerRadius *= ratio;
                donut.x *= ratio;
                donut.y *= ratio;
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#time += dt * 0.008;

        this.#resolveCollisions(dt);

        if (this.#mouseAvoidance && this.#mouse.onCanvas) {
            this.#resolveMouseAvoidance(dt);
        }

        for (const donut of this.#donuts) {
            this.#updateDonut(donut, dt);
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.#background;
        ctx.fillRect(0, 0, width, height);

        const base = ctx.getTransform();

        for (const donut of this.#donuts) {
            setRotatedTransform(ctx, base, donut.x, donut.y, donut.angle);

            ctx.beginPath();
            ctx.arc(0, 0, donut.outerRadius, 0, Math.PI * 2);
            ctx.arc(0, 0, donut.innerRadius, 0, Math.PI * 2, true);
            ctx.closePath();

            if (this.#gradient) {
                const gradient = ctx.createRadialGradient(
                    -donut.outerRadius * 0.3, -donut.outerRadius * 0.3, donut.innerRadius * 0.5,
                    0, 0, donut.outerRadius
                );
                gradient.addColorStop(0, donut.highlightColor);
                gradient.addColorStop(1, donut.color);
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = donut.color;
            }

            ctx.fill();
        }

        ctx.setTransform(base);
    }

    #updateDonut(donut: Donut, dt: number): void {
        let currentSpeed = Math.sqrt(donut.vx * donut.vx + donut.vy * donut.vy);

        if (currentSpeed > donut.speed) {
            const damping = Math.pow(0.99, dt);
            donut.vx *= damping;
            donut.vy *= damping;
            currentSpeed *= damping;
        }

        const maxSpeed = donut.speed * 5;

        if (currentSpeed > maxSpeed) {
            const scale = maxSpeed / currentSpeed;
            donut.vx *= scale;
            donut.vy *= scale;
        }

        const wobble = Math.sin(this.#time * donut.wobbleFreq + donut.wobblePhase) * donut.speed * 0.3;
        const wobbleCross = Math.cos(this.#time * donut.wobbleFreq * 0.8 + donut.wobblePhase + 2.0) * donut.speed * 0.2;

        donut.x += (donut.vx + wobble) * dt;
        donut.y += (donut.vy + wobbleCross) * dt;
        donut.angle += donut.rotationSpeed * dt;

        const limit = donut.outerRadius * 0.5;
        const width = this.#width;
        const height = this.#height;

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

    #resolveMouseAvoidance(dt: number): void {
        const radius = this.#mouseAvoidanceRadius;
        const strength = this.#mouseAvoidanceStrength;
        const mx = this.#mouse.x;
        const my = this.#mouse.y;

        for (const donut of this.#donuts) {
            const dx = donut.x - mx;
            const dy = donut.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = donut.outerRadius + radius;

            if (dist < minDist && dist > 0) {
                const overlap = minDist - dist;
                const nx = dx / dist;
                const ny = dy / dist;
                const force = overlap * strength * dt;

                donut.vx += nx * force;
                donut.vy += ny * force;
            }
        }
    }

    #resolveCollisions(dt: number): void {
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
                    const force = overlap * strength * dt;

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
        const color = this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)];
        const {r, g, b} = parseColor(color);
        const hr = Math.min(255, r + (255 - r) * 0.4);
        const hg = Math.min(255, g + (255 - g) * 0.4);
        const hb = Math.min(255, b + (255 - b) * 0.4);

        return {
            outerRadius,
            innerRadius,
            x: this.#rand(-outerRadius, this.#width + outerRadius),
            y: this.#rand(-outerRadius, this.#height + outerRadius),
            angle: MULBERRY.next() * Math.PI * 2,
            speed,
            rotationSpeed: this.#rand(this.#rotationSpeedRange[0], this.#rotationSpeedRange[1]) * (MULBERRY.next() > 0.5 ? 1 : -1),
            color,
            highlightColor: `rgb(${hr}, ${hg}, ${hb})`,
            vx: Math.cos(direction) * speed,
            vy: Math.sin(direction) * speed,
            wobblePhase: MULBERRY.next() * Math.PI * 2,
            wobbleFreq: 0.5 + MULBERRY.next() * 1.5
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
