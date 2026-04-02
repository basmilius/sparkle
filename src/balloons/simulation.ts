import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { Balloon } from './types';

export interface BalloonSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly sizeRange?: [number, number];
    readonly speed?: number;
    readonly driftAmount?: number;
    readonly stringLength?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const DEFAULT_COLORS = ['#ff4444', '#4488ff', '#44cc44', '#ffcc00', '#ff88cc', '#8844ff'];

export class BalloonSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #speed: number;
    readonly #driftAmount: number;
    readonly #stringLengthMul: number;
    readonly #sizeRange: [number, number];
    readonly #colorRGBs: [number, number, number][];
    #maxCount: number;
    #time: number = 0;
    #balloons: Balloon[] = [];

    constructor(canvas: HTMLCanvasElement, config: BalloonSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 15;
        this.#sizeRange = config.sizeRange ?? [25, 45];
        this.#speed = config.speed ?? 1;
        this.#driftAmount = config.driftAmount ?? 1;
        this.#stringLengthMul = config.stringLength ?? 1;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#colorRGBs = colors.map(c => hexToRGB(c));

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#balloons.push(this.#createBalloon(true));
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        for (const balloon of this.#balloons) {
            const px = balloon.x * this.width;
            const py = balloon.y * this.height;
            const rx = balloon.radiusX * this.#scale;
            const ry = balloon.radiusY * this.#scale;
            const [r, g, b] = balloon.color;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(balloon.rotation);

            // Balloon body with gradient
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

            // Specular highlight
            ctx.beginPath();
            ctx.ellipse(-rx * 0.25, -ry * 0.3, rx * 0.2, ry * 0.15, -0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, 0.35)`;
            ctx.fill();

            // Knot
            const knotY = ry + 2 * this.#scale;
            ctx.beginPath();
            ctx.moveTo(-3 * this.#scale, knotY);
            ctx.lineTo(0, knotY + 5 * this.#scale);
            ctx.lineTo(3 * this.#scale, knotY);
            ctx.closePath();
            ctx.fillStyle = `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 0.9)`;
            ctx.fill();

            // String
            const stringLen = balloon.stringLength * this.#scale * this.#stringLengthMul;
            const drift = Math.sin(this.#time * 2 + balloon.driftPhase) * 8 * this.#scale * this.#driftAmount;
            ctx.beginPath();
            ctx.moveTo(0, knotY + 5 * this.#scale);
            ctx.quadraticCurveTo(
                drift,
                knotY + 5 * this.#scale + stringLen * 0.5,
                -drift * 0.5,
                knotY + 5 * this.#scale + stringLen
            );
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        this.#time += 0.015 * dt * this.#speed;

        for (let i = 0; i < this.#balloons.length; i++) {
            const balloon = this.#balloons[i];

            // Rise
            balloon.y -= (balloon.riseSpeed * this.#speed * dt) / (this.height * 1.2);

            // Drift
            const drift = Math.sin(this.#time * balloon.driftFreq + balloon.driftPhase) * balloon.driftAmp * this.#driftAmount;
            balloon.x += drift / (this.width * 5);

            // Gentle rotation
            balloon.rotation = Math.sin(this.#time * balloon.rotationSpeed + balloon.driftPhase) * 0.08;

            // Recycle at top
            if (balloon.y < -0.2) {
                this.#balloons[i] = this.#createBalloon(false);
            }
        }
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
