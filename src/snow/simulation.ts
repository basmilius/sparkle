import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { Snowflake } from './snowflake';

export interface SnowSimulationConfig {
    readonly fillStyle?: string;
    readonly particles?: number;
    readonly scale?: number;
    readonly size?: number;
    readonly speed?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class SnowSimulation extends LimitedFrameRateCanvas {
    readonly #fillStyle: string;
    readonly #scale: number;
    readonly #size: number;
    readonly #speed: number;
    #maxParticles: number;
    #angle: number = 0;
    #ratio: number = 1;
    #snowFlakes: Snowflake[] = [];

    constructor(canvas: HTMLCanvasElement, config: SnowSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#fillStyle = config.fillStyle ?? 'rgb(255 255 255 / .75)';
        this.#maxParticles = config.particles ?? 200;
        this.#size = (config.size ?? 6) * this.#scale;
        this.#speed = config.speed ?? 2;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxParticles = Math.floor(this.#maxParticles / 2);
        }

        for (let i = 0; i < this.#maxParticles; ++i) {
            this.#snowFlakes.push({
                x: MULBERRY.next(),
                y: MULBERRY.next() - 1,
                density: MULBERRY.next() * this.#maxParticles,
                radius: MULBERRY.next() * this.#size + 2 * this.#scale
            });
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = this.#fillStyle;

        this.context.beginPath();

        this.#snowFlakes.forEach(s => {
            this.context.moveTo(s.x * this.width, s.y * this.height);
            this.context.arc(s.x * this.width, s.y * this.height, s.radius * this.#ratio, 0, Math.PI * 2, true);
        });

        this.context.fill();
    }

    tick(): void {
        let speedFactor = (this.height / (420 * this.#ratio) / this.#speed) * this.deltaFactor;

        this.#angle += 0.02 * speedFactor;

        this.#snowFlakes.forEach((s, index) => {
            s.x += (Math.sin(this.#angle + s.density) * 2) / (5000 * speedFactor);
            s.y += (Math.cos(this.#angle + s.density) + 1 + s.radius / 2) / (1000 * speedFactor);

            if (s.x > 1.05 || s.x < -0.05 || s.y > 1.05) {
                if (index % 3 > 0) {
                    this.#snowFlakes[index].x = MULBERRY.next();
                    this.#snowFlakes[index].y = -0.05;
                } else if (Math.sin(this.#angle) > 0) {
                    this.#snowFlakes[index].x = -0.05;
                    this.#snowFlakes[index].y = MULBERRY.next();
                } else {
                    this.#snowFlakes[index].x = 1.05;
                    this.#snowFlakes[index].y = MULBERRY.next();
                }
            }
        });
    }
}
