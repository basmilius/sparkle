import { parseColor } from '../color';
import { Effect } from '../effect';
import { MAX_FORCE, MAX_SPEED, MULBERRY, PERCEPTION_RADIUS, SEPARATION_RADIUS } from './consts';
import type { Boid } from './types';

export interface BoidsConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly separation?: number;
    readonly alignment?: number;
    readonly cohesion?: number;
    readonly color?: string;
    readonly size?: number;
    readonly scale?: number;
}

export class Boids extends Effect<BoidsConfig> {
    readonly #scale: number;
    #speed: number;
    #separation: number;
    #alignment: number;
    #cohesion: number;
    readonly #colorR: number;
    readonly #colorG: number;
    readonly #colorB: number;
    readonly #size: number;
    readonly #count: number;
    #boids: Boid[] = [];
    #width: number = 800;
    #height: number = 600;
    #initialized: boolean = false;

    constructor(config: BoidsConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#separation = config.separation ?? 1;
        this.#alignment = config.alignment ?? 1;
        this.#cohesion = config.cohesion ?? 1;
        this.#size = (config.size ?? 6) * this.#scale;
        this.#count = config.count ?? 80;

        const parsed = parseColor(config.color ?? '#44aaff');
        this.#colorR = parsed.r;
        this.#colorG = parsed.g;
        this.#colorB = parsed.b;
    }

    configure(config: Partial<BoidsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.separation !== undefined) {
            this.#separation = config.separation;
        }
        if (config.alignment !== undefined) {
            this.#alignment = config.alignment;
        }
        if (config.cohesion !== undefined) {
            this.#cohesion = config.cohesion;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized && width > 0 && height > 0) {
            this.#initialized = true;
            this.#boids = [];
            const count = innerWidth < 991 ? Math.floor(this.#count / 2) : this.#count;
            for (let i = 0; i < count; i++) {
                this.#boids.push(this.#createBoid());
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        const cellSize = PERCEPTION_RADIUS;
        const grid = new Map<string, Boid[]>();

        for (const boid of this.#boids) {
            const cellX = Math.floor(boid.x / cellSize);
            const cellY = Math.floor(boid.y / cellSize);
            const key = `${cellX},${cellY}`;
            let cell = grid.get(key);
            if (!cell) {
                cell = [];
                grid.set(key, cell);
            }
            cell.push(boid);
        }

        const speedFactor = this.#speed * dt / 16;
        const maxSpeed = MAX_SPEED * this.#speed;
        const maxForce = MAX_FORCE * this.#speed;
        const perceptionR2 = PERCEPTION_RADIUS * PERCEPTION_RADIUS;
        const separationR2 = SEPARATION_RADIUS * SEPARATION_RADIUS;

        for (const boid of this.#boids) {
            const cellX = Math.floor(boid.x / cellSize);
            const cellY = Math.floor(boid.y / cellSize);

            let sepX = 0, sepY = 0, sepCount = 0;
            let alignVX = 0, alignVY = 0, alignCount = 0;
            let cohX = 0, cohY = 0, cohCount = 0;

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const neighbors = grid.get(`${cellX + dx},${cellY + dy}`);
                    if (!neighbors) {
                        continue;
                    }

                    for (const other of neighbors) {
                        if (other === boid) {
                            continue;
                        }

                        const diffX = boid.x - other.x;
                        const diffY = boid.y - other.y;
                        const dist2 = diffX * diffX + diffY * diffY;

                        if (dist2 < perceptionR2) {
                            alignVX += other.vx;
                            alignVY += other.vy;
                            alignCount++;

                            cohX += other.x;
                            cohY += other.y;
                            cohCount++;
                        }

                        if (dist2 < separationR2 && dist2 > 0) {
                            const dist = Math.sqrt(dist2);
                            sepX += diffX / dist;
                            sepY += diffY / dist;
                            sepCount++;
                        }
                    }
                }
            }

            let forceX = 0;
            let forceY = 0;

            if (sepCount > 0) {
                const fx = sepX / sepCount;
                const fy = sepY / sepCount;
                const len = Math.sqrt(fx * fx + fy * fy) || 1;
                forceX += (fx / len * maxSpeed - boid.vx) * maxForce * this.#separation;
                forceY += (fy / len * maxSpeed - boid.vy) * maxForce * this.#separation;
            }

            if (alignCount > 0) {
                const fx = alignVX / alignCount;
                const fy = alignVY / alignCount;
                const len = Math.sqrt(fx * fx + fy * fy) || 1;
                forceX += (fx / len * maxSpeed - boid.vx) * maxForce * this.#alignment;
                forceY += (fy / len * maxSpeed - boid.vy) * maxForce * this.#alignment;
            }

            if (cohCount > 0) {
                const targetX = cohX / cohCount;
                const targetY = cohY / cohCount;
                const diffX = targetX - boid.x;
                const diffY = targetY - boid.y;
                const len = Math.sqrt(diffX * diffX + diffY * diffY) || 1;
                forceX += (diffX / len * maxSpeed - boid.vx) * maxForce * this.#cohesion;
                forceY += (diffY / len * maxSpeed - boid.vy) * maxForce * this.#cohesion;
            }

            boid.vx += forceX * speedFactor;
            boid.vy += forceY * speedFactor;

            const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
            if (speed > maxSpeed) {
                boid.vx = (boid.vx / speed) * maxSpeed;
                boid.vy = (boid.vy / speed) * maxSpeed;
            } else if (speed < 0.5) {
                boid.vx += (MULBERRY.next() - 0.5) * 0.2;
                boid.vy += (MULBERRY.next() - 0.5) * 0.2;
            }

            boid.x += boid.vx * speedFactor;
            boid.y += boid.vy * speedFactor;

            boid.angle = Math.atan2(boid.vy, boid.vx);

            if (boid.x < -10) { boid.x += width + 10; }
            if (boid.x > width + 10) { boid.x -= width + 10; }
            if (boid.y < -10) { boid.y += height + 10; }
            if (boid.y > height + 10) { boid.y -= height + 10; }
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        const size = this.#size;
        const r = this.#colorR;
        const g = this.#colorG;
        const b = this.#colorB;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
        ctx.lineWidth = 0.5;

        for (const boid of this.#boids) {
            const cos = Math.cos(boid.angle);
            const sin = Math.sin(boid.angle);

            ctx.save();
            ctx.transform(cos, sin, -sin, cos, boid.x, boid.y);

            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(-size * 0.6, -size * 0.45);
            ctx.lineTo(-size * 0.3, 0);
            ctx.lineTo(-size * 0.6, size * 0.45);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }

        ctx.globalAlpha = 1;
    }

    #createBoid(): Boid {
        const angle = MULBERRY.next() * Math.PI * 2;
        const speed = (MAX_SPEED * 0.5) + MULBERRY.next() * MAX_SPEED * 0.5;

        return {
            x: MULBERRY.next() * this.#width,
            y: MULBERRY.next() * this.#height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            angle
        };
    }
}
