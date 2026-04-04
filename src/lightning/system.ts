import type { LightningBolt, LightningBranch } from './types';

export interface LightningSystemConfig {
    readonly frequency?: number;
    readonly color?: [number, number, number];
    readonly branches?: boolean;
    readonly flash?: boolean;
    readonly scale?: number;
    readonly groundLevel?: number;
}

export class LightningSystem {
    #frequency: number;
    #colorR: number;
    #colorG: number;
    #colorB: number;
    #enableBranches: boolean;
    #enableFlash: boolean;
    readonly #scale: number;
    readonly #groundLevel: number;
    readonly #rng: () => number;
    #bolts: LightningBolt[] = [];
    #flashAlpha: number = 0;
    #cooldown: number = 0;

    get flashAlpha(): number {
        return this.#flashAlpha;
    }

    constructor(config: LightningSystemConfig, rng: () => number) {
        this.#frequency = config.frequency ?? 1;
        this.#enableBranches = config.branches ?? true;
        this.#enableFlash = config.flash ?? true;
        this.#scale = config.scale ?? 1;
        this.#groundLevel = config.groundLevel ?? 1;
        this.#rng = rng;

        const color = config.color ?? [180, 200, 255];
        this.#colorR = color[0];
        this.#colorG = color[1];
        this.#colorB = color[2];

        this.#cooldown = this.#nextCooldown();
    }

    update(config: { frequency?: number; color?: [number, number, number]; branches?: boolean; flash?: boolean }): void {
        if (config.frequency !== undefined) {
            this.#frequency = config.frequency;
        }
        if (config.color !== undefined) {
            this.#colorR = config.color[0];
            this.#colorG = config.color[1];
            this.#colorB = config.color[2];
        }
        if (config.branches !== undefined) {
            this.#enableBranches = config.branches;
        }
        if (config.flash !== undefined) {
            this.#enableFlash = config.flash;
        }
    }

    tick(dt: number): void {
        this.#cooldown -= dt;

        if (this.#cooldown <= 0) {
            this.#bolts.push(this.#createBolt());

            if (this.#enableFlash) {
                this.#flashAlpha = 0.3;
            }

            this.#cooldown = this.#nextCooldown();
        }

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

        if (this.#flashAlpha > 0) {
            this.#flashAlpha -= 0.012 * dt;

            if (this.#flashAlpha < 0) {
                this.#flashAlpha = 0;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (const bolt of this.#bolts) {
            if (bolt.alpha <= 0) {
                continue;
            }

            this.#drawSegments(ctx, bolt.segments, bolt.alpha, 6 * this.#scale, 2 * this.#scale, width, height);

            for (const branch of bolt.branches) {
                const branchAlpha = bolt.alpha * branch.alpha;
                this.#drawSegments(ctx, branch.segments, branchAlpha, 3 * this.#scale, 1 * this.#scale, width, height);
            }
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    #drawSegments(ctx: CanvasRenderingContext2D, segments: { x: number; y: number }[], alpha: number, outerWidth: number, innerWidth: number, width: number, height: number): void {
        if (segments.length < 2) {
            return;
        }

        // Outer glow
        ctx.beginPath();
        ctx.moveTo(segments[0].x * width, segments[0].y * height);

        for (let i = 1; i < segments.length; i++) {
            ctx.lineTo(segments[i].x * width, segments[i].y * height);
        }

        ctx.strokeStyle = `rgba(${this.#colorR}, ${this.#colorG}, ${this.#colorB}, ${alpha * 0.4})`;
        ctx.lineWidth = outerWidth;
        ctx.stroke();

        // Inner bright line
        ctx.beginPath();
        ctx.moveTo(segments[0].x * width, segments[0].y * height);

        for (let i = 1; i < segments.length; i++) {
            ctx.lineTo(segments[i].x * width, segments[i].y * height);
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = innerWidth;
        ctx.stroke();
    }

    #createBolt(): LightningBolt {
        const startX = 0.1 + this.#rng() * 0.8;
        const segments: { x: number; y: number }[] = [{x: startX, y: 0}];
        const branches: LightningBranch[] = [];

        let currentX = startX;
        let currentY = 0;
        const steps = 10 + Math.floor(this.#rng() * 10);

        for (let i = 0; i < steps; i++) {
            currentX += (this.#rng() - 0.5) * 0.1;
            currentY += (0.6 + this.#rng() * 0.4) / steps;
            currentX = Math.max(0.02, Math.min(0.98, currentX));
            segments.push({x: currentX, y: Math.min(currentY, this.#groundLevel)});

            if (this.#enableBranches && i > 1 && i < steps - 2 && this.#rng() < 0.35) {
                branches.push(this.#createBranch(currentX, currentY));
            }

            if (currentY >= this.#groundLevel) {
                break;
            }
        }

        return {
            segments,
            branches,
            alpha: 1,
            lifetime: 40 + this.#rng() * 40,
            ticksAlive: 0
        };
    }

    #createBranch(startX: number, startY: number): LightningBranch {
        const segments: { x: number; y: number }[] = [{x: startX, y: startY}];
        const direction = this.#rng() > 0.5 ? 1 : -1;
        const branchSteps = 3 + Math.floor(this.#rng() * 5);

        let bx = startX;
        let by = startY;

        for (let i = 0; i < branchSteps; i++) {
            bx += (0.02 + this.#rng() * 0.04) * direction;
            by += (0.02 + this.#rng() * 0.04);
            bx = Math.max(0.02, Math.min(0.98, bx));
            segments.push({x: bx, y: Math.min(by, this.#groundLevel)});

            if (by >= this.#groundLevel) {
                break;
            }
        }

        return {
            segments,
            alpha: 0.4 + this.#rng() * 0.4
        };
    }

    #nextCooldown(): number {
        const baseCooldown = 180 / this.#frequency;
        return baseCooldown + this.#rng() * baseCooldown;
    }
}
