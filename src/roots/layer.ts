import { parseColor } from '../color';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { RootSystem, RootTip } from './types';

export interface RootsConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly branchProbability?: number;
    readonly maxSegments?: number;
    readonly scale?: number;
}

export class Roots extends Effect<RootsConfig> {
    #scale: number;
    #speed: number;
    #colorR: number;
    #colorG: number;
    #colorB: number;
    #branchProbability: number;
    #maxSegments: number;
    readonly #count: number;
    #systems: RootSystem[] = [];
    #initialized: boolean = false;
    #width: number = 800;
    #height: number = 600;

    constructor(config: RootsConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#branchProbability = config.branchProbability ?? 0.3;
        this.#maxSegments = config.maxSegments ?? 200;
        this.#count = config.count ?? 5;

        const parsed = parseColor(config.color ?? '#4a3728');
        this.#colorR = parsed.r;
        this.#colorG = parsed.g;
        this.#colorB = parsed.b;
    }

    configure(config: Partial<RootsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.color !== undefined) {
            const parsed = parseColor(config.color);
            this.#colorR = parsed.r;
            this.#colorG = parsed.g;
            this.#colorB = parsed.b;
        }
        if (config.branchProbability !== undefined) {
            this.#branchProbability = config.branchProbability;
        }
        if (config.maxSegments !== undefined) {
            this.#maxSegments = config.maxSegments;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized && width > 0 && height > 0) {
            this.#initialized = true;
            this.#systems = [];
            for (let i = 0; i < this.#count; i++) {
                this.#systems.push(this.#createSystem(width, height));
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const growSteps = Math.ceil(this.#speed * dt / 16 * 2);

        for (const system of this.#systems) {
            if (system.phase === 'growing') {
                for (let step = 0; step < growSteps; step++) {
                    this.#growSystem(system);
                }
            } else {
                system.opacity -= 0.04 * this.#speed * dt / 16;
                if (system.opacity <= 0) {
                    this.#resetSystem(system, width, height);
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        for (const system of this.#systems) {
            if (system.opacity <= 0) {
                continue;
            }

            ctx.globalAlpha = system.opacity;
            this.#drawSystem(ctx, system);
        }

        ctx.globalAlpha = 1;
    }

    #growSystem(system: RootSystem): void {
        if (system.segmentCount >= this.#maxSegments) {
            system.phase = 'fading';
            return;
        }

        const activeTips = system.tips.filter(tip => tip.alive);
        if (activeTips.length === 0) {
            system.phase = 'fading';
            return;
        }

        for (const tip of activeTips) {
            // Grow upward with slight deviation
            const angleDeviation = (MULBERRY.next() - 0.5) * 0.6;
            tip.angle += angleDeviation;

            // Keep growing upward (bias)
            tip.angle = tip.angle * 0.85 + (-Math.PI / 2) * 0.15;

            const stepSize = (3 + MULBERRY.next() * 4) * this.#scale;
            const newX = tip.x + Math.cos(tip.angle) * stepSize;
            const newY = tip.y + Math.sin(tip.angle) * stepSize;

            tip.points.push({x: newX, y: newY});
            tip.x = newX;
            tip.y = newY;
            system.segmentCount++;

            // Branch
            if (tip.depth < 6 && MULBERRY.next() < this.#branchProbability * 0.04 && system.segmentCount < this.#maxSegments * 0.8) {
                const branchAngle = tip.angle + (MULBERRY.next() > 0.5 ? 1 : -1) * (0.3 + MULBERRY.next() * 0.5);
                const newTip: RootTip = {
                    x: tip.x,
                    y: tip.y,
                    angle: branchAngle,
                    depth: tip.depth + 1,
                    points: [{x: tip.x, y: tip.y}],
                    alive: true,
                    lineWidth: Math.max(0.5, tip.lineWidth * 0.7),
                    colorVariant: MULBERRY.next() * 0.3
                };
                system.tips.push(newTip);
                system.allTips.push(newTip);
            }

            // Kill tips that go off screen
            if (newX < -50 || newX > this.#width + 50 || newY < -50) {
                tip.alive = false;
            }
        }
    }

    #drawSystem(ctx: CanvasRenderingContext2D, system: RootSystem): void {
        const r = this.#colorR;
        const g = this.#colorG;
        const b = this.#colorB;

        for (const tip of system.allTips) {
            if (tip.points.length < 2) {
                continue;
            }

            const darkness = tip.colorVariant;
            const cr = Math.max(0, r - darkness * 40);
            const cg = Math.max(0, g - darkness * 30);
            const cb = Math.max(0, b - darkness * 20);

            ctx.strokeStyle = `rgb(${cr}, ${cg}, ${cb})`;
            ctx.lineWidth = tip.lineWidth * this.#scale;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(tip.points[0].x, tip.points[0].y);

            for (let i = 1; i < tip.points.length - 1; i++) {
                const mx = (tip.points[i].x + tip.points[i + 1].x) / 2;
                const my = (tip.points[i].y + tip.points[i + 1].y) / 2;
                ctx.quadraticCurveTo(tip.points[i].x, tip.points[i].y, mx, my);
            }

            const last = tip.points[tip.points.length - 1];
            ctx.lineTo(last.x, last.y);
            ctx.stroke();
        }
    }

    #createSystem(width: number, height: number): RootSystem {
        const startX = width * (0.2 + MULBERRY.next() * 0.6);
        const startY = height + 10;
        const baseWidth = 3 + MULBERRY.next() * 3;

        const rootTip: RootTip = {
            x: startX,
            y: startY,
            angle: -Math.PI / 2 + (MULBERRY.next() - 0.5) * 0.3,
            depth: 0,
            points: [{x: startX, y: startY}],
            alive: true,
            lineWidth: baseWidth,
            colorVariant: MULBERRY.next() * 0.2
        };

        return {
            tips: [rootTip],
            allTips: [rootTip],
            segmentCount: 0,
            phase: 'growing',
            opacity: 0.8 + MULBERRY.next() * 0.2
        };
    }

    #resetSystem(system: RootSystem, width: number, height: number): void {
        const newSystem = this.#createSystem(width, height);
        system.tips = newSystem.tips;
        system.allTips = newSystem.allTips;
        system.segmentCount = 0;
        system.phase = 'growing';
        system.opacity = 0.8 + MULBERRY.next() * 0.2;
    }
}
