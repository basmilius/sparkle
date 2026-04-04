import { p3 } from '../color';
import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { PulseWave } from './types';

export interface PulseGridConfig {
    readonly spacing?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly dotSize?: number;
    readonly waveCount?: number;
    readonly waveSpeed?: number;
    readonly scale?: number;
}

const DEFAULT_SPACING = 30;
const DEFAULT_DOT_SIZE = 2;
const DEFAULT_WAVE_COUNT = 3;
const DEFAULT_WAVE_SPEED = 100;
const TWO_PI = Math.PI * 2;

export class PulseGrid extends Effect<PulseGridConfig> {
    #scale: number;
    #dotSize: number;
    #r: number;
    #g: number;
    #b: number;
    #speed: number;
    #waveSpeed: number;
    #spacing: number;
    #waveCount: number;
    #gridX: Float32Array = new Float32Array(0);
    #gridY: Float32Array = new Float32Array(0);
    #gridCount: number = 0;
    #waves: PulseWave[] = [];
    #spawnTimer: number = 0;
    #width: number = 0;
    #height: number = 0;

    constructor(config: PulseGridConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#spacing = (config.spacing ?? DEFAULT_SPACING) * this.#scale;
        this.#speed = config.speed ?? 1;
        this.#dotSize = (config.dotSize ?? DEFAULT_DOT_SIZE) * this.#scale;
        this.#waveCount = config.waveCount ?? DEFAULT_WAVE_COUNT;
        this.#waveSpeed = (config.waveSpeed ?? DEFAULT_WAVE_SPEED) * this.#scale;

        const [r, g, b] = hexToRGB(config.color ?? '#4488ff');
        this.#r = r;
        this.#g = g;
        this.#b = b;
    }

    configure(config: Partial<PulseGridConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.waveSpeed !== undefined) {
            this.#waveSpeed = (config.waveSpeed) * this.#scale;
        }
        if (config.color !== undefined) {
            const [r, g, b] = hexToRGB(config.color);
            this.#r = r;
            this.#g = g;
            this.#b = b;
        }
        if (config.dotSize !== undefined) {
            this.#dotSize = config.dotSize * this.#scale;
        }
        if (config.waveCount !== undefined) {
            this.#waveCount = config.waveCount;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#buildGrid(width, height);
    }

    tick(dt: number, _width: number, _height: number): void {
        const dtSeconds = dt * 0.008 * this.#speed;

        // Update existing waves.
        let writeIndex = 0;

        for (let index = 0; index < this.#waves.length; index++) {
            const wave = this.#waves[index];
            // Ease-out: slow down as the wave approaches max radius.
            const progress = wave.radius / wave.maxRadius;
            const easeOut = 1 - progress * 0.65;
            wave.radius += wave.speed * easeOut * dtSeconds;
            wave.life -= dtSeconds * 0.5;

            if (wave.life > 0 && wave.radius < wave.maxRadius) {
                this.#waves[writeIndex++] = wave;
            }
        }

        this.#waves.length = writeIndex;

        // Spawn new waves periodically.
        this.#spawnTimer += dtSeconds;

        const spawnInterval = 1.5 / this.#waveCount;

        while (this.#spawnTimer >= spawnInterval && this.#waves.length < this.#waveCount * 2) {
            this.#spawnTimer -= spawnInterval;
            this.#spawnWave();
        }
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        const waveCount = this.#waves.length;

        if (waveCount === 0) {
            return;
        }

        ctx.globalCompositeOperation = 'lighter';

        const dotSize = this.#dotSize;
        const r = this.#r;
        const g = this.#g;
        const b = this.#b;

        for (let index = 0; index < this.#gridCount; index++) {
            const px = this.#gridX[index];
            const py = this.#gridY[index];

            let brightness = 0;

            for (let wi = 0; wi < waveCount; wi++) {
                const wave = this.#waves[wi];
                const dx = px - wave.x;
                const dy = py - wave.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ringDist = Math.abs(dist - wave.radius);
                const ringWidth = 20 * this.#scale;

                // Gaussian brightness based on distance to wave ring.
                const intensity = Math.exp(-(ringDist * ringDist) / (2 * ringWidth * ringWidth));
                brightness += intensity * wave.life;
            }

            if (brightness < 0.01) {
                continue;
            }

            if (brightness > 1) {
                brightness = 1;
            }

            ctx.globalAlpha = brightness;
            ctx.fillStyle = p3(r, g, b);
            ctx.beginPath();
            ctx.arc(px, py, dotSize + dotSize * brightness * 0.5, 0, TWO_PI);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #buildGrid(width: number, height: number): void {
        const spacing = this.#spacing;
        const cols = Math.ceil(width / spacing) + 1;
        const rows = Math.ceil(height / spacing) + 1;
        const total = cols * rows;

        this.#gridX = new Float32Array(total);
        this.#gridY = new Float32Array(total);
        this.#gridCount = total;

        let index = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.#gridX[index] = col * spacing;
                this.#gridY[index] = row * spacing;
                index++;
            }
        }
    }

    #spawnWave(): void {
        const maxDim = Math.max(this.#width, this.#height);

        this.#waves.push({
            x: MULBERRY.next() * this.#width,
            y: MULBERRY.next() * this.#height,
            radius: 0,
            maxRadius: maxDim * 0.8 + MULBERRY.next() * maxDim * 0.4,
            speed: this.#waveSpeed * (0.8 + MULBERRY.next() * 0.4),
            life: 1
        });
    }
}
