import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { Bubble, PopParticle } from './types';

export interface BubbleSimulationConfig {
    readonly count?: number;
    readonly sizeRange?: [number, number];
    readonly speed?: number;
    readonly popOnClick?: boolean;
    readonly popRadius?: number;
    readonly colors?: string[];
    readonly wobbleAmount?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const DEFAULT_COLORS = ['#88ccff', '#aaddff', '#ccbbff'];

export class BubbleSimulation extends LimitedFrameRateCanvas {
    readonly #scale: number;
    readonly #speed: number;
    readonly #sizeRange: [number, number];
    readonly #wobbleAmount: number;
    readonly #popOnClick: boolean;
    readonly #popRadius: number;
    readonly #baseHues: number[];
    readonly #onClickBound: (evt: MouseEvent) => void;
    #maxCount: number;
    #time: number = 0;
    #bubbles: Bubble[] = [];
    #popParticles: PopParticle[] = [];

    constructor(canvas: HTMLCanvasElement, config: BubbleSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 30;
        this.#sizeRange = config.sizeRange ?? [10, 40];
        this.#speed = config.speed ?? 1;
        this.#wobbleAmount = config.wobbleAmount ?? 1;
        this.#popOnClick = config.popOnClick ?? true;
        this.#popRadius = config.popRadius ?? 50;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#baseHues = colors.map(c => this.#colorToHue(c));

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#bubbles.push(this.#createBubble(true));
        }

        this.#onClickBound = this.#onClick.bind(this);

        if (this.#popOnClick) {
            this.canvas.addEventListener('click', this.#onClickBound, {passive: true});
        }
    }

    destroy(): void {
        this.canvas.removeEventListener('click', this.#onClickBound);
        super.destroy();
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        // Bubbles
        for (const bubble of this.#bubbles) {
            const px = bubble.x * this.width;
            const py = bubble.y * this.height;
            const r = bubble.radius * this.#scale;

            // Base circle with gradient
            const gradient = ctx.createRadialGradient(
                px - r * 0.3, py - r * 0.3, r * 0.1,
                px, py, r
            );

            const hue = (bubble.hue + this.#time * 10) % 360;
            gradient.addColorStop(0, `hsla(${hue}, 70%, 85%, ${bubble.opacity * 0.4})`);
            gradient.addColorStop(0.7, `hsla(${hue}, 60%, 70%, ${bubble.opacity * 0.15})`);
            gradient.addColorStop(1, `hsla(${hue}, 50%, 60%, ${bubble.opacity * 0.05})`);

            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Rim
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${hue}, 60%, 80%, ${bubble.opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Specular highlight
            ctx.beginPath();
            ctx.ellipse(px - r * 0.25, py - r * 0.3, r * 0.2, r * 0.12, -0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(0, 0%, 100%, ${bubble.opacity * 0.5})`;
            ctx.fill();
        }

        // Pop particles
        for (const particle of this.#popParticles) {
            ctx.beginPath();
            ctx.arc(particle.x * this.width, particle.y * this.height, particle.size * this.#scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${particle.alpha})`;
            ctx.fill();
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        this.#time += 0.01 * dt;

        // Update bubbles
        for (let i = 0; i < this.#bubbles.length; i++) {
            const bubble = this.#bubbles[i];

            const wobble = Math.sin(this.#time * bubble.wobbleFreq + bubble.wobblePhase) * bubble.wobbleAmp * this.#wobbleAmount;
            bubble.x += wobble / (this.width * 3);
            bubble.y -= (bubble.speed * this.#speed * dt) / (this.height * 0.8);

            bubble.hue += 0.1 * dt;

            // Recycle at top
            if (bubble.y < -0.1) {
                this.#bubbles[i] = this.#createBubble(false);
            }
        }

        // Update pop particles
        let alive = 0;

        for (let i = 0; i < this.#popParticles.length; i++) {
            const particle = this.#popParticles[i];

            particle.x += (particle.vx * dt) / this.width;
            particle.y += (particle.vy * dt) / this.height;
            particle.alpha -= particle.decay * dt;

            if (particle.alpha > 0) {
                this.#popParticles[alive++] = particle;
            }
        }

        this.#popParticles.length = alive;
    }

    #onClick(evt: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mx = (evt.clientX - rect.left) / rect.width;
        const my = (evt.clientY - rect.top) / rect.height;
        const popRadiusNorm = this.#popRadius / this.width;

        for (let i = this.#bubbles.length - 1; i >= 0; i--) {
            const bubble = this.#bubbles[i];
            const dx = bubble.x - mx;
            const dy = bubble.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < popRadiusNorm + (bubble.radius * this.#scale) / this.width) {
                this.#createPopBurst(bubble.x, bubble.y);
                this.#bubbles[i] = this.#createBubble(false);
            }
        }
    }

    #createBubble(initialSpread: boolean): Bubble {
        const hueIndex = Math.floor(MULBERRY.next() * this.#baseHues.length);

        return {
            x: MULBERRY.next(),
            y: initialSpread ? MULBERRY.next() : 1.1 + MULBERRY.next() * 0.1,
            radius: this.#sizeRange[0] + MULBERRY.next() * (this.#sizeRange[1] - this.#sizeRange[0]),
            speed: 0.5 + MULBERRY.next() * 1.5,
            hue: this.#baseHues[hueIndex],
            wobblePhase: MULBERRY.next() * Math.PI * 2,
            wobbleFreq: 1 + MULBERRY.next() * 2,
            wobbleAmp: 0.5 + MULBERRY.next() * 1,
            opacity: 0.6 + MULBERRY.next() * 0.4
        };
    }

    #createPopBurst(x: number, y: number): void {
        const count = 5 + Math.floor(MULBERRY.next() * 4);

        for (let i = 0; i < count; i++) {
            const angle = MULBERRY.next() * Math.PI * 2;
            const speed = 1 + MULBERRY.next() * 3;

            this.#popParticles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 0.6 + MULBERRY.next() * 0.4,
                size: 1 + MULBERRY.next() * 2,
                decay: 0.03 + MULBERRY.next() * 0.03
            });
        }
    }

    #colorToHue(color: string): number {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;

        let r = data[0] / 255;
        let g = data[1] / 255;
        let b = data[2] / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        if (delta === 0) {
            return 0;
        }

        let hue: number;

        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }

        hue = Math.round(hue * 60);

        if (hue < 0) {
            hue += 360;
        }

        return hue;
    }
}
