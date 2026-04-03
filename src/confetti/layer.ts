import { hexToRGB } from '@basmilius/utils';
import { SimulationLayer } from '../layer';
import { DEFAULT_CONFIG, MULBERRY, PALETTES } from './consts';
import type { ConfettiSimulationConfig } from './simulation';
import type { Config, Particle, ParticleConfig, Shape } from './types';

const TWO_PI = Math.PI * 2;

const SHAPE_PATHS: Record<Shape, Path2D> = {
    bowtie: (() => {
        const path = new Path2D();
        path.moveTo(-1, -0.7);
        path.lineTo(0, 0);
        path.lineTo(-1, 0.7);
        path.closePath();
        path.moveTo(1, -0.7);
        path.lineTo(0, 0);
        path.lineTo(1, 0.7);
        path.closePath();
        return path;
    })(),
    circle: (() => {
        const path = new Path2D();
        path.ellipse(0, 0, 0.6, 1, 0, 0, TWO_PI);
        return path;
    })(),
    crescent: (() => {
        const path = new Path2D();
        path.arc(0, 0, 1, 0, TWO_PI, false);
        path.arc(0.45, 0, 0.9, 0, TWO_PI, true);
        return path;
    })(),
    diamond: (() => {
        const path = new Path2D();
        path.moveTo(0, -1);
        path.lineTo(0.6, 0);
        path.lineTo(0, 1);
        path.lineTo(-0.6, 0);
        path.closePath();
        return path;
    })(),
    heart: (() => {
        const path = new Path2D();
        path.moveTo(0, 1);
        path.bezierCurveTo(-0.4, 0.55, -1, 0.1, -1, -0.35);
        path.bezierCurveTo(-1, -0.8, -0.5, -1, 0, -0.6);
        path.bezierCurveTo(0.5, -1, 1, -0.8, 1, -0.35);
        path.bezierCurveTo(1, 0.1, 0.4, 0.55, 0, 1);
        path.closePath();
        return path;
    })(),
    hexagon: (() => {
        const path = new Path2D();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI / 3) - Math.PI / 2;
            if (i === 0) {
                path.moveTo(Math.cos(angle), Math.sin(angle));
            } else {
                path.lineTo(Math.cos(angle), Math.sin(angle));
            }
        }
        path.closePath();
        return path;
    })(),
    ribbon: (() => {
        const path = new Path2D();
        path.rect(-0.2, -1, 0.4, 2);
        return path;
    })(),
    ring: (() => {
        const path = new Path2D();
        path.arc(0, 0, 1, 0, TWO_PI, false);
        path.arc(0, 0, 0.55, 0, TWO_PI, true);
        return path;
    })(),
    square: (() => {
        const path = new Path2D();
        path.rect(-0.7, -0.7, 1.4, 1.4);
        return path;
    })(),
    star: (() => {
        const path = new Path2D();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? 1 : 0.42;
            const angle = (i * Math.PI / 5) - Math.PI / 2;
            if (i === 0) {
                path.moveTo(r * Math.cos(angle), r * Math.sin(angle));
            } else {
                path.lineTo(r * Math.cos(angle), r * Math.sin(angle));
            }
        }
        path.closePath();
        return path;
    })(),
    triangle: (() => {
        const path = new Path2D();
        for (let i = 0; i < 3; i++) {
            const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
            if (i === 0) {
                path.moveTo(Math.cos(angle), Math.sin(angle));
            } else {
                path.lineTo(Math.cos(angle), Math.sin(angle));
            }
        }
        path.closePath();
        return path;
    })()
};

export class ConfettiLayer extends SimulationLayer {
    readonly #scale: number;
    #particles: Particle[] = [];
    #width: number = 0;
    #height: number = 0;
    #isFiring: boolean = false;

    constructor(config: ConfettiSimulationConfig = {}) {
        super();
        this.#scale = config.scale ?? 1;
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
    }

    fire(config: Partial<Config>): void {
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
                particles[alive++] = p;
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

            ctx.setTransform(
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
        }

        ctx.resetTransform();
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
