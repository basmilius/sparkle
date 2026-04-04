import { isSmallScreen } from '../mobile';
import { p3, p3a, parseColor } from '../color';
import { Effect } from '../effect';
import { SpatialGrid } from '../grid';
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
    #scale: number;
    #speed: number;
    #separation: number;
    #alignment: number;
    #cohesion: number;
    #colorR: number;
    #colorG: number;
    #colorB: number;
    #size: number;
    readonly #count: number;
    #boids: Boid[] = [];
    #grid: SpatialGrid<Boid> = new SpatialGrid(PERCEPTION_RADIUS);
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
        if (config.color !== undefined) {
            const parsed = parseColor(config.color);
            this.#colorR = parsed.r;
            this.#colorG = parsed.g;
            this.#colorB = parsed.b;
        }
        if (config.size !== undefined) {
            this.#size = config.size * this.#scale;
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
            this.#boids = [];
            const count = isSmallScreen() ? Math.floor(this.#count / 2) : this.#count;
            for (let i = 0; i < count; i++) {
                this.#boids.push(this.#createBoid());
            }
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        this.#grid.setWidth(width);
        this.#grid.clear();

        for (const boid of this.#boids) {
            this.#grid.insert(boid.x, boid.y, boid);
        }

        const speedFactor = this.#speed * dt / 16;
        const maxSpeed = MAX_SPEED * this.#speed;
        const maxForce = MAX_FORCE * this.#speed;
        const perceptionR2 = PERCEPTION_RADIUS * PERCEPTION_RADIUS;
        const separationR2 = SEPARATION_RADIUS * SEPARATION_RADIUS;

        for (const boid of this.#boids) {
            let sepX = 0, sepY = 0, sepCount = 0;
            let alignVX = 0, alignVY = 0, alignCount = 0;
            let cohX = 0, cohY = 0, cohCount = 0;

            this.#grid.query(boid.x, boid.y, (other) => {
                if (other === boid) {
                    return;
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
            });

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

            if (boid.x < -10) {
                boid.x += width + 10;
            }
            if (boid.x > width + 10) {
                boid.x -= width + 10;
            }
            if (boid.y < -10) {
                boid.y += height + 10;
            }
            if (boid.y > height + 10) {
                boid.y -= height + 10;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        const r = this.#colorR;
        const g = this.#colorG;
        const b = this.#colorB;

        ctx.lineWidth = 0.5 * this.#scale;

        // Sort back-to-front by depth for correct layering.
        const sorted = this.#boids.slice().sort((a, b) => a.depth - b.depth);
        const base = ctx.getTransform();

        for (const boid of sorted) {
            const cos = Math.cos(boid.angle);
            const sin = Math.sin(boid.angle);
            const scaledSize = this.#size * boid.depth;

            ctx.globalAlpha = 0.3 + boid.depth * 0.7;
            ctx.fillStyle = p3(r, g, b);
            ctx.strokeStyle = p3a(r, g, b, 0.4);

            ctx.setTransform(
                base.a * cos + base.c * sin,
                base.b * cos + base.d * sin,
                base.a * -sin + base.c * cos,
                base.b * -sin + base.d * cos,
                base.a * boid.x + base.c * boid.y + base.e,
                base.b * boid.x + base.d * boid.y + base.f
            );

            ctx.beginPath();
            ctx.moveTo(scaledSize, 0);
            ctx.lineTo(-scaledSize * 0.6, -scaledSize * 0.45);
            ctx.lineTo(-scaledSize * 0.3, 0);
            ctx.lineTo(-scaledSize * 0.6, scaledSize * 0.45);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            const hr = Math.min(255, r + 80);
            const hg = Math.min(255, g + 80);
            const hb = Math.min(255, b + 80);
            ctx.globalAlpha = (0.3 + boid.depth * 0.7) * 0.4;
            ctx.fillStyle = p3(hr, hg, hb);
            ctx.beginPath();
            ctx.moveTo(scaledSize, 0);
            ctx.lineTo(-scaledSize * 0.1, -scaledSize * 0.15);
            ctx.lineTo(-scaledSize * 0.1, scaledSize * 0.15);
            ctx.closePath();
            ctx.fill();
        }

        ctx.setTransform(base);
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
            angle,
            depth: 0.35 + MULBERRY.next() * 0.65
        };
    }
}
