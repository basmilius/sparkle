import { isSmallScreen } from '../mobile';
import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { Balloon } from './types';

const DEFAULT_COLORS = ['#ff4444', '#4488ff', '#44cc44', '#ffcc00', '#ff88cc', '#8844ff'];

export interface BalloonsConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly sizeRange?: [number, number];
    readonly speed?: number;
    readonly driftAmount?: number;
    readonly stringLength?: number;
    readonly scale?: number;
}

export class Balloons extends Effect<BalloonsConfig> {
    #scale: number;
    #speed: number;
    #driftAmount: number;
    #stringLengthMul: number;
    readonly #sizeRange: [number, number];
    #colorRGBs: [number, number, number][];
    #maxCount: number;
    #time: number = 0;
    #balloons: Balloon[] = [];

    constructor(config: BalloonsConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 15;
        this.#sizeRange = config.sizeRange ?? [25, 45];
        this.#speed = config.speed ?? 1;
        this.#driftAmount = config.driftAmount ?? 1;
        this.#stringLengthMul = config.stringLength ?? 1;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#colorRGBs = colors.map(c => hexToRGB(c));

        if (isSmallScreen()) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#balloons.push(this.#createBalloon(true));
        }
    }

    configure(config: Partial<BalloonsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.driftAmount !== undefined) {
            this.#driftAmount = config.driftAmount;
        }
        if (config.stringLength !== undefined) {
            this.#stringLengthMul = config.stringLength;
        }
        if (config.colors !== undefined) {
            this.#colorRGBs = config.colors.map(c => hexToRGB(c));

            for (let i = 0; i < this.#balloons.length; i++) {
                this.#balloons[i].color = this.#colorRGBs[i % this.#colorRGBs.length];
            }
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.015 * dt * this.#speed;

        for (let i = 0; i < this.#balloons.length; i++) {
            const balloon = this.#balloons[i];

            balloon.y -= (balloon.riseSpeed * this.#speed * dt) / (height * 1.2);

            const drift = Math.sin(this.#time * balloon.driftFreq + balloon.driftPhase) * balloon.driftAmp * this.#driftAmount;
            balloon.x += drift * dt / (width * 5);

            balloon.rotation = Math.sin(this.#time * balloon.rotationSpeed + balloon.driftPhase) * 0.08;

            if (balloon.y < -0.2) {
                this.#balloons[i] = this.#createBalloon(false);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const base = ctx.getTransform();

        for (const balloon of this.#balloons) {
            const px = balloon.x * width;
            const py = balloon.y * height;
            const rx = balloon.radiusX * this.#scale;
            const ry = balloon.radiusY * this.#scale;
            const [r, g, b] = balloon.color;
            const cos = Math.cos(balloon.rotation);
            const sin = Math.sin(balloon.rotation);

            ctx.setTransform(
                base.a * cos + base.c * sin,
                base.b * cos + base.d * sin,
                base.a * -sin + base.c * cos,
                base.b * -sin + base.d * cos,
                base.a * px + base.c * py + base.e,
                base.b * px + base.d * py + base.f
            );

            const gradient = ctx.createRadialGradient(
                -rx * 0.3, -ry * 0.3, rx * 0.1,
                0, 0, Math.max(rx, ry)
            );
            gradient.addColorStop(0, `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, 0.95)`);
            gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.9)`);
            gradient.addColorStop(1, `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 0.85)`);

            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(-rx * 0.25, -ry * 0.3, rx * 0.2, ry * 0.15, -0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, 0.35)`;
            ctx.fill();

            const knotY = ry + 2 * this.#scale;
            ctx.beginPath();
            ctx.moveTo(-3 * this.#scale, knotY);
            ctx.lineTo(0, knotY + 5 * this.#scale);
            ctx.lineTo(3 * this.#scale, knotY);
            ctx.closePath();
            ctx.fillStyle = `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 0.9)`;
            ctx.fill();

            const stringLen = balloon.stringLength * this.#scale * this.#stringLengthMul;
            const knotBaseY = knotY + 5 * this.#scale;
            const ph = balloon.driftPhase;
            const fr = balloon.driftFreq;
            const swingAmt = 10 * this.#scale * this.#driftAmount;

            // Each control point lags further behind the balloon's lateral oscillation,
            // so the string trails the direction of movement like a real hanging string.
            const midSwing = Math.sin(this.#time * fr + ph - 0.3) * swingAmt * 0.55;
            const tipSwing = Math.sin(this.#time * fr + ph - 0.8) * swingAmt;
            // Subtle high-frequency flutter at the tip for lightness.
            const flutter = Math.sin(this.#time * fr * 2.5 + ph * 1.4 + 1.8) * 2.5 * this.#scale;

            ctx.beginPath();
            ctx.moveTo(0, knotBaseY);
            ctx.bezierCurveTo(
                midSwing * 0.35, knotBaseY + stringLen * 0.3,
                midSwing + flutter * 0.5, knotBaseY + stringLen * 0.65,
                tipSwing + flutter, knotBaseY + stringLen
            );
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
            ctx.lineWidth = this.#scale;
            ctx.stroke();
        }

        ctx.setTransform(base);
    }

    #createBalloon(initialSpread: boolean): Balloon {
        const colorIndex = Math.floor(MULBERRY.next() * this.#colorRGBs.length);
        const baseRadius = this.#sizeRange[0] + MULBERRY.next() * (this.#sizeRange[1] - this.#sizeRange[0]);

        return {
            x: 0.1 + MULBERRY.next() * 0.8,
            y: initialSpread ? MULBERRY.next() * 1.2 : 1.2 + MULBERRY.next() * 0.2,
            radiusX: baseRadius * 0.85,
            radiusY: baseRadius,
            color: this.#colorRGBs[colorIndex],
            driftPhase: MULBERRY.next() * Math.PI * 2,
            driftFreq: 0.5 + MULBERRY.next() * 1,
            driftAmp: 0.3 + MULBERRY.next() * 0.7,
            riseSpeed: 0.3 + MULBERRY.next() * 0.7,
            rotation: 0,
            rotationSpeed: 0.5 + MULBERRY.next() * 1.5,
            stringLength: 30 + MULBERRY.next() * 40
        };
    }
}
