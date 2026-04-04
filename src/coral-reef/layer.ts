import { isSmallScreen } from '../mobile';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { CoralAnemone, CoralBubble, CoralJellyfish } from './types';

const DEFAULT_COLORS = ['#ff6b9d', '#c44dff', '#00d4aa', '#ff8c42', '#4dc9f6'];

export interface CoralReefConfig {
    readonly anemones?: number;
    readonly jellyfish?: number;
    readonly bubbles?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly scale?: number;
}

export class CoralReef extends Effect<CoralReefConfig> {
    readonly #scale: number;
    readonly #colors: string[];
    #speed: number;
    #maxAnemones: number;
    #maxJellyfish: number;
    #maxBubbles: number;
    #time: number = 0;
    #anemones: CoralAnemone[] = [];
    #jellyfish: CoralJellyfish[] = [];
    #bubbles: CoralBubble[] = [];
    #width: number = 960;
    #height: number = 540;

    constructor(config: CoralReefConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#colors = config.colors ?? DEFAULT_COLORS;
        this.#maxAnemones = config.anemones ?? 8;
        this.#maxJellyfish = config.jellyfish ?? 5;
        this.#maxBubbles = config.bubbles ?? 20;

        if (isSmallScreen()) {
            this.#maxAnemones = Math.floor(this.#maxAnemones / 2);
            this.#maxJellyfish = Math.floor(this.#maxJellyfish / 2);
            this.#maxBubbles = Math.floor(this.#maxBubbles / 2);
        }
    }

    configure(config: Partial<CoralReefConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;

        this.#anemones = [];
        this.#jellyfish = [];
        this.#bubbles = [];

        for (let i = 0; i < this.#maxAnemones; ++i) {
            this.#anemones.push(this.#createAnemone());
        }

        for (let i = 0; i < this.#maxJellyfish; ++i) {
            this.#jellyfish.push(this.#createJellyfish(true));
        }

        for (let i = 0; i < this.#maxBubbles; ++i) {
            this.#bubbles.push(this.#createBubble(true));
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#time += 0.001 * this.#speed * dt;

        for (const anemone of this.#anemones) {
            anemone.phase += 0.0008 * anemone.speed * this.#speed * dt;
        }

        for (let i = 0; i < this.#jellyfish.length; i++) {
            const jelly = this.#jellyfish[i];

            jelly.pulsePhase += 0.002 * jelly.speed * this.#speed * dt;
            jelly.y -= (jelly.speed * this.#speed * 0.015 * dt) / height;
            jelly.x += (Math.sin(this.#time * 2 + jelly.phase) * jelly.drift * dt) / width;

            if (jelly.y < -0.15) {
                this.#jellyfish[i] = this.#createJellyfish(false);
            }
        }

        for (let i = 0; i < this.#bubbles.length; i++) {
            const bubble = this.#bubbles[i];

            bubble.wobblePhase += 0.003 * this.#speed * dt;
            bubble.y -= (bubble.speed * this.#speed * 0.02 * dt) / height;
            bubble.x += (Math.sin(bubble.wobblePhase) * 0.15 * dt) / width;

            if (bubble.y < -0.05) {
                this.#bubbles[i] = this.#createBubble(false);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        this.#drawAnemones(ctx, width, height);
        this.#drawJellyfish(ctx, width, height);
        this.#drawBubbles(ctx, width, height);
    }

    #drawAnemones(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.lineCap = 'round';

        for (const anemone of this.#anemones) {
            const baseX = anemone.x * width;
            const baseY = anemone.baseY * height;

            for (let seg = 0; seg < anemone.segments; seg++) {
                const ratio = seg / anemone.segments;
                const segWidth = anemone.width * this.#scale * (1 - ratio * 0.7);
                const sway = Math.sin(anemone.phase + seg * 0.6) * (12 + seg * 4) * this.#scale;

                let startX = baseX;
                let startY = baseY;

                for (let prev = 0; prev < seg; prev++) {
                    const prevSway = Math.sin(anemone.phase + prev * 0.6) * (12 + prev * 4) * this.#scale;
                    startX += prevSway * 0.15;
                    startY -= anemone.segmentLength * this.#scale;
                }

                const endX = startX + sway * 0.15;
                const endY = startY - anemone.segmentLength * this.#scale;

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(
                    startX + sway * 0.5,
                    (startY + endY) / 2,
                    endX,
                    endY
                );
                ctx.lineWidth = segWidth;
                ctx.strokeStyle = anemone.color;
                ctx.globalAlpha = 0.7 + ratio * 0.3;
                ctx.stroke();
            }
        }

        ctx.globalAlpha = 1;
    }

    #drawJellyfish(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        for (const jelly of this.#jellyfish) {
            const px = jelly.x * width;
            const py = jelly.y * height;
            const size = jelly.size * this.#scale;
            const pulse = 1 + Math.sin(jelly.pulsePhase) * 0.15;
            const bellWidth = size * pulse;
            const bellHeight = size * 0.6 * (1 / pulse);

            ctx.globalAlpha = 0.6;
            ctx.fillStyle = jelly.color;
            ctx.beginPath();
            ctx.ellipse(px, py, bellWidth, bellHeight, 0, Math.PI, 0);
            ctx.fill();

            ctx.globalAlpha = 0.3;
            ctx.fillStyle = jelly.color;
            ctx.beginPath();
            ctx.ellipse(px, py + bellHeight * 0.2, bellWidth * 0.7, bellHeight * 0.5, 0, Math.PI, 0);
            ctx.fill();

            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = jelly.color;
            ctx.lineWidth = 1.5 * this.#scale;
            ctx.lineCap = 'round';

            const tentacleSpacing = (bellWidth * 2) / (jelly.tentacles + 1);

            for (let t = 0; t < jelly.tentacles; t++) {
                const tx = px - bellWidth + tentacleSpacing * (t + 1);
                const tentacleLength = size * (0.8 + MULBERRY.next() * 0.01);

                ctx.beginPath();
                ctx.moveTo(tx, py);

                const cp1x = tx + Math.sin(jelly.pulsePhase + t * 1.2) * size * 0.3;
                const cp1y = py + tentacleLength * 0.4;
                const cp2x = tx - Math.sin(jelly.pulsePhase * 0.7 + t * 0.9) * size * 0.2;
                const cp2y = py + tentacleLength * 0.7;
                const endX = tx + Math.sin(jelly.pulsePhase * 1.3 + t * 0.6) * size * 0.15;
                const endY = py + tentacleLength;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                ctx.stroke();
            }

            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(px - bellWidth * 0.25, py - bellHeight * 0.3, bellWidth * 0.15, bellHeight * 0.1, -0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    #drawBubbles(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        for (const bubble of this.#bubbles) {
            const px = bubble.x * width;
            const py = bubble.y * height;
            const radius = bubble.size * this.#scale;

            ctx.globalAlpha = bubble.opacity;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = this.#scale;
            ctx.stroke();

            ctx.globalAlpha = bubble.opacity * 0.15;
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            ctx.globalAlpha = bubble.opacity * 0.6;
            ctx.beginPath();
            ctx.ellipse(px - radius * 0.25, py - radius * 0.25, radius * 0.15, radius * 0.08, -0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    #createAnemone(): CoralAnemone {
        return {
            x: 0.05 + MULBERRY.next() * 0.9,
            baseY: 0.92 + MULBERRY.next() * 0.08,
            segments: 4 + Math.floor(MULBERRY.next() * 4),
            segmentLength: 12 + MULBERRY.next() * 10,
            phase: MULBERRY.next() * Math.PI * 2,
            speed: 0.6 + MULBERRY.next() * 0.8,
            color: this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)],
            width: 6 + MULBERRY.next() * 6
        };
    }

    #createJellyfish(initialSpread: boolean): CoralJellyfish {
        return {
            x: 0.1 + MULBERRY.next() * 0.8,
            y: initialSpread ? 0.1 + MULBERRY.next() * 0.7 : 1.15 + MULBERRY.next() * 0.1,
            size: 20 + MULBERRY.next() * 30,
            phase: MULBERRY.next() * Math.PI * 2,
            speed: 0.3 + MULBERRY.next() * 0.7,
            tentacles: 4 + Math.floor(MULBERRY.next() * 4),
            color: this.#colors[Math.floor(MULBERRY.next() * this.#colors.length)],
            pulsePhase: MULBERRY.next() * Math.PI * 2,
            drift: 0.3 + MULBERRY.next() * 0.5
        };
    }

    #createBubble(initialSpread: boolean): CoralBubble {
        return {
            x: MULBERRY.next(),
            y: initialSpread ? MULBERRY.next() : 1.05 + MULBERRY.next() * 0.1,
            size: 2 + MULBERRY.next() * 5,
            speed: 0.3 + MULBERRY.next() * 0.7,
            wobblePhase: MULBERRY.next() * Math.PI * 2,
            opacity: 0.2 + MULBERRY.next() * 0.4
        };
    }
}
