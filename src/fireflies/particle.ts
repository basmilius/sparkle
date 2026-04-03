export interface FireflyParticleConfig {
    readonly glowSpeed?: number;
    readonly scale?: number;
    readonly size?: number;
    readonly speed?: number;
}

export function createFireflySprite(color: string, size: number = 64): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const center = size / 2;
    const radius = size / 2;

    const tmp = document.createElement('canvas');
    tmp.width = 1;
    tmp.height = 1;
    const tmpCtx = tmp.getContext('2d')!;
    tmpCtx.fillStyle = color;
    tmpCtx.fillRect(0, 0, 1, 1);
    const [r, g, b] = tmpCtx.getImageData(0, 0, 1, 1).data;

    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(0.1, `rgba(${r}, ${g}, ${b}, 0.8)`);
    gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.08)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
}

export class FireflyParticle {
    readonly #sprite: HTMLCanvasElement;
    readonly #bounds: { width: number; height: number };
    readonly #glowSpeed: number;
    readonly #size: number;
    readonly #speed: number;
    readonly #phase: number;
    readonly #freqX1: number;
    readonly #freqX2: number;
    readonly #freqY1: number;
    readonly #freqY2: number;
    readonly #phaseX1: number;
    readonly #phaseX2: number;
    readonly #phaseY1: number;
    readonly #phaseY2: number;
    readonly #amplitudeX: number;
    readonly #amplitudeY: number;
    #x: number;
    #y: number;
    #time: number = 0;

    get position(): { x: number; y: number } {
        return {x: this.#x, y: this.#y};
    }

    constructor(x: number, y: number, bounds: { width: number; height: number }, sprite: HTMLCanvasElement, config: FireflyParticleConfig = {}) {
        this.#x = x;
        this.#y = y;
        this.#bounds = bounds;
        this.#sprite = sprite;
        this.#glowSpeed = config.glowSpeed ?? (0.5 + Math.random() * 1.5);
        this.#size = (config.size ?? 6) * (config.scale ?? 1);
        this.#speed = config.speed ?? 1;
        this.#phase = Math.random() * Math.PI * 2;
        this.#freqX1 = 0.3 + Math.random() * 0.7;
        this.#freqX2 = 1.2 + Math.random() * 1.8;
        this.#freqY1 = 0.3 + Math.random() * 0.7;
        this.#freqY2 = 1.2 + Math.random() * 1.8;
        this.#phaseX1 = Math.random() * Math.PI * 2;
        this.#phaseX2 = Math.random() * Math.PI * 2;
        this.#phaseY1 = Math.random() * Math.PI * 2;
        this.#phaseY2 = Math.random() * Math.PI * 2;
        this.#amplitudeX = 0.3 + Math.random() * 0.7;
        this.#amplitudeY = 0.3 + Math.random() * 0.7;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const alpha = 0.5 + 0.5 * Math.sin(this.#time * this.#glowSpeed + this.#phase);

        if (alpha < 0.05) {
            return;
        }

        const displaySize = this.#size * 2;

        ctx.globalAlpha = alpha;
        ctx.drawImage(this.#sprite, this.#x - this.#size, this.#y - this.#size, displaySize, displaySize);
        ctx.globalAlpha = 1;
    }

    tick(dt: number = 1): void {
        this.#time += 0.02 * dt * this.#speed;

        const moveX = Math.sin(this.#time * this.#freqX1 + this.#phaseX1) * this.#amplitudeX * this.#bounds.width
                    + Math.sin(this.#time * this.#freqX2 + this.#phaseX2) * this.#amplitudeX * this.#bounds.width * 0.5;

        const moveY = Math.sin(this.#time * this.#freqY1 + this.#phaseY1) * this.#amplitudeY * this.#bounds.height
                    + Math.sin(this.#time * this.#freqY2 + this.#phaseY2) * this.#amplitudeY * this.#bounds.height * 0.5;

        this.#x += (moveX / 3000) * dt;
        this.#y += (moveY / 3000) * dt;

        if (this.#x > this.#bounds.width + this.#size) {
            this.#x = -this.#size;
        } else if (this.#x < -this.#size) {
            this.#x = this.#bounds.width + this.#size;
        }

        if (this.#y > this.#bounds.height + this.#size) {
            this.#y = -this.#size;
        } else if (this.#y < -this.#size) {
            this.#y = this.#bounds.height + this.#size;
        }
    }
}
