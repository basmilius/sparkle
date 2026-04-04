import { parseColor } from '../color';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { CrystalBranch, CrystalSeed } from './types';

const DEG_TO_RAD = Math.PI / 180;
const TAU = Math.PI * 2;
const MAX_BRANCHES_PER_SEED = 80;

export interface CrystallizationConfig {
    readonly seeds?: number;
    readonly speed?: number;
    readonly branchAngle?: number;
    readonly maxDepth?: number;
    readonly color?: string;
    readonly scale?: number;
}

const enum SeedPhase {
    Growing,
    Holding,
    Fading
}

export class Crystallization extends Effect<CrystallizationConfig> {
    #scale: number;
    readonly #seedCount: number;
    readonly #branchAngle: number;
    readonly #maxDepth: number;
    #speed: number;
    #seeds: CrystalSeed[] = [];
    #time: number = 0;
    #width: number = 0;
    #height: number = 0;
    #colorR: number;
    #colorG: number;
    #colorB: number;

    constructor(config: CrystallizationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#seedCount = config.seeds ?? 5;
        this.#speed = config.speed ?? 1;
        this.#branchAngle = (config.branchAngle ?? 60) * DEG_TO_RAD;
        this.#maxDepth = config.maxDepth ?? 5;

        const {r, g, b} = parseColor(config.color ?? '#88ccff');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;
    }

    configure(config: Partial<CrystallizationConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.color !== undefined) {
            const {r, g, b} = parseColor(config.color);
            this.#colorR = r;
            this.#colorG = g;
            this.#colorB = b;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#seeds = [];

        for (let idx = 0; idx < this.#seedCount; ++idx) {
            this.#seeds.push(this.#createSeed(idx * 1.5));
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.02 * dt * this.#speed;
        const growSpeed = 0.8 * dt * this.#speed;

        for (let idx = 0; idx < this.#seeds.length; ++idx) {
            const seed = this.#seeds[idx];

            if (seed.delay > 0) {
                seed.delay -= 0.02 * dt * this.#speed;
                continue;
            }

            if (seed.phase === SeedPhase.Growing) {
                const allGrown = this.#tickBranches(seed, seed.branches, growSpeed);

                if (allGrown) {
                    seed.phase = SeedPhase.Holding;
                    seed.holdTimer = 120;
                }
            } else if (seed.phase === SeedPhase.Holding) {
                seed.holdTimer -= dt * this.#speed;

                if (seed.holdTimer <= 0) {
                    seed.phase = SeedPhase.Fading;
                }
            } else {
                seed.alpha -= 0.008 * dt * this.#speed;

                if (seed.alpha <= 0) {
                    this.#seeds[idx] = this.#createSeed(0);
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        const cr = this.#colorR;
        const cg = this.#colorG;
        const cb = this.#colorB;

        ctx.lineCap = 'round';

        for (const seed of this.#seeds) {
            if (seed.delay > 0 || seed.alpha <= 0) {
                continue;
            }

            const baseAlpha = seed.alpha;

            this.#drawBranches(ctx, seed.branches, baseAlpha, cr, cg, cb);
            this.#drawSparkles(ctx, seed.branches, baseAlpha, seed.sparklePhase);
        }

        ctx.globalAlpha = 1;
    }

    #tickBranches(seed: CrystalSeed, branches: CrystalBranch[], growSpeed: number): boolean {
        let allGrown = true;

        for (const branch of branches) {
            if (branch.growing) {
                branch.currentLength += growSpeed * (1 + branch.depth * 0.3);

                if (branch.currentLength >= branch.targetLength) {
                    branch.currentLength = branch.targetLength;
                    branch.growing = false;
                    branch.grown = true;

                    if (branch.depth < this.#maxDepth && seed.branchCount < MAX_BRANCHES_PER_SEED) {
                        this.#spawnChildren(seed, branch);
                    }
                }

                allGrown = false;
            }

            if (branch.children.length > 0) {
                if (!this.#tickBranches(seed, branch.children, growSpeed)) {
                    allGrown = false;
                }
            }

            if (!branch.grown) {
                allGrown = false;
            }
        }

        return allGrown;
    }

    #drawBranches(ctx: CanvasRenderingContext2D, branches: CrystalBranch[], baseAlpha: number, cr: number, cg: number, cb: number): void {
        for (const branch of branches) {
            if (branch.currentLength <= 0) {
                continue;
            }

            const endX = branch.x + Math.cos(branch.angle) * branch.currentLength;
            const endY = branch.y + Math.sin(branch.angle) * branch.currentLength;
            const depthFade = 1 - branch.depth * 0.12;

            ctx.globalAlpha = baseAlpha * 0.12 * depthFade;
            ctx.strokeStyle = `rgb(${cr}, ${cg}, ${cb})`;
            ctx.lineWidth = branch.width + 4 * this.#scale;
            ctx.beginPath();
            ctx.moveTo(branch.x, branch.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            ctx.globalAlpha = baseAlpha * 0.8 * depthFade;
            ctx.lineWidth = branch.width;
            ctx.beginPath();
            ctx.moveTo(branch.x, branch.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            if (branch.children.length > 0) {
                this.#drawBranches(ctx, branch.children, baseAlpha, cr, cg, cb);
            }
        }
    }

    #drawSparkles(ctx: CanvasRenderingContext2D, branches: CrystalBranch[], baseAlpha: number, phase: number): void {
        for (const branch of branches) {
            if (branch.currentLength <= 0) {
                continue;
            }

            if (branch.growing || (branch.grown && branch.children.length === 0)) {
                const tipX = branch.x + Math.cos(branch.angle) * branch.currentLength;
                const tipY = branch.y + Math.sin(branch.angle) * branch.currentLength;
                const sparkle = 0.5 + 0.5 * Math.sin(this.#time * 10 + phase + branch.angle * 3);
                const radius = (1 + sparkle * 1.5) * this.#scale;

                ctx.globalAlpha = baseAlpha * sparkle * 0.8;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(tipX, tipY, radius, 0, TAU);
                ctx.fill();
            }

            if (branch.children.length > 0) {
                this.#drawSparkles(ctx, branch.children, baseAlpha, phase);
            }
        }
    }

    #createSeed(delay: number): CrystalSeed {
        const seed: CrystalSeed = {
            x: MULBERRY.next() * this.#width,
            y: MULBERRY.next() * this.#height,
            branches: [],
            sparklePhase: MULBERRY.next() * TAU,
            alpha: 1,
            phase: SeedPhase.Growing,
            holdTimer: 0,
            delay,
            branchCount: 0
        };

        const baseLength = (30 + MULBERRY.next() * 40) * this.#scale;

        for (let branchIdx = 0; branchIdx < 6; ++branchIdx) {
            const angle = (TAU / 6) * branchIdx + MULBERRY.next() * 0.1;

            seed.branches.push({
                x: seed.x,
                y: seed.y,
                angle,
                length: 0,
                targetLength: baseLength + MULBERRY.next() * 20 * this.#scale,
                currentLength: 0,
                depth: 0,
                children: [],
                width: (2.5 + MULBERRY.next()) * this.#scale,
                growing: true,
                grown: false
            });

            seed.branchCount += 1;
        }

        return seed;
    }

    #spawnChildren(seed: CrystalSeed, parent: CrystalBranch): void {
        const tipX = parent.x + Math.cos(parent.angle) * parent.targetLength;
        const tipY = parent.y + Math.sin(parent.angle) * parent.targetLength;
        const childLength = parent.targetLength * (0.5 + MULBERRY.next() * 0.2);
        const childWidth = Math.max(0.5 * this.#scale, parent.width * 0.65);
        const nextDepth = parent.depth + 1;

        const spawnChance = 1 - nextDepth * 0.15;

        const angles = [
            parent.angle + this.#branchAngle,
            parent.angle - this.#branchAngle
        ];

        for (const angle of angles) {
            if (MULBERRY.next() > spawnChance || seed.branchCount >= MAX_BRANCHES_PER_SEED) {
                continue;
            }

            parent.children.push({
                x: tipX,
                y: tipY,
                angle,
                length: 0,
                targetLength: childLength + MULBERRY.next() * 10 * this.#scale,
                currentLength: 0,
                depth: nextDepth,
                children: [],
                width: childWidth,
                growing: true,
                grown: false
            });

            seed.branchCount += 1;
        }

        if (MULBERRY.next() > 0.5 && seed.branchCount < MAX_BRANCHES_PER_SEED) {
            parent.children.push({
                x: tipX,
                y: tipY,
                angle: parent.angle + (MULBERRY.next() - 0.5) * 0.15,
                length: 0,
                targetLength: childLength * 0.7 + MULBERRY.next() * 8 * this.#scale,
                currentLength: 0,
                depth: nextDepth,
                children: [],
                width: childWidth,
                growing: true,
                grown: false
            });

            seed.branchCount += 1;
        }
    }

}
