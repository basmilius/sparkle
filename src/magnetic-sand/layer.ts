import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { SandGrain } from './types';

const TAU = Math.PI * 2;

export interface MagneticSandConfig {
    readonly speed?: number;
    readonly count?: number;
    readonly color?: string;
    readonly magnetStrength?: number;
    readonly scale?: number;
}

export class MagneticSand extends Effect<MagneticSandConfig> {
    readonly #scale: number;
    readonly #colorRGB: [number, number, number];
    readonly #onMouseMoveBound: (evt: MouseEvent) => void;
    readonly #onMouseLeaveBound: () => void;
    #speed: number;
    #magnetStrength: number;
    #maxCount: number;
    #grains: SandGrain[] = [];
    #mouseX: number = -1;
    #mouseY: number = -1;
    #mouseOnCanvas: boolean = false;
    #time: number = 0;
    #width: number = 0;
    #height: number = 0;

    constructor(config: MagneticSandConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#magnetStrength = config.magnetStrength ?? 0.5;
        this.#maxCount = config.count ?? 600;
        this.#colorRGB = hexToRGB(config.color ?? '#888888');

        if (innerWidth < 991) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        this.#onMouseMoveBound = this.#onMouseMove.bind(this);
        this.#onMouseLeaveBound = this.#onMouseLeave.bind(this);
    }

    configure(config: Partial<MagneticSandConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.magnetStrength !== undefined) {
            this.#magnetStrength = config.magnetStrength;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        this.#grains = [];

        for (let idx = 0; idx < this.#maxCount; ++idx) {
            this.#grains.push(this.#createGrain(width, height));
        }
    }

    onMount(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('mousemove', this.#onMouseMoveBound, {passive: true});
        canvas.addEventListener('mouseleave', this.#onMouseLeaveBound, {passive: true});
    }

    onUnmount(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.#onMouseMoveBound);
        canvas.removeEventListener('mouseleave', this.#onMouseLeaveBound);
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#time += 0.01 * dt * this.#speed;

        const friction = Math.pow(0.92, dt);

        for (const grain of this.#grains) {
            if (this.#mouseOnCanvas) {
                const dx = this.#mouseX - grain.x;
                const dy = this.#mouseY - grain.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxRange = 300 * this.#scale;

                if (dist < maxRange && dist > 0) {
                    const normDx = dx / dist;
                    const normDy = dy / dist;

                    // Magnetic field lines create spikes — grains align along the
                    // radial direction but stop at a minimum distance, forming ridges.
                    const influence = (1 - dist / maxRange) * this.#magnetStrength;
                    const targetDist = 20 * this.#scale + (1 - influence) * 80 * this.#scale;

                    // Add angular clustering to create spike-like ridges along field lines.
                    const angle = Math.atan2(dy, dx);
                    const spikeCount = 8;
                    const spikeAngle = Math.round(angle / (TAU / spikeCount)) * (TAU / spikeCount);
                    const angleDiff = angle - spikeAngle;
                    const spikeAttraction = Math.exp(-angleDiff * angleDiff * 20) * influence;

                    if (dist > targetDist) {
                        const pullStrength = influence * 2.5 * dt * this.#speed;
                        grain.vx += normDx * pullStrength * (1 + spikeAttraction * 2);
                        grain.vy += normDy * pullStrength * (1 + spikeAttraction * 2);
                    } else {
                        // Repel when too close to maintain spike structure.
                        const pushStrength = (1 - dist / targetDist) * 1.5 * dt * this.#speed;
                        grain.vx -= normDx * pushStrength;
                        grain.vy -= normDy * pushStrength;
                    }

                    // Lateral force to align grains into spike ridges.
                    const lateralAngle = spikeAngle + Math.PI / 2;
                    const lateralForce = Math.sin(angleDiff * spikeCount) * influence * 0.8 * dt * this.#speed;
                    grain.vx += Math.cos(lateralAngle) * lateralForce;
                    grain.vy += Math.sin(lateralAngle) * lateralForce;
                }
            } else {
                // Without mouse: gentle dune-like settling motion.
                const duneWave = Math.sin(grain.originX * 0.01 + this.#time) * 0.3;
                const targetY = grain.originY + duneWave * 10 * this.#scale;
                const targetX = grain.originX + Math.sin(this.#time * 0.5 + grain.phase) * 2 * this.#scale;

                grain.vx += (targetX - grain.x) * 0.02 * dt * this.#speed;
                grain.vy += (targetY - grain.y) * 0.02 * dt * this.#speed;
            }

            grain.vx *= friction;
            grain.vy *= friction;

            grain.x += grain.vx * dt;
            grain.y += grain.vy * dt;

            // Keep grains within bounds.
            if (grain.x < 0) {
                grain.x = 0;
                grain.vx = Math.abs(grain.vx) * 0.5;
            } else if (grain.x > width) {
                grain.x = width;
                grain.vx = -Math.abs(grain.vx) * 0.5;
            }

            if (grain.y < 0) {
                grain.y = 0;
                grain.vy = Math.abs(grain.vy) * 0.5;
            } else if (grain.y > height) {
                grain.y = height;
                grain.vy = -Math.abs(grain.vy) * 0.5;
            }

            // Update opacity based on velocity for a subtle shimmer.
            const speed = Math.sqrt(grain.vx * grain.vx + grain.vy * grain.vy);
            grain.opacity = 0.5 + Math.min(speed * 0.1, 0.5);
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        const [cr, cg, cb] = this.#colorRGB;

        for (const grain of this.#grains) {
            const radius = grain.size * this.#scale;

            ctx.globalAlpha = grain.opacity;
            ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
            ctx.beginPath();
            ctx.arc(grain.x, grain.y, radius, 0, TAU);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    #onMouseMove(evt: MouseEvent): void {
        const target = evt.currentTarget as HTMLCanvasElement;
        const rect = target.getBoundingClientRect();
        this.#mouseX = evt.clientX - rect.left;
        this.#mouseY = evt.clientY - rect.top;
        this.#mouseOnCanvas = true;
    }

    #onMouseLeave(): void {
        this.#mouseOnCanvas = false;
    }

    #createGrain(width: number, height: number): SandGrain {
        const px = MULBERRY.next() * width;
        const py = MULBERRY.next() * height;

        return {
            x: px,
            y: py,
            originX: px,
            originY: py,
            vx: 0,
            vy: 0,
            size: 0.8 + MULBERRY.next() * 1.2,
            opacity: 0.4 + MULBERRY.next() * 0.4,
            phase: MULBERRY.next() * TAU
        };
    }
}
