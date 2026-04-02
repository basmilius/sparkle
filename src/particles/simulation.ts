import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { NetworkParticle, ParticleMouseMode } from './types';

export interface ParticleSimulationConfig {
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
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class ParticleSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #connectionDistance: number;
    readonly #lineWidth: number;
    readonly #mouseMode: ParticleMouseMode;
    readonly #mouseRadius: number;
    readonly #mouseStrength: number;
    readonly #particleForces: boolean;
    readonly #glow: boolean;
    readonly #background: string | null;
    readonly #colorRGB: [number, number, number];
    readonly #lineColorRGB: [number, number, number];
    readonly #sizeRange: [number, number];
    readonly #speedRange: [number, number];
    readonly #onMouseMoveBound: (evt: MouseEvent) => void;
    readonly #onMouseLeaveBound: () => void;
    #maxCount: number;
    #mouseX: number = -1;
    #mouseY: number = -1;
    #mouseOnCanvas: boolean = false;
    #particles: NetworkParticle[] = [];
    #grid: Map<string, number[]> = new Map();
    #cellSize: number;

    constructor(canvas: HTMLCanvasElement, config: ParticleSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 100;
        this.#connectionDistance = (config.connectionDistance ?? 120) * this.#scale;
        this.#lineWidth = config.lineWidth ?? 0.5;
        this.#mouseMode = config.mouseMode ?? 'connect';
        this.#mouseRadius = (config.mouseRadius ?? 150) * this.#scale;
        this.#mouseStrength = config.mouseStrength ?? 0.03;
        this.#particleForces = config.particleForces ?? false;
        this.#glow = config.glow ?? false;
        this.#background = config.background ?? null;
        this.#cellSize = this.#connectionDistance;

        this.#colorRGB = hexToRGB(config.color ?? '#6366f1');
        this.#lineColorRGB = hexToRGB(config.lineColor ?? '#6366f1');

        this.#sizeRange = config.size ?? [1, 3];
        this.#speedRange = config.speed ?? [0.2, 0.8];

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        this.#onMouseMoveBound = this.#onMouseMove.bind(this);
        this.#onMouseLeaveBound = this.#onMouseLeave.bind(this);

        if (this.#mouseMode !== 'none') {
            this.canvas.addEventListener('mousemove', this.#onMouseMoveBound, {passive: true});
            this.canvas.addEventListener('mouseleave', this.#onMouseLeaveBound, {passive: true});
        }
    }

    start(): void {
        super.start();

        this.#particles = [];

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#particles.push(this.#createParticle(this.#sizeRange, this.#speedRange));
        }
    }

    destroy(): void {
        this.canvas.removeEventListener('mousemove', this.#onMouseMoveBound);
        this.canvas.removeEventListener('mouseleave', this.#onMouseLeaveBound);
        super.destroy();
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;

        if (this.#background) {
            ctx.fillStyle = this.#background;
            ctx.fillRect(0, 0, this.width, this.height);
        } else {
            ctx.clearRect(0, 0, this.width, this.height);
        }

        const [lr, lg, lb] = this.#lineColorRGB;
        const [pr, pg, pb] = this.#colorRGB;
        const connDist = this.#connectionDistance;

        // Connection lines
        ctx.lineWidth = this.#lineWidth;

        const drawn = new Set<string>();

        for (let i = 0; i < this.#particles.length; i++) {
            const pa = this.#particles[i];
            const col = Math.floor(pa.x / this.#cellSize);
            const row = Math.floor(pa.y / this.#cellSize);

            for (let dc = -1; dc <= 1; dc++) {
                for (let dr = -1; dr <= 1; dr++) {
                    const key = `${col + dc},${row + dr}`;
                    const neighbors = this.#grid.get(key);

                    if (!neighbors) {
                        continue;
                    }

                    for (const j of neighbors) {
                        if (j <= i) {
                            continue;
                        }

                        const pairKey = `${i},${j}`;

                        if (drawn.has(pairKey)) {
                            continue;
                        }

                        drawn.add(pairKey);

                        const pb2 = this.#particles[j];
                        const dx = pa.x - pb2.x;
                        const dy = pa.y - pb2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < connDist) {
                            const alpha = 1 - dist / connDist;
                            ctx.beginPath();
                            ctx.moveTo(pa.x, pa.y);
                            ctx.lineTo(pb2.x, pb2.y);
                            ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha * 0.6})`;
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        // Mouse connections
        if (this.#mouseOnCanvas && this.#mouseMode === 'connect') {
            for (const particle of this.#particles) {
                const dx = particle.x - this.#mouseX;
                const dy = particle.y - this.#mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.#mouseRadius) {
                    const alpha = 1 - dist / this.#mouseRadius;
                    ctx.beginPath();
                    ctx.moveTo(this.#mouseX, this.#mouseY);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha * 0.8})`;
                    ctx.stroke();
                }
            }
        }

        // Particles
        if (this.#glow) {
            ctx.shadowColor = `rgb(${pr}, ${pg}, ${pb})`;
            ctx.shadowBlur = 8 * this.#scale;
        }

        for (const particle of this.#particles) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius * this.#scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${pr}, ${pg}, ${pb})`;
            ctx.fill();
        }

        if (this.#glow) {
            ctx.shadowBlur = 0;
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        // Rebuild spatial grid
        this.#grid.clear();

        for (let i = 0; i < this.#particles.length; i++) {
            const particle = this.#particles[i];
            const col = Math.floor(particle.x / this.#cellSize);
            const row = Math.floor(particle.y / this.#cellSize);
            const key = `${col},${row}`;
            const cell = this.#grid.get(key);

            if (cell) {
                cell.push(i);
            } else {
                this.#grid.set(key, [i]);
            }
        }

        // Update particles
        for (const particle of this.#particles) {
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;

            // Soft bounce off edges
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx = Math.abs(particle.vx);
            } else if (particle.x > this.width) {
                particle.x = this.width;
                particle.vx = -Math.abs(particle.vx);
            }

            if (particle.y < 0) {
                particle.y = 0;
                particle.vy = Math.abs(particle.vy);
            } else if (particle.y > this.height) {
                particle.y = this.height;
                particle.vy = -Math.abs(particle.vy);
            }
        }

        // Mouse forces
        if (this.#mouseOnCanvas && (this.#mouseMode === 'attract' || this.#mouseMode === 'repel')) {
            const direction = this.#mouseMode === 'attract' ? -1 : 1;

            for (const particle of this.#particles) {
                const dx = particle.x - this.#mouseX;
                const dy = particle.y - this.#mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.#mouseRadius && dist > 0) {
                    const force = (1 - dist / this.#mouseRadius) * this.#mouseStrength * dt;
                    particle.vx += (dx / dist) * force * direction * 100;
                    particle.vy += (dy / dist) * force * direction * 100;
                }
            }
        }

        // Inter-particle repulsion
        if (this.#particleForces) {
            const repelDist = 30 * this.#scale;

            for (let i = 0; i < this.#particles.length; i++) {
                const pa = this.#particles[i];
                const col = Math.floor(pa.x / this.#cellSize);
                const row = Math.floor(pa.y / this.#cellSize);

                for (let dc = -1; dc <= 1; dc++) {
                    for (let dr = -1; dr <= 1; dr++) {
                        const key = `${col + dc},${row + dr}`;
                        const neighbors = this.#grid.get(key);

                        if (!neighbors) {
                            continue;
                        }

                        for (const j of neighbors) {
                            if (j <= i) {
                                continue;
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
                        }
                    }
                }
            }
        }

        // Speed damping
        for (const particle of this.#particles) {
            const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);

            if (currentSpeed > particle.baseSpeed) {
                const damping = Math.pow(0.98, dt);
                particle.vx *= damping;
                particle.vy *= damping;
            }
        }
    }

    #onMouseMove(evt: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this.#mouseX = evt.clientX - rect.left;
        this.#mouseY = evt.clientY - rect.top;
        this.#mouseOnCanvas = true;
    }

    #onMouseLeave(): void {
        this.#mouseOnCanvas = false;
    }

    #createParticle(sizeRange: [number, number], speedRange: [number, number]): NetworkParticle {
        const angle = MULBERRY.next() * Math.PI * 2;
        const speed = speedRange[0] + MULBERRY.next() * (speedRange[1] - speedRange[0]);

        return {
            x: MULBERRY.next() * this.width,
            y: MULBERRY.next() * this.height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: sizeRange[0] + MULBERRY.next() * (sizeRange[1] - sizeRange[0]),
            baseSpeed: speed
        };
    }
}
