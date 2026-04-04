import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { WaveSource } from './types';

export interface SoundWavesConfig {
    readonly speed?: number;
    readonly sources?: number;
    readonly frequency?: number;
    readonly amplitude?: number;
    readonly colors?: string[];
    readonly resolution?: number;
    readonly damping?: number;
    readonly scale?: number;
}

const DEFAULT_COLORS = ['#1e40af', '#0891b2', '#0d9488', '#2563eb', '#06b6d4'];

export class SoundWaves extends Effect<SoundWavesConfig> {
    #speed: number;
    #sourceCount: number;
    #frequency: number;
    #amplitude: number;
    #resolution: number;
    #damping: number;
    #scale: number;
    #colorsRGB: [number, number, number][];
    readonly #onClickBound: (evt: MouseEvent) => void;
    #sources: WaveSource[] = [];
    #time: number = 0;
    #width: number = 960;
    #height: number = 540;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #imageData: ImageData | null = null;
    #initialized: boolean = false;

    constructor(config: SoundWavesConfig = {}) {
        super();

        this.#speed = config.speed ?? 1;
        this.#sourceCount = config.sources ?? 3;
        this.#frequency = config.frequency ?? 1;
        this.#amplitude = config.amplitude ?? 1;
        this.#resolution = config.resolution ?? 4;
        this.#damping = config.damping ?? 0.98;
        this.#scale = config.scale ?? 1;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#colorsRGB = colors.map(color => hexToRGB(color));

        this.#onClickBound = this.#onClick.bind(this);
    }

    configure(config: Partial<SoundWavesConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.frequency !== undefined) {
            this.#frequency = config.frequency;
        }
        if (config.amplitude !== undefined) {
            this.#amplitude = config.amplitude;
        }
        if (config.damping !== undefined) {
            this.#damping = config.damping;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
        if (config.colors !== undefined) {
            this.#colorsRGB = config.colors.map(color => hexToRGB(color));
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#offscreen = null;
        this.#offscreenCtx = null;
        this.#imageData = null;

        if (!this.#initialized) {
            this.#initialized = true;
            this.#initSources();
        }
    }

    onMount(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('click', this.#onClickBound, {passive: true});
    }

    onUnmount(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('click', this.#onClickBound);
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#time += 0.03 * dt * this.#speed;

        for (let idx = this.#sources.length - 1; idx >= 0; idx--) {
            const source = this.#sources[idx];

            source.x += source.vx * dt;
            source.y += source.vy * dt;
            source.phase += 0.02 * dt * this.#speed;

            if (!source.temporary) {
                if (source.x < 0 || source.x > width) {
                    source.vx *= -1;
                    source.x = Math.max(0, Math.min(width, source.x));
                }

                if (source.y < 0 || source.y > height) {
                    source.vy *= -1;
                    source.y = Math.max(0, Math.min(height, source.y));
                }
            } else {
                source.life -= 0.01 * dt;

                if (source.life <= 0) {
                    this.#sources.splice(idx, 1);
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const resolution = this.#resolution;
        const offWidth = Math.ceil(width / resolution);
        const offHeight = Math.ceil(height / resolution);

        if (!this.#offscreen || this.#offscreen.width !== offWidth || this.#offscreen.height !== offHeight) {
            this.#offscreen = document.createElement('canvas');
            this.#offscreen.width = offWidth;
            this.#offscreen.height = offHeight;
            this.#offscreenCtx = this.#offscreen.getContext('2d');
            this.#imageData = this.#offscreenCtx!.createImageData(offWidth, offHeight);
        }

        const data = this.#imageData!.data;
        const sources = this.#sources;
        const frequency = this.#frequency;
        const amplitude = this.#amplitude;
        const damping = this.#damping;
        const scale = this.#scale;
        const colorsRGB = this.#colorsRGB;
        const colorCount = colorsRGB.length;
        const waveScale = 80 * scale;

        for (let py = 0; py < offHeight; py++) {
            const worldY = py * resolution;

            for (let px = 0; px < offWidth; px++) {
                const worldX = px * resolution;
                let totalValue = 0;
                let totalR = 0;
                let totalG = 0;
                let totalB = 0;
                let totalWeight = 0;

                for (let si = 0; si < sources.length; si++) {
                    const source = sources[si];
                    const dx = worldX - source.x;
                    const dy = worldY - source.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const attenuation = Math.pow(damping, dist / waveScale);
                    const sourceAmplitude = source.amplitude * amplitude * (source.temporary ? source.life : 1);
                    const waveValue = Math.sin(dist / waveScale * frequency * source.frequency * Math.PI * 2 - source.phase) * sourceAmplitude * attenuation;

                    totalValue += waveValue;

                    const weight = Math.abs(waveValue);
                    const [cr, cg, cb] = source.color;
                    totalR += cr * weight;
                    totalG += cg * weight;
                    totalB += cb * weight;
                    totalWeight += weight;
                }

                const normalized = (totalValue + 2) / 4;
                const clamped = Math.max(0, Math.min(1, normalized));

                let baseR: number;
                let baseG: number;
                let baseB: number;

                if (totalWeight > 0) {
                    baseR = totalR / totalWeight;
                    baseG = totalG / totalWeight;
                    baseB = totalB / totalWeight;
                } else {
                    const fallback = colorsRGB[0] ?? [30, 64, 175];
                    baseR = fallback[0];
                    baseG = fallback[1];
                    baseB = fallback[2];
                }

                const brightness = 0.15 + clamped * 0.85;
                const highlight = Math.pow(clamped, 3) * 0.4;

                const offset = (py * offWidth + px) * 4;
                data[offset] = Math.min(255, baseR * brightness + highlight * 255);
                data[offset + 1] = Math.min(255, baseG * brightness + highlight * 255);
                data[offset + 2] = Math.min(255, baseB * brightness + highlight * 255);
                data[offset + 3] = 255;
            }
        }

        this.#offscreenCtx!.putImageData(this.#imageData!, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.#offscreen!, 0, 0, width, height);
    }

    #initSources(): void {
        this.#sources = [];
        const colorsRGB = this.#colorsRGB;
        const colorCount = colorsRGB.length;

        for (let idx = 0; idx < this.#sourceCount; idx++) {
            const colorIdx = idx % colorCount;

            this.#sources.push({
                x: MULBERRY.next() * this.#width,
                y: MULBERRY.next() * this.#height,
                vx: (MULBERRY.next() - 0.5) * 0.4,
                vy: (MULBERRY.next() - 0.5) * 0.4,
                frequency: 0.7 + MULBERRY.next() * 0.6,
                amplitude: 0.8 + MULBERRY.next() * 0.4,
                phase: MULBERRY.next() * Math.PI * 2,
                color: colorsRGB[colorIdx],
                temporary: false,
                life: 1
            });
        }
    }

    #onClick(evt: MouseEvent): void {
        const target = evt.currentTarget as HTMLCanvasElement;
        const rect = target.getBoundingClientRect();
        const clickX = evt.clientX - rect.left;
        const clickY = evt.clientY - rect.top;
        const colorsRGB = this.#colorsRGB;
        const colorIdx = Math.floor(MULBERRY.next() * colorsRGB.length);

        this.#sources.push({
            x: clickX,
            y: clickY,
            vx: 0,
            vy: 0,
            frequency: 1 + MULBERRY.next() * 0.5,
            amplitude: 1.5,
            phase: 0,
            color: colorsRGB[colorIdx],
            temporary: true,
            life: 1
        });
    }
}
