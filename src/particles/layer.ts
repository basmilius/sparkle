import { mobileCount } from '../mobile';
import { p3, p3a } from '../color';
import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { SpatialGrid } from '../grid';
import { MouseTracker } from '../mouse';
import { MULBERRY } from './consts';
import type { NetworkParticle, ParticleMouseMode } from './types';

export interface ParticlesConfig {
    readonly count?: number;
    readonly color?: string;
    readonly lineColor?: string;
    readonly size?: [number, number];
    readonly speed?: [number, number];
    readonly connectionDistance?: number;
    readonly lineWidth?: number;
    readonly mouseMode?: ParticleMouseMode;
    readonly mouseRadius?: number;
    readonly mouseStrength?: number;
    readonly particleForces?: boolean;
    readonly glow?: boolean;
    readonly background?: string | null;
    readonly scale?: number;
}

export class Particles extends Effect<ParticlesConfig> {
    #scale: number;
    #connectionDistance: number;
    #lineWidth: number;
    #mouseMode: ParticleMouseMode;
    #mouseRadius: number;
    #mouseStrength: number;
    #particleForces: boolean;
    #glow: boolean;
    readonly #background: string | null;
    #colorRGB: [number, number, number];
    #lineColorRGB: [number, number, number];
    readonly #sizeRange: [number, number];
    readonly #speedRange: [number, number];
    readonly #mouse = new MouseTracker();
    #maxCount: number;
    #time: number = 0;
    #particles: NetworkParticle[] = [];
    readonly #grid: SpatialGrid<number>;
    #width: number = 960;
    #height: number = 540;
    #initialized: boolean = false;

    constructor(config: ParticlesConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 100;
        this.#connectionDistance = (config.connectionDistance ?? 120) * this.#scale;
        this.#lineWidth = (config.lineWidth ?? 0.5) * this.#scale;
        this.#mouseMode = config.mouseMode ?? 'connect';
        this.#mouseRadius = (config.mouseRadius ?? 150) * this.#scale;
        this.#mouseStrength = config.mouseStrength ?? 0.03;
        this.#particleForces = config.particleForces ?? false;
        this.#glow = config.glow ?? false;
        this.#background = config.background ?? null;
        this.#grid = new SpatialGrid(this.#connectionDistance);

        this.#colorRGB = hexToRGB(config.color ?? '#6366f1');
        this.#lineColorRGB = hexToRGB(config.lineColor ?? '#6366f1');

        this.#sizeRange = config.size ?? [1, 3];
        this.#speedRange = config.speed ?? [0.2, 0.8];

        this.#maxCount = mobileCount(this.#maxCount);
    }

    configure(config: Partial<ParticlesConfig>): void {
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
        if (config.connectionDistance !== undefined) {
            this.#connectionDistance = config.connectionDistance * this.#scale;
        }
        if (config.lineWidth !== undefined) {
            this.#lineWidth = config.lineWidth * this.#scale;
        }
        if (config.mouseMode !== undefined) {
            this.#mouseMode = config.mouseMode;
        }
        if (config.mouseRadius !== undefined) {
            this.#mouseRadius = config.mouseRadius * this.#scale;
        }
        if (config.mouseStrength !== undefined) {
            this.#mouseStrength = config.mouseStrength;
        }
        if (config.particleForces !== undefined) {
            this.#particleForces = config.particleForces;
        }
        if (config.glow !== undefined) {
            this.#glow = config.glow;
        }
        if (config.color !== undefined) {
            this.#colorRGB = hexToRGB(config.color);
        }
        if (config.lineColor !== undefined) {
            this.#lineColorRGB = hexToRGB(config.lineColor);
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        if (!this.#initialized) {
            this.#initialized = true;
            this.#particles = [];

            for (let i = 0; i < this.#maxCount; ++i) {
                this.#particles.push(this.#createParticle(this.#sizeRange, this.#speedRange));
            }
        }
    }

    onMount(canvas: HTMLCanvasElement): void {
        if (this.#mouseMode !== 'none') {
            this.#mouse.attach(canvas);
        }
    }

    onUnmount(canvas: HTMLCanvasElement): void {
        this.#mouse.detach(canvas);
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#time += dt * 0.01;

        this.#grid.setWidth(width);
        this.#grid.clear();

        for (let i = 0; i < this.#particles.length; i++) {
            const particle = this.#particles[i];
            this.#grid.insert(particle.x, particle.y, i);
        }

        for (const particle of this.#particles) {
            const drift = Math.sin(this.#time * particle.driftFreq + particle.driftPhase) * particle.baseSpeed * 0.15;
            const driftPerp = Math.cos(this.#time * particle.driftFreq * 0.7 + particle.driftPhase + 1.3) * particle.baseSpeed * 0.1;
            particle.x += (particle.vx + drift) * dt;
            particle.y += (particle.vy + driftPerp) * dt;

            if (particle.x < 0) {
                particle.x = 0;
                particle.vx = Math.abs(particle.vx);
            } else if (particle.x > width) {
                particle.x = width;
                particle.vx = -Math.abs(particle.vx);
            }

            if (particle.y < 0) {
                particle.y = 0;
                particle.vy = Math.abs(particle.vy);
            } else if (particle.y > height) {
                particle.y = height;
                particle.vy = -Math.abs(particle.vy);
            }
        }

        if (this.#mouse.onCanvas && (this.#mouseMode === 'attract' || this.#mouseMode === 'repel')) {
            const direction = this.#mouseMode === 'attract' ? -1 : 1;

            for (const particle of this.#particles) {
                const dx = particle.x - this.#mouse.x;
                const dy = particle.y - this.#mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.#mouseRadius && dist > 0) {
                    const force = (1 - dist / this.#mouseRadius) * this.#mouseStrength * dt;
                    particle.vx += (dx / dist) * force * direction * 100;
                    particle.vy += (dy / dist) * force * direction * 100;
                }
            }
        }

        if (this.#particleForces) {
            const repelDist = 30 * this.#scale;

            for (let i = 0; i < this.#particles.length; i++) {
                const pa = this.#particles[i];

                this.#grid.query(pa.x, pa.y, (j) => {
                    if (j <= i) {
                        return;
                    }

                    const pb = this.#particles[j];
                    const dx = pa.x - pb.x;
                    const dy = pa.y - pb.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < repelDist && dist > 0) {
                        const force = (1 - dist / repelDist) * 0.5 * dt;
                        const nx = dx / dist;
                        const ny = dy / dist;
                        pa.vx += nx * force;
                        pa.vy += ny * force;
                        pb.vx -= nx * force;
                        pb.vy -= ny * force;
                    }
                });
            }
        }

        for (const particle of this.#particles) {
            const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);

            if (currentSpeed > particle.baseSpeed) {
                const damping = Math.pow(0.98, dt);
                particle.vx *= damping;
                particle.vy *= damping;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        if (this.#background) {
            ctx.fillStyle = this.#background;
            ctx.fillRect(0, 0, width, height);
        }

        const [lr, lg, lb] = this.#lineColorRGB;
        const [pr, pg, pb] = this.#colorRGB;
        const connDist = this.#connectionDistance;

        ctx.lineWidth = this.#lineWidth;

        for (let i = 0; i < this.#particles.length; i++) {
            const pa = this.#particles[i];

            this.#grid.query(pa.x, pa.y, (j) => {
                if (j <= i) {
                    return;
                }

                const pb2 = this.#particles[j];
                const dx = pa.x - pb2.x;
                const dy = pa.y - pb2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connDist) {
                    const alpha = 1 - dist / connDist;
                    ctx.beginPath();
                    ctx.moveTo(pa.x, pa.y);
                    ctx.lineTo(pb2.x, pb2.y);
                    ctx.strokeStyle = p3a(lr, lg, lb, alpha * 0.6);
                    ctx.stroke();
                }
            });
        }

        if (this.#mouse.onCanvas && this.#mouseMode === 'connect') {
            for (const particle of this.#particles) {
                const dx = particle.x - this.#mouse.x;
                const dy = particle.y - this.#mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.#mouseRadius) {
                    const alpha = 1 - dist / this.#mouseRadius;
                    ctx.beginPath();
                    ctx.moveTo(this.#mouse.x, this.#mouse.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.strokeStyle = p3a(lr, lg, lb, alpha * 0.8);
                    ctx.stroke();
                }
            }
        }

        if (this.#glow) {
            ctx.shadowColor = p3(pr, pg, pb);
            ctx.shadowBlur = 8 * this.#scale;
        }

        for (const particle of this.#particles) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius * this.#scale, 0, Math.PI * 2);
            ctx.fillStyle = p3(pr, pg, pb);
            ctx.fill();
        }

        if (this.#glow) {
            ctx.shadowBlur = 0;
        }
    }

    #createParticle(sizeRange: [number, number], speedRange: [number, number]): NetworkParticle {
        const angle = MULBERRY.next() * Math.PI * 2;
        const speed = speedRange[0] + MULBERRY.next() * (speedRange[1] - speedRange[0]);

        return {
            x: MULBERRY.next() * this.#width,
            y: MULBERRY.next() * this.#height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: sizeRange[0] + MULBERRY.next() * (sizeRange[1] - sizeRange[0]),
            baseSpeed: speed,
            driftPhase: MULBERRY.next() * Math.PI * 2,
            driftFreq: 0.5 + MULBERRY.next() * 1.5
        };
    }
}
