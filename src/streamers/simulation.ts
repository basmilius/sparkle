import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY, STREAMER_COLORS } from './consts';
import type { Streamer } from './types';

export interface StreamerSimulationConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly speed?: number;
    readonly scale?: number;
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export class StreamerSimulation extends LimitedFrameRateCanvas {
    readonly #colors: string[];
    readonly #scale: number;
    readonly #speed: number;
    #count: number;
    #streamers: Streamer[] = [];

    constructor(canvas: HTMLCanvasElement, config: StreamerSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#colors = config.colors ?? STREAMER_COLORS;
        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#count = config.count ?? 20;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        if (this.isSmall) {
            this.#count = Math.floor(this.#count / 2);
        }
    }

    start(): void {
        super.start();

        this.#streamers = [];

        for (let i = 0; i < this.#count; i++) {
            this.#streamers.push(this.#createStreamer(true));
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        for (const streamer of this.#streamers) {
            this.#drawStreamer(ctx, streamer);
        }
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        let alive = 0;

        for (let i = 0; i < this.#streamers.length; i++) {
            const streamer = this.#streamers[i];

            streamer.y += streamer.fallSpeed * this.#speed * dt;
            streamer.swayPhase += streamer.swaySpeed * dt;

            const swayOffset = Math.sin(streamer.swayPhase) * streamer.swayAmplitude;
            streamer.x += swayOffset * dt * 0.3;

            this.#updateSegments(streamer, dt);

            const lowestY = Math.max(streamer.y, ...streamer.segments.map((seg) => seg.y));

            if (lowestY > this.height + 50) {
                this.#streamers[alive++] = this.#createStreamer(false);
            } else {
                this.#streamers[alive++] = streamer;
            }
        }

        this.#streamers.length = alive;

        while (this.#streamers.length < this.#count) {
            this.#streamers.push(this.#createStreamer(false));
        }
    }

    #createStreamer(initialSpread: boolean): Streamer {
        const scale = this.#scale;
        const segmentCount = 12 + Math.floor(MULBERRY.next() * 8);
        const length = (80 + MULBERRY.next() * 120) * scale;
        const width = (3 + MULBERRY.next() * 5) * scale;
        const startX = MULBERRY.next() * this.width;
        const startY = initialSpread
            ? MULBERRY.next() * this.height
            : -(MULBERRY.next() * 100 + length);
        const depth = 0.4 + MULBERRY.next() * 0.6;
        const curl = (0.3 + MULBERRY.next() * 0.7) * scale;
        const fallSpeed = (1.5 + MULBERRY.next() * 2.5) * depth * scale;
        const swayAmplitude = (0.3 + MULBERRY.next() * 0.6) * scale;
        const swaySpeed = 0.02 + MULBERRY.next() * 0.04;
        const swayPhase = MULBERRY.next() * Math.PI * 2;
        const color = this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)];

        const segments: {x: number; y: number}[] = [];
        const segmentLength = length / segmentCount;

        for (let i = 0; i < segmentCount; i++) {
            segments.push({
                x: startX + Math.sin(i * curl * 0.5) * curl * 8,
                y: startY - i * segmentLength
            });
        }

        return {
            x: startX,
            y: startY,
            length,
            width,
            segments,
            fallSpeed,
            swayPhase,
            swaySpeed,
            swayAmplitude,
            color,
            curl,
            depth
        };
    }

    #updateSegments(streamer: Streamer, dt: number): void {
        const segments = streamer.segments;

        if (segments.length === 0) {
            return;
        }

        segments[0].x = streamer.x;
        segments[0].y = streamer.y;

        const segmentLength = streamer.length / segments.length;

        for (let i = 1; i < segments.length; i++) {
            const prev = segments[i - 1];
            const curr = segments[i];

            const curlOffset = Math.sin(streamer.swayPhase + i * streamer.curl * 0.8) * streamer.curl * 6;

            const targetX = prev.x + curlOffset;
            const targetY = prev.y - segmentLength;

            const follow = 0.08 * dt;
            curr.x += (targetX - curr.x) * follow;
            curr.y += (targetY - curr.y) * follow;

            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > segmentLength * 1.5) {
                const nx = dx / dist;
                const ny = dy / dist;
                curr.x = prev.x + nx * segmentLength * 1.5;
                curr.y = prev.y + ny * segmentLength * 1.5;
            }
        }
    }

    #drawStreamer(ctx: CanvasRenderingContext2D, streamer: Streamer): void {
        const segments = streamer.segments;

        if (segments.length < 2) {
            return;
        }

        const alpha = 0.6 + streamer.depth * 0.4;
        const maxWidth = streamer.width * streamer.depth;
        const last = segments[segments.length - 1];

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(segments[0].x, segments[0].y);

        for (let i = 1; i < segments.length - 1; i++) {
            const curr = segments[i];
            const next = segments[i + 1];
            const midX = (curr.x + next.x) / 2;
            const midY = (curr.y + next.y) / 2;

            ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
        }

        ctx.lineTo(last.x, last.y);

        const gradient = ctx.createLinearGradient(
            segments[0].x, segments[0].y,
            last.x, last.y
        );
        gradient.addColorStop(0, this.#adjustAlpha(streamer.color, alpha * 0.3));
        gradient.addColorStop(0.3, this.#adjustAlpha(streamer.color, alpha));
        gradient.addColorStop(0.7, this.#adjustAlpha(streamer.color, alpha));
        gradient.addColorStop(1, this.#adjustAlpha(streamer.color, alpha * 0.1));

        ctx.strokeStyle = gradient;
        ctx.lineWidth = maxWidth;
        ctx.stroke();
    }

    #adjustAlpha(color: string, alpha: number): string {
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        return color + Math.round(clampedAlpha * 255).toString(16).padStart(2, '0');
    }
}
