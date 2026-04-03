import { SimulationLayer } from '../layer';
import { DEFAULT_CONFIG, MULBERRY } from './consts';
import type { Donut } from './donut';
import type { DonutSimulationConfig } from './simulation';

export class DonutLayer extends SimulationLayer {
    readonly #background: string;
    readonly #collisionPadding: number;
    readonly #colors: string[];
    readonly #count: number;
    readonly #mouseAvoidance: boolean;
    readonly #mouseAvoidanceRadius: number;
    readonly #mouseAvoidanceStrength: number;
    readonly #radiusRange: [number, number];
    readonly #repulsionStrength: number;
    readonly #rotationSpeedRange: [number, number];
    readonly #scale: number;
    readonly #speedRange: [number, number];
    readonly #thickness: number;
    readonly #onMouseMoveBound: (event: MouseEvent) => void;
    readonly #onMouseLeaveBound: () => void;
    #donuts: Donut[] = [];
    #mouseX: number = -1;
    #mouseY: number = -1;
    #mouseOnCanvas: boolean = false;
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: DonutSimulationConfig = {}) {
        super();

        const scale = config.scale ?? 1;

        this.#background = config.background ?? DEFAULT_CONFIG.background!;
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

        this.#onMouseMoveBound = (event: MouseEvent) => this.#onMouseMove(event);
        this.#onMouseLeaveBound = () => this.#onMouseLeave();
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
            canvas.addEventListener('mousemove', this.#onMouseMoveBound, {passive: true});
            canvas.addEventListener('mouseleave', this.#onMouseLeaveBound, {passive: true});
        }
    }

    onUnmount(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.#onMouseMoveBound);
        canvas.removeEventListener('mouseleave', this.#onMouseLeaveBound);
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        this.#resolveCollisions(dt);

        if (this.#mouseAvoidance && this.#mouseOnCanvas) {
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

    #updateDonut(donut: Donut, dt: number): void {
        const currentSpeed = Math.sqrt(donut.vx * donut.vx + donut.vy * donut.vy);

        if (currentSpeed > donut.speed) {
            const damping = Math.pow(0.995, dt);
            donut.vx *= damping;
            donut.vy *= damping;
        }

        donut.x += donut.vx * dt;
        donut.y += donut.vy * dt;
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

    #onMouseMove(event: MouseEvent): void {
        const target = event.currentTarget as HTMLCanvasElement;
        const rect = target.getBoundingClientRect();
        this.#mouseX = event.clientX - rect.left;
        this.#mouseY = event.clientY - rect.top;
        this.#mouseOnCanvas = true;
    }

    #onMouseLeave(): void {
        this.#mouseOnCanvas = false;
    }

    #resolveMouseAvoidance(dt: number): void {
        const radius = this.#mouseAvoidanceRadius;
        const strength = this.#mouseAvoidanceStrength;
        const mx = this.#mouseX;
        const my = this.#mouseY;

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

        return {
            outerRadius,
            innerRadius,
            x: this.#rand(-outerRadius, this.#width + outerRadius),
            y: this.#rand(-outerRadius, this.#height + outerRadius),
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
