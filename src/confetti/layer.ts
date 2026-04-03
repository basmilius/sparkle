import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { DEFAULT_CONFIG, MULBERRY, PALETTES } from './consts';
import { SHAPE_PATHS } from './shapes';
import type { Config, Particle, ParticleConfig } from './types';

const TWO_PI = Math.PI * 2;

export interface ConfettiConfig {
    readonly scale?: number;
}

export class Confetti extends Effect<ConfettiConfig> {
    readonly #scale: number;
    #particles: Particle[] = [];
    #width: number = 0;
    #height: number = 0;
    #isFiring: boolean = false;

    constructor(config: ConfettiConfig = {}) {
        super();
        this.#scale = config.scale ?? 1;
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
    }

    burst(config: Partial<Config>): void {
        const width = this.#width;
        const height = this.#height;

        const resolved = {...DEFAULT_CONFIG, ...config};
        const colors = config.colors ?? PALETTES[resolved.palette];
        const {angle, decay, gravity, shapes, spread, startVelocity, ticks, x, y} = resolved;
        const numberOfParticles = Math.max(1, resolved.particles);

        for (let i = 0; i < numberOfParticles; i++) {
            const particle = this.#createParticle({
                angle,
                color: hexToRGB(colors[Math.floor(MULBERRY.next() * colors.length)]),
                decay,
                gravity: gravity * this.#scale,
                shape: shapes[Math.floor(MULBERRY.next() * shapes.length)],
                spread,
                startVelocity: startVelocity * this.#scale,
                ticks,
                x: width * x,
                y: height * y
            });

            this.#tickParticle(particle);
            this.#particles.push(particle);
        }

        this.#isFiring = true;
    }

    get hasParticles(): boolean {
        return this.#particles.length > 0;
    }

    tick(dt: number, _width: number, _height: number): void {
        const particles = this.#particles;
        let alive = 0;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.tick < p.totalTicks) {
                this.#tickParticle(p, dt);

                if (p.tick < p.totalTicks) {
                    particles[alive++] = p;
                }
            }
        }

        particles.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

        const particles = this.#particles;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const flipCos = Math.cos(p.flipAngle);
            const size = p.size;

            ctx.save();
            ctx.transform(
                p.rotCos * flipCos * size,
                p.rotSin * flipCos * size,
                -p.rotSin * size,
                p.rotCos * size,
                p.x,
                p.y
            );
            ctx.globalAlpha = 1 - p.tick / p.totalTicks;
            ctx.fillStyle = p.colorStr;
            ctx.fill(SHAPE_PATHS[p.shape]);
            ctx.restore();
        }

        ctx.globalAlpha = 1;
    }

    #createParticle(config: ParticleConfig): Particle {
        const launchAngle = -(config.angle * Math.PI / 180)
            + (0.5 * config.spread * Math.PI / 180)
            - (MULBERRY.next() * config.spread * Math.PI / 180);

        const speed = config.startVelocity * (0.5 + MULBERRY.next());
        const rotAngle = MULBERRY.next() * TWO_PI;

        return {
            colorStr: `rgb(${config.color[0]}, ${config.color[1]}, ${config.color[2]})`,
            decay: config.decay - 0.05 + MULBERRY.next() * 0.1,
            flipAngle: MULBERRY.next() * TWO_PI,
            flipSpeed: 0.03 + MULBERRY.next() * 0.05,
            gravity: config.gravity,
            rotAngle,
            rotCos: Math.cos(rotAngle),
            rotSin: Math.sin(rotAngle),
            rotSpeed: (MULBERRY.next() - 0.5) * 0.06,
            shape: config.shape,
            size: (5 + MULBERRY.next() * 5) * this.#scale,
            swing: MULBERRY.next() * TWO_PI,
            swingAmp: 0.5 + MULBERRY.next() * 1.5,
            swingSpeed: 0.025 + MULBERRY.next() * 0.035,
            tick: 0,
            totalTicks: config.ticks,
            vx: Math.cos(launchAngle) * speed,
            vy: Math.sin(launchAngle) * speed,
            x: config.x,
            y: config.y
        };
    }

    #tickParticle(particle: Particle, dt: number = 1): void {
        const decayFactor = Math.pow(particle.decay, dt);
        particle.vx *= decayFactor;
        particle.vy *= decayFactor;
        particle.vy += particle.gravity * 0.35 * dt;
        particle.swing += particle.swingSpeed * dt;
        particle.x += (particle.vx + particle.swingAmp * Math.cos(particle.swing)) * dt;
        particle.y += particle.vy * dt;
        particle.rotAngle += particle.rotSpeed * dt;
        particle.rotCos = Math.cos(particle.rotAngle);
        particle.rotSin = Math.sin(particle.rotAngle);
        particle.flipAngle += particle.flipSpeed * dt;
        particle.tick += dt;
    }
}
