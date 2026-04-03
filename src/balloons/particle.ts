import type { Point } from '../point';

export interface BalloonParticleConfig {
    readonly driftAmp?: number;
    readonly driftFreq?: number;
    readonly driftPhase?: number;
    readonly radiusX?: number;
    readonly radiusY?: number;
    readonly riseSpeed?: number;
    readonly rotationSpeed?: number;
    readonly scale?: number;
    readonly stringLength?: number;
}

export class BalloonParticle {
    readonly #color: [number, number, number];
    readonly #driftAmp: number;
    readonly #driftFreq: number;
    readonly #driftPhase: number;
    readonly #radiusX: number;
    readonly #radiusY: number;
    readonly #riseSpeed: number;
    readonly #rotationSpeed: number;
    readonly #scale: number;
    readonly #stringLength: number;
    #x: number;
    #y: number;
    #rotation: number = 0;
    #time: number = 0;

    get isDone(): boolean {
        return this.#y < -(this.#radiusY * 2 + this.#stringLength);
    }

    get position(): Point {
        return {x: this.#x, y: this.#y};
    }

    constructor(position: Point, color: [number, number, number], config: BalloonParticleConfig = {}) {
        this.#x = position.x;
        this.#y = position.y;
        this.#color = color;
        this.#driftAmp = config.driftAmp ?? (0.3 + Math.random() * 0.7);
        this.#driftFreq = config.driftFreq ?? (0.5 + Math.random() * 1);
        this.#driftPhase = config.driftPhase ?? (Math.random() * Math.PI * 2);
        this.#radiusX = (config.radiusX ?? (25 + Math.random() * 20)) * (config.scale ?? 1);
        this.#radiusY = (config.radiusY ?? (config.radiusX ? config.radiusX * (1 / 0.85) : 30 + Math.random() * 23)) * (config.scale ?? 1);
        this.#riseSpeed = config.riseSpeed ?? (0.5 + Math.random() * 0.8);
        this.#rotationSpeed = config.rotationSpeed ?? (0.5 + Math.random() * 1.5);
        this.#scale = config.scale ?? 1;
        this.#stringLength = (config.stringLength ?? (30 + Math.random() * 40)) * this.#scale;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const [r, g, b] = this.#color;
        const rx = this.#radiusX;
        const ry = this.#radiusY;

        ctx.save();
        ctx.translate(this.#x, this.#y);
        ctx.rotate(this.#rotation);

        const gradient = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, rx * 0.1, 0, 0, Math.max(rx, ry));
        gradient.addColorStop(0, `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, 0.95)`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.9)`);
        gradient.addColorStop(1, `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 0.85)`);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(-rx * 0.25, -ry * 0.3, rx * 0.2, ry * 0.15, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();

        const knotY = ry + 2 * this.#scale;
        ctx.beginPath();
        ctx.moveTo(-3 * this.#scale, knotY);
        ctx.lineTo(0, knotY + 5 * this.#scale);
        ctx.lineTo(3 * this.#scale, knotY);
        ctx.closePath();
        ctx.fillStyle = `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 0.9)`;
        ctx.fill();

        const stringDrift = Math.sin(this.#time * 2 + this.#driftPhase) * 8 * this.#scale;
        ctx.beginPath();
        ctx.moveTo(0, knotY + 5 * this.#scale);
        ctx.quadraticCurveTo(
            stringDrift,
            knotY + 5 * this.#scale + this.#stringLength * 0.5,
            -stringDrift * 0.5,
            knotY + 5 * this.#scale + this.#stringLength
        );
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }

    tick(dt: number = 1): void {
        this.#time += 0.015 * dt;

        this.#y -= this.#riseSpeed * dt;
        this.#x += Math.sin(this.#time * this.#driftFreq + this.#driftPhase) * this.#driftAmp * dt;
        this.#rotation = Math.sin(this.#time * this.#rotationSpeed + this.#driftPhase) * 0.08;
    }
}
