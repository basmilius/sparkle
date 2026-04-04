import { isSmallScreen } from '../mobile';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { MurmurationBird } from './types';

const CELL_SIZE = 50;
const MAX_SPEED = 4;
const BOUNDARY_MARGIN = 0.1;

export interface MurmurationConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly cohesion?: number;
    readonly alignment?: number;
    readonly separation?: number;
    readonly turnRadius?: number;
    readonly color?: string;
    readonly scale?: number;
}

export class Murmuration extends Effect<MurmurationConfig> {
    readonly #scale: number;
    readonly #color: string;
    #speed: number;
    #cohesion: number;
    #alignment: number;
    #separation: number;
    #turnRadius: number;
    #maxCount: number;
    #time: number = 0;
    #birds: MurmurationBird[] = [];
    #grid: Map<number, MurmurationBird[]> = new Map();
    #width: number = 960;
    #height: number = 540;
    #gridCols: number = 0;

    constructor(config: MurmurationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#cohesion = config.cohesion ?? 0.5;
        this.#alignment = config.alignment ?? 0.8;
        this.#separation = config.separation ?? 0.4;
        this.#turnRadius = config.turnRadius ?? 0.7;
        this.#color = config.color ?? '#1a1a2e';
        this.#maxCount = config.count ?? 300;

        if (isSmallScreen()) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }
    }

    configure(config: Partial<MurmurationConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.cohesion !== undefined) {
            this.#cohesion = config.cohesion;
        }
        if (config.alignment !== undefined) {
            this.#alignment = config.alignment;
        }
        if (config.separation !== undefined) {
            this.#separation = config.separation;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#gridCols = Math.ceil(width / CELL_SIZE);

        this.#birds = [];

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#birds.push(this.#createBird());
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#gridCols = Math.ceil(width / CELL_SIZE);
        this.#time += 0.001 * this.#speed * dt;

        const dtFactor = dt / 16;
        const speedFactor = this.#speed * dtFactor;

        this.#buildGrid();

        const waveX = Math.sin(this.#time * 1.7) * width * 0.3 + width * 0.5;
        const waveForce = Math.sin(this.#time * 2.3) * 0.3 * this.#turnRadius;

        for (const bird of this.#birds) {
            let cohX = 0;
            let cohY = 0;
            let cohCount = 0;
            let aliVx = 0;
            let aliVy = 0;
            let aliCount = 0;
            let sepX = 0;
            let sepY = 0;

            const cellX = Math.floor(bird.x / CELL_SIZE);
            const cellY = Math.floor(bird.y / CELL_SIZE);

            for (let ox = -1; ox <= 1; ox++) {
                for (let oy = -1; oy <= 1; oy++) {
                    const key = (cellX + ox) + (cellY + oy) * this.#gridCols;
                    const cell = this.#grid.get(key);

                    if (!cell) {
                        continue;
                    }

                    for (const other of cell) {
                        if (other === bird) {
                            continue;
                        }

                        const dx = other.x - bird.x;
                        const dy = other.y - bird.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq > CELL_SIZE * CELL_SIZE) {
                            continue;
                        }

                        const dist = Math.sqrt(distSq);

                        cohX += other.x;
                        cohY += other.y;
                        cohCount++;

                        aliVx += other.vx;
                        aliVy += other.vy;
                        aliCount++;

                        if (dist < 15) {
                            const repel = 1 / (dist + 0.1);
                            sepX -= dx * repel;
                            sepY -= dy * repel;
                        }
                    }
                }
            }

            let ax = 0;
            let ay = 0;

            if (cohCount > 0) {
                const centerX = cohX / cohCount;
                const centerY = cohY / cohCount;
                ax += (centerX - bird.x) * this.#cohesion * 0.001;
                ay += (centerY - bird.y) * this.#cohesion * 0.001;
            }

            if (aliCount > 0) {
                const avgVx = aliVx / aliCount;
                const avgVy = aliVy / aliCount;
                ax += (avgVx - bird.vx) * this.#alignment * 0.05;
                ay += (avgVy - bird.vy) * this.#alignment * 0.05;
            }

            ax += sepX * this.#separation * 0.1;
            ay += sepY * this.#separation * 0.1;

            const waveDist = bird.x - waveX;
            const waveInfluence = Math.exp(-(waveDist * waveDist) / (width * width * 0.02));
            ay += waveForce * waveInfluence * speedFactor;

            const marginX = width * BOUNDARY_MARGIN;
            const marginY = height * BOUNDARY_MARGIN;

            if (bird.x < marginX) {
                ax += (marginX - bird.x) * 0.003;
            } else if (bird.x > width - marginX) {
                ax -= (bird.x - (width - marginX)) * 0.003;
            }

            if (bird.y < marginY) {
                ay += (marginY - bird.y) * 0.003;
            } else if (bird.y > height - marginY) {
                ay -= (bird.y - (height - marginY)) * 0.003;
            }

            bird.vx += ax * speedFactor;
            bird.vy += ay * speedFactor;

            const speed = Math.sqrt(bird.vx * bird.vx + bird.vy * bird.vy);

            if (speed > MAX_SPEED * this.#speed) {
                const ratio = (MAX_SPEED * this.#speed) / speed;
                bird.vx *= ratio;
                bird.vy *= ratio;
            } else if (speed < 0.5) {
                const ratio = 0.5 / (speed + 0.001);
                bird.vx *= ratio;
                bird.vy *= ratio;
            }

            bird.x += bird.vx * speedFactor;
            bird.y += bird.vy * speedFactor;

            if (bird.x < -20) {
                bird.x = width + 20;
            } else if (bird.x > width + 20) {
                bird.x = -20;
            }

            if (bird.y < -20) {
                bird.y = height + 20;
            } else if (bird.y > height + 20) {
                bird.y = -20;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillStyle = this.#color;

        for (const bird of this.#birds) {
            const angle = Math.atan2(bird.vy, bird.vx);
            const size = bird.size * this.#scale;

            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const tipX = bird.x + cos * size * 2;
            const tipY = bird.y + sin * size * 2;

            const leftX = bird.x + (-cos * size - sin * size);
            const leftY = bird.y + (-sin * size + cos * size);

            const rightX = bird.x + (-cos * size + sin * size);
            const rightY = bird.y + (-sin * size - cos * size);

            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(leftX, leftY);
            ctx.lineTo(bird.x - cos * size * 0.3, bird.y - sin * size * 0.3);
            ctx.lineTo(rightX, rightY);
            ctx.closePath();
            ctx.fill();
        }
    }

    #buildGrid(): void {
        this.#grid.clear();

        for (const bird of this.#birds) {
            const cellX = Math.floor(bird.x / CELL_SIZE);
            const cellY = Math.floor(bird.y / CELL_SIZE);
            const key = cellX + cellY * this.#gridCols;

            let cell = this.#grid.get(key);

            if (!cell) {
                cell = [];
                this.#grid.set(key, cell);
            }

            cell.push(bird);
        }
    }

    #createBird(): MurmurationBird {
        const angle = MULBERRY.next() * Math.PI * 2;
        const speed = 1 + MULBERRY.next() * 2;

        return {
            x: MULBERRY.next() * this.#width,
            y: MULBERRY.next() * this.#height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1.5 + MULBERRY.next() * 1.5
        };
    }
}
