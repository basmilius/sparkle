import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { DEFAULT_CONFIG, MULBERRY } from './consts';
import type { Config, Particle, ParticleConfig, Shape } from './types';

const TWO_PI = Math.PI * 2;

// Precomputed unit-size (size=1) Path2D objects per shape.
// Size is encoded into the context transform, so each path is drawn once and reused every frame.
const SHAPE_PATHS: Record<Shape, Path2D> = {
    circle: (() => {
        const path = new Path2D();
        path.ellipse(0, 0, 0.6, 1, 0, 0, TWO_PI);
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
    ribbon: (() => {
        const path = new Path2D();
        path.rect(-0.2, -1, 0.4, 2);
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
            if (i === 0) path.moveTo(r * Math.cos(angle), r * Math.sin(angle));
            else path.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        path.closePath();
        return path;
    })(),
    triangle: (() => {
        const path = new Path2D();
        for (let i = 0; i < 3; i++) {
            const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
            if (i === 0) path.moveTo(Math.cos(angle), Math.sin(angle));
            else path.lineTo(Math.cos(angle), Math.sin(angle));
        }
        path.closePath();
        return path;
    })()
};

export class ConfettiSimulation extends LimitedFrameRateCanvas {

    #particles: Particle[] = [];

    constructor(canvas: HTMLCanvasElement, options: CanvasRenderingContext2DSettings = { colorSpace: 'display-p3' }) {
        super(canvas, 60, options);

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';
    }

    fire(config: Partial<Config>): void {
        this.onResize();
        this.draw();

        const resolved = { ...DEFAULT_CONFIG, ...config };
        const { angle, colors, decay, gravity, shapes, spread, startVelocity, ticks, x, y } = resolved;
        const numberOfParticles = Math.max(1, resolved.particles);

        for (let i = 0; i < numberOfParticles; i++) {
            const particle = this.#createParticle({
                angle,
                color: hexToRGB(colors[Math.floor(MULBERRY.next() * colors.length)]),
                decay,
                gravity,
                shape: shapes[Math.floor(MULBERRY.next() * shapes.length)],
                spread,
                startVelocity,
                ticks,
                x: this.width * x,
                y: this.height * y
            });

            this.#tickParticle(particle);
            this.#particles.push(particle);
        }

        if (!this.isTicking) {
            this.start();
        }
    }

    draw(): void {
        const { context, width, height } = this;
        context.clearRect(0, 0, width, height);

        const particles = this.#particles;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const flipCos = Math.cos(p.flipAngle);
            const size = p.size;

            // Encode translate + rotate + scale(flipCos, 1) + scale(size, size) in a single setTransform call,
            // avoiding save()/translate()/rotate()/scale()/restore() — 5 API calls replaced by 1.
            context.setTransform(
                p.rotCos * flipCos * size,
                p.rotSin * flipCos * size,
                -p.rotSin * size,
                p.rotCos * size,
                p.x,
                p.y
            );
            context.globalAlpha = 1 - p.tick / p.totalTicks;
            context.fillStyle = p.colorStr;
            context.fill(SHAPE_PATHS[p.shape]);
        }

        context.resetTransform();
    }

    tick(): void {
        const particles = this.#particles;
        let alive = 0;

        // Normalize to 60fps-equivalent units so physics is frame-rate independent.
        // dt ≈ 1.0 at 60fps, 0.5 at 120fps, 2.0 at 30fps.
        // Cap at 200ms to avoid large jumps after tab switches or dropped frames.
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        // Single pass: tick live particles and compact the array in-place.
        // Avoids filter() allocation and a separate forEach pass.
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.tick < p.totalTicks) {
                this.#tickParticle(p, dt);
                particles[alive++] = p;
            }
        }

        particles.length = alive;

        if (alive === 0) {
            this.stop();
        }
    }

    onResize(): void {
        super.onResize();
        this.canvas.width = this.width;
        this.canvas.height = this.height;
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
            size: 5 + MULBERRY.next() * 5,
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

    // dt defaults to 1 (60fps-equivalent) for the initial kick in fire() before the loop starts.
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
