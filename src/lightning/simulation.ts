import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { LightningBolt, LightningBranch } from './types';

export interface LightningSimulationConfig {
    readonly frequency?: number;
    readonly color?: string;
    readonly branches?: boolean;
    readonly flash?: boolean;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class LightningSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #frequency: number;
    readonly #colorR: number;
    readonly #colorG: number;
    readonly #colorB: number;
    readonly #enableBranches: boolean;
    readonly #enableFlash: boolean;
    #bolts: LightningBolt[] = [];
    #flashAlpha: number = 0;
    #cooldown: number = 0;

    constructor(canvas: HTMLCanvasElement, config: LightningSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#frequency = config.frequency ?? 1;
        this.#enableBranches = config.branches ?? true;
        this.#enableFlash = config.flash ?? true;

        const [r, g, b] = hexToRGB(config.color ?? '#b4c8ff');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        this.#cooldown = this.#nextCooldown();
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        // Flash overlay
        if (this.#flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.#flashAlpha})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (const bolt of this.#bolts) {
            if (bolt.alpha <= 0) {
                continue;
            }

            // Draw main bolt
            this.#drawSegments(ctx, bolt.segments, bolt.alpha, 6 * this.#scale, 2 * this.#scale);

            // Draw branches
            for (const branch of bolt.branches) {
                const branchAlpha = bolt.alpha * branch.alpha;
                this.#drawSegments(ctx, branch.segments, branchAlpha, 3 * this.#scale, 1 * this.#scale);
            }
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        // Spawn new bolts
        this.#cooldown -= dt;

        if (this.#cooldown <= 0) {
            this.#bolts.push(this.#createBolt());

            if (this.#enableFlash) {
                this.#flashAlpha = 0.3;
            }

            this.#cooldown = this.#nextCooldown();
        }

        // Update bolts
        let alive = 0;

        for (let i = 0; i < this.#bolts.length; i++) {
            const bolt = this.#bolts[i];

            bolt.ticksAlive += dt;
            bolt.alpha = Math.max(0, 1 - bolt.ticksAlive / bolt.lifetime);

            if (bolt.alpha > 0) {
                this.#bolts[alive++] = bolt;
            }
        }

        this.#bolts.length = alive;

        // Update flash
        if (this.#flashAlpha > 0) {
            this.#flashAlpha -= 0.04 * dt;

            if (this.#flashAlpha < 0) {
                this.#flashAlpha = 0;
            }
        }
    }

    #drawSegments(ctx: CanvasRenderingContext2D, segments: {x: number; y: number}[], alpha: number, outerWidth: number, innerWidth: number): void {
        if (segments.length < 2) {
            return;
        }

        // Outer glow
        ctx.beginPath();
        ctx.moveTo(segments[0].x * this.width, segments[0].y * this.height);

        for (let i = 1; i < segments.length; i++) {
            ctx.lineTo(segments[i].x * this.width, segments[i].y * this.height);
        }

        ctx.strokeStyle = `rgba(${this.#colorR}, ${this.#colorG}, ${this.#colorB}, ${alpha * 0.4})`;
        ctx.lineWidth = outerWidth;
        ctx.stroke();

        // Inner bright line
        ctx.beginPath();
        ctx.moveTo(segments[0].x * this.width, segments[0].y * this.height);

        for (let i = 1; i < segments.length; i++) {
            ctx.lineTo(segments[i].x * this.width, segments[i].y * this.height);
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = innerWidth;
        ctx.stroke();
    }

    #createBolt(): LightningBolt {
        const startX = 0.1 + MULBERRY.next() * 0.8;
        const segments: {x: number; y: number}[] = [{x: startX, y: 0}];
        const branches: LightningBranch[] = [];

        let currentX = startX;
        let currentY = 0;
        const steps = 10 + Math.floor(MULBERRY.next() * 10);

        for (let i = 0; i < steps; i++) {
            currentX += (MULBERRY.next() - 0.5) * 0.1;
            currentY += (0.6 + MULBERRY.next() * 0.4) / steps;
            currentX = Math.max(0.02, Math.min(0.98, currentX));
            segments.push({x: currentX, y: Math.min(currentY, 1)});

            // Spawn branch from some segments
            if (this.#enableBranches && i > 1 && i < steps - 2 && MULBERRY.next() < 0.35) {
                branches.push(this.#createBranch(currentX, currentY));
            }

            if (currentY >= 1) {
                break;
            }
        }

        return {
            segments,
            branches,
            alpha: 1,
            lifetime: 10 + MULBERRY.next() * 5,
            ticksAlive: 0
        };
    }

    #createBranch(startX: number, startY: number): LightningBranch {
        const segments: {x: number; y: number}[] = [{x: startX, y: startY}];
        const direction = MULBERRY.next() > 0.5 ? 1 : -1;
        const branchSteps = 3 + Math.floor(MULBERRY.next() * 5);

        let bx = startX;
        let by = startY;

        for (let i = 0; i < branchSteps; i++) {
            bx += (0.02 + MULBERRY.next() * 0.04) * direction;
            by += (0.02 + MULBERRY.next() * 0.04);
            bx = Math.max(0.02, Math.min(0.98, bx));
            segments.push({x: bx, y: Math.min(by, 1)});

            if (by >= 1) {
                break;
            }
        }

        return {
            segments,
            alpha: 0.4 + MULBERRY.next() * 0.4
        };
    }

    #nextCooldown(): number {
        const baseCooldown = 180 / this.#frequency;
        return baseCooldown + MULBERRY.next() * baseCooldown;
    }
}
