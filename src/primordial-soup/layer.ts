import { isSmallScreen } from '../mobile';
import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { Cell, DividingCell, FoodParticle } from './types';

const TAU = Math.PI * 2;
const DEFAULT_COLORS = ['#66bb6a', '#42a5f5', '#ab47bc', '#ef5350', '#ffa726'];
const DIVIDE_THRESHOLD = 1.8;
const DIVIDE_DURATION = 60;
const STARVE_THRESHOLD = 0.15;
const MIN_CELL_RADIUS = 4;
const MAX_CELL_RADIUS = 18;

export interface PrimordialSoupConfig {
    readonly speed?: number;
    readonly maxCells?: number;
    readonly foodRate?: number;
    readonly colors?: string[];
    readonly scale?: number;
}

export class PrimordialSoup extends Effect<PrimordialSoupConfig> {
    readonly #scale: number;
    readonly #colorsRGB: [number, number, number][];
    #speed: number;
    #maxCells: number;
    #foodRate: number;
    #cells: Cell[] = [];
    #food: FoodParticle[] = [];
    #dividing: DividingCell[] = [];
    #width: number = 0;
    #height: number = 0;
    #time: number = 0;
    #foodAccumulator: number = 0;

    constructor(config: PrimordialSoupConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#maxCells = config.maxCells ?? 40;
        this.#foodRate = config.foodRate ?? 3;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#colorsRGB = colors.map((color) => hexToRGB(color));

        if (isSmallScreen()) {
            this.#maxCells = Math.floor(this.#maxCells / 2);
        }
    }

    configure(config: Partial<PrimordialSoupConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.foodRate !== undefined) {
            this.#foodRate = config.foodRate;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        this.#cells = [];
        this.#food = [];
        this.#dividing = [];

        const initialCount = Math.min(this.#maxCells, Math.floor(this.#maxCells * 0.5));

        for (let idx = 0; idx < initialCount; ++idx) {
            this.#cells.push(this.#createCell(
                MULBERRY.next() * width,
                MULBERRY.next() * height
            ));
        }

        for (let idx = 0; idx < 30; ++idx) {
            this.#food.push(this.#createFood(width, height));
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#time += dt * this.#speed * 0.01;

        const speedDt = dt * this.#speed;

        // Spawn food particles.
        this.#foodAccumulator += this.#foodRate * speedDt * 0.02;

        while (this.#foodAccumulator >= 1) {
            this.#foodAccumulator -= 1;
            this.#food.push(this.#createFood(width, height));
        }

        // Update food particles (gentle drift).
        for (const food of this.#food) {
            food.x += Math.sin(this.#time * 2 + food.y * 0.01) * 0.15 * speedDt;
            food.y += Math.cos(this.#time * 1.7 + food.x * 0.01) * 0.1 * speedDt;

            // Wrap around edges.
            if (food.x < -10) {
                food.x = width + 5;
            } else if (food.x > width + 10) {
                food.x = -5;
            }

            if (food.y < -10) {
                food.y = height + 5;
            } else if (food.y > height + 10) {
                food.y = -5;
            }
        }

        // Update dividing cells.
        let dividingAlive = 0;

        for (let idx = 0; idx < this.#dividing.length; ++idx) {
            const div = this.#dividing[idx];
            div.progress += speedDt * 0.03;

            if (div.progress >= 1) {
                // Split into two cells.
                const offset = div.radius * 1.2;
                const cosA = Math.cos(div.angle);
                const sinA = Math.sin(div.angle);
                const childRadius = div.radius * 0.75;
                const childEnergy = div.energy * 0.5;

                if (this.#cells.length < this.#maxCells) {
                    this.#cells.push({
                        x: div.x + cosA * offset,
                        y: div.y + sinA * offset,
                        vx: cosA * 0.3,
                        vy: sinA * 0.3,
                        radius: childRadius,
                        color: div.color,
                        energy: childEnergy,
                        divideTimer: 0
                    });
                }

                if (this.#cells.length < this.#maxCells) {
                    this.#cells.push({
                        x: div.x - cosA * offset,
                        y: div.y - sinA * offset,
                        vx: -cosA * 0.3,
                        vy: -sinA * 0.3,
                        radius: childRadius,
                        color: div.color,
                        energy: childEnergy,
                        divideTimer: 0
                    });
                }
            } else {
                this.#dividing[dividingAlive++] = div;
            }
        }

        this.#dividing.length = dividingAlive;

        // Update cells.
        let cellsAlive = 0;

        for (let idx = 0; idx < this.#cells.length; ++idx) {
            const cell = this.#cells[idx];

            // Brownian drift.
            cell.vx += (MULBERRY.next() - 0.5) * 0.08 * speedDt;
            cell.vy += (MULBERRY.next() - 0.5) * 0.08 * speedDt;

            // Damping.
            cell.vx *= 0.98;
            cell.vy *= 0.98;

            cell.x += cell.vx * speedDt;
            cell.y += cell.vy * speedDt;

            // Consume nearby food.
            const eatRadius = cell.radius * this.#scale * 1.5;
            let foodAlive = 0;

            for (let fi = 0; fi < this.#food.length; ++fi) {
                const food = this.#food[fi];
                const dx = cell.x - food.x;
                const dy = cell.y - food.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < eatRadius) {
                    cell.energy += 0.12;
                    cell.radius = Math.min(MAX_CELL_RADIUS, cell.radius + 0.15);
                } else {
                    this.#food[foodAlive++] = food;
                }
            }

            this.#food.length = foodAlive;

            // Energy decay over time.
            cell.energy -= 0.002 * speedDt;
            cell.divideTimer += speedDt * 0.01;

            // Check for cell division.
            if (cell.energy >= DIVIDE_THRESHOLD && cell.divideTimer > 1 && this.#cells.length + this.#dividing.length * 2 < this.#maxCells) {
                this.#dividing.push({
                    x: cell.x,
                    y: cell.y,
                    radius: cell.radius,
                    color: cell.color,
                    angle: MULBERRY.next() * TAU,
                    progress: 0,
                    energy: cell.energy
                });
                continue;
            }

            // Starving cells shrink and die.
            if (cell.energy < STARVE_THRESHOLD) {
                cell.radius -= 0.03 * speedDt;

                if (cell.radius < MIN_CELL_RADIUS * 0.5) {
                    continue;
                }
            }

            // Bounce off edges.
            const scaledRadius = cell.radius * this.#scale;

            if (cell.x < scaledRadius) {
                cell.x = scaledRadius;
                cell.vx = Math.abs(cell.vx) * 0.5;
            } else if (cell.x > width - scaledRadius) {
                cell.x = width - scaledRadius;
                cell.vx = -Math.abs(cell.vx) * 0.5;
            }

            if (cell.y < scaledRadius) {
                cell.y = scaledRadius;
                cell.vy = Math.abs(cell.vy) * 0.5;
            } else if (cell.y > height - scaledRadius) {
                cell.y = height - scaledRadius;
                cell.vy = -Math.abs(cell.vy) * 0.5;
            }

            // Soft repulsion between cells.
            for (let oi = idx + 1; oi < this.#cells.length; ++oi) {
                const other = this.#cells[oi];
                const dx = other.x - cell.x;
                const dy = other.y - cell.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = (cell.radius + other.radius) * this.#scale;

                if (dist < minDist && dist > 0) {
                    const force = (minDist - dist) / minDist * 0.05;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    cell.vx -= nx * force * speedDt;
                    cell.vy -= ny * force * speedDt;
                    other.vx += nx * force * speedDt;
                    other.vy += ny * force * speedDt;
                }
            }

            this.#cells[cellsAlive++] = cell;
        }

        this.#cells.length = cellsAlive;

        // Respawn cells if population is too low.
        if (this.#cells.length < Math.floor(this.#maxCells * 0.2) && this.#dividing.length === 0) {
            this.#cells.push(this.#createCell(
                MULBERRY.next() * width,
                MULBERRY.next() * height
            ));
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        // Draw food particles.
        for (const food of this.#food) {
            const [fr, fg, fb] = food.color;
            ctx.beginPath();
            ctx.arc(food.x, food.y, food.radius * this.#scale, 0, TAU);
            ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, ${food.opacity})`;
            ctx.fill();
        }

        // Draw dividing cells (mitosis animation).
        for (const div of this.#dividing) {
            const [cr, cg, cb] = div.color;
            const progress = div.progress;
            const scaledRadius = div.radius * this.#scale;

            // Elongation phase (0 to 0.5).
            if (progress < 0.5) {
                const elongation = 1 + progress * 1.2;
                const pinch = 1 - progress * 0.3;

                ctx.save();
                ctx.translate(div.x, div.y);
                ctx.rotate(div.angle);
                ctx.scale(elongation, pinch);

                // Cell membrane.
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, scaledRadius);
                gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.15)`);
                gradient.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, 0.25)`);
                gradient.addColorStop(0.85, `rgba(${cr}, ${cg}, ${cb}, 0.35)`);
                gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0.05)`);

                ctx.beginPath();
                ctx.arc(0, 0, scaledRadius, 0, TAU);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Nucleus splitting.
                const nucleusOffset = progress * scaledRadius * 0.4;
                ctx.beginPath();
                ctx.arc(-nucleusOffset, 0, scaledRadius * 0.2, 0, TAU);
                ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.6)`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(nucleusOffset, 0, scaledRadius * 0.2, 0, TAU);
                ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.6)`;
                ctx.fill();

                ctx.restore();
            } else {
                // Pinch and split phase (0.5 to 1).
                const splitProgress = (progress - 0.5) * 2;
                const offset = scaledRadius * (0.6 + splitProgress * 0.8);
                const childScale = 0.7 + splitProgress * 0.3;
                const cosA = Math.cos(div.angle);
                const sinA = Math.sin(div.angle);

                // Draw two separating daughter cells.
                for (let side = -1; side <= 1; side += 2) {
                    const cx = div.x + cosA * offset * side * 0.5;
                    const cy = div.y + sinA * offset * side * 0.5;
                    const childRadius = scaledRadius * childScale * 0.75;

                    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, childRadius);
                    gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.15)`);
                    gradient.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, 0.25)`);
                    gradient.addColorStop(0.85, `rgba(${cr}, ${cg}, ${cb}, 0.35)`);
                    gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0.05)`);

                    ctx.beginPath();
                    ctx.arc(cx, cy, childRadius, 0, TAU);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    // Nucleus.
                    ctx.beginPath();
                    ctx.arc(cx, cy, childRadius * 0.25, 0, TAU);
                    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.6)`;
                    ctx.fill();
                }

                // Connection bridge that fades during split.
                if (splitProgress < 0.7) {
                    const bridgeAlpha = (1 - splitProgress / 0.7) * 0.2;
                    const bx1 = div.x + cosA * offset * -0.3;
                    const by1 = div.y + sinA * offset * -0.3;
                    const bx2 = div.x + cosA * offset * 0.3;
                    const by2 = div.y + sinA * offset * 0.3;

                    ctx.beginPath();
                    ctx.moveTo(bx1, by1);
                    ctx.lineTo(bx2, by2);
                    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${bridgeAlpha})`;
                    ctx.lineWidth = scaledRadius * 0.3 * (1 - splitProgress);
                    ctx.stroke();
                }
            }
        }

        // Draw living cells.
        for (const cell of this.#cells) {
            const [cr, cg, cb] = cell.color;
            const scaledRadius = cell.radius * this.#scale;
            const energyAlpha = Math.max(0.1, Math.min(1, cell.energy));

            // Outer membrane (translucent circle).
            const gradient = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, scaledRadius);
            gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${0.12 * energyAlpha})`);
            gradient.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, ${0.2 * energyAlpha})`);
            gradient.addColorStop(0.8, `rgba(${cr}, ${cg}, ${cb}, ${0.3 * energyAlpha})`);
            gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, ${0.05 * energyAlpha})`);

            ctx.beginPath();
            ctx.arc(cell.x, cell.y, scaledRadius, 0, TAU);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Membrane outline.
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, scaledRadius, 0, TAU);
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.25 * energyAlpha})`;
            ctx.lineWidth = this.#scale;
            ctx.stroke();

            // Nucleus dot.
            const wobbleX = Math.sin(this.#time * 3 + cell.x * 0.1) * scaledRadius * 0.1;
            const wobbleY = Math.cos(this.#time * 2.5 + cell.y * 0.1) * scaledRadius * 0.1;

            ctx.beginPath();
            ctx.arc(cell.x + wobbleX, cell.y + wobbleY, scaledRadius * 0.22, 0, TAU);
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.55 * energyAlpha})`;
            ctx.fill();
        }
    }

    #createCell(px: number, py: number): Cell {
        const colorIndex = Math.floor(MULBERRY.next() * this.#colorsRGB.length);

        return {
            x: px,
            y: py,
            vx: (MULBERRY.next() - 0.5) * 0.5,
            vy: (MULBERRY.next() - 0.5) * 0.5,
            radius: MIN_CELL_RADIUS + MULBERRY.next() * (MAX_CELL_RADIUS - MIN_CELL_RADIUS) * 0.6,
            color: this.#colorsRGB[colorIndex],
            energy: 0.6 + MULBERRY.next() * 0.8,
            divideTimer: MULBERRY.next() * 0.5
        };
    }

    #createFood(width: number, height: number): FoodParticle {
        const colorIndex = Math.floor(MULBERRY.next() * this.#colorsRGB.length);
        const [cr, cg, cb] = this.#colorsRGB[colorIndex];

        return {
            x: MULBERRY.next() * width,
            y: MULBERRY.next() * height,
            radius: 1.5 + MULBERRY.next() * 2,
            color: [
                Math.min(255, cr + 60),
                Math.min(255, cg + 60),
                Math.min(255, cb + 60)
            ],
            opacity: 0.4 + MULBERRY.next() * 0.4
        };
    }
}
