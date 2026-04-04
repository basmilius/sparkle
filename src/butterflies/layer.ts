import { mobileCount } from '../mobile';
import { p3a, parseColor } from '../color';
import { Effect } from '../effect';
import { setRotatedTransform } from '../transform';
import { MULBERRY } from './consts';
import type { Butterfly } from './types';

export interface ButterfliesConfig {
    readonly colors?: string[];
    readonly count?: number;
    readonly scale?: number;
    readonly size?: number;
    readonly speed?: number;
}

const DEFAULT_COLORS = [
    '#f4a261',
    '#e76f51',
    '#e9c46a',
    '#2a9d8f',
    '#8ecae6',
    '#ffb7c5',
    '#c77dff',
    '#f8edeb'
];

export class Butterflies extends Effect<ButterfliesConfig> {
    #scale: number;
    #speed: number;
    #count: number;
    #size: number;
    #colors: string[];
    #time: number = 0;
    #butterflies: Butterfly[] = [];

    constructor(config: ButterfliesConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 1;
        this.#count = config.count ?? 12;
        this.#size = (config.size ?? 20) * this.#scale;
        this.#colors = config.colors ?? DEFAULT_COLORS;

        this.#count = mobileCount(this.#count);

        for (let i = 0; i < this.#count; ++i) {
            this.#butterflies.push(this.#createButterfly(this.#colors));
        }
    }

    configure(config: Partial<ButterfliesConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.colors !== undefined) {
            this.#colors = config.colors;
            this.#butterflies = this.#butterflies.map(() => this.#createButterfly(this.#colors));
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.003 * this.#speed * dt;

        for (const butterfly of this.#butterflies) {
            const timeX = this.#time * butterfly.orbitSpeedX + butterfly.orbitOffsetX;
            const timeY = this.#time * butterfly.orbitSpeedY + butterfly.orbitOffsetY;

            const orbitX = Math.sin(timeX) * butterfly.orbitRadiusX;
            const orbitY = Math.cos(timeY) * butterfly.orbitRadiusY;

            const targetX = butterfly.driftX + orbitX;
            const targetY = butterfly.driftY + orbitY;

            const dx = targetX - butterfly.x;
            const dy = targetY - butterfly.y;

            butterfly.x += dx * 0.05 * dt;
            butterfly.y += dy * 0.05 * dt;

            butterfly.driftX += butterfly.driftVX * dt;
            butterfly.driftY += butterfly.driftVY * dt;

            if (butterfly.driftX < 0.05 || butterfly.driftX > 0.95) {
                butterfly.driftVX *= -1;
            }

            if (butterfly.driftY < 0.05 || butterfly.driftY > 0.95) {
                butterfly.driftVY *= -1;
            }

            const moveDx = dx * 0.05 * dt;
            const moveDy = dy * 0.05 * dt;

            if (Math.abs(moveDx) > 0.000001 || Math.abs(moveDy) > 0.000001) {
                const targetAngle = Math.atan2(moveDy, moveDx) + Math.PI / 2;
                let angleDiff = targetAngle - butterfly.angle;

                if (angleDiff > Math.PI) {
                    angleDiff -= Math.PI * 2;
                } else if (angleDiff < -Math.PI) {
                    angleDiff += Math.PI * 2;
                }

                butterfly.angle += angleDiff * 0.08 * dt;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const globalTime = this.#time * 1000;
        const base = ctx.getTransform();

        for (const butterfly of this.#butterflies) {
            const px = butterfly.x * width;
            const py = butterfly.y * height;
            const flapAngle = Math.sin(globalTime * butterfly.flapSpeed * 0.012 + butterfly.flapOffset);
            const wingScale = Math.abs(flapAngle);
            const size = butterfly.size * this.#size;
            ctx.globalAlpha = 0.85;
            setRotatedTransform(ctx, base, px, py, butterfly.angle);

            this.#drawButterfly(ctx, size, wingScale, butterfly.colorR, butterfly.colorG, butterfly.colorB);
        }

        ctx.setTransform(base);
        ctx.globalAlpha = 1;
    }

    #drawButterfly(
        ctx: CanvasRenderingContext2D,
        size: number,
        wingScale: number,
        r: number,
        g: number,
        b: number
    ): void {
        const ws = Math.max(0.05, wingScale);
        const body = ctx.getTransform();

        const wingColor = p3a(r, g, b, 0.75);
        const wingEdgeColor = p3a(r, g, b, 0.4);
        const bodyColor = p3a(Math.floor(r * 0.4), Math.floor(g * 0.4), Math.floor(b * 0.4), 0.9);

        for (const side of [-1, 1]) {
            const scaleX = side * ws;

            ctx.setTransform(body.a * scaleX, body.b * scaleX, body.c, body.d, body.e, body.f);

            ctx.fillStyle = wingColor;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                size * 0.8, -size * 0.2,
                size * 1.1, -size * 0.9,
                size * 0.5, -size * 1.0
            );
            ctx.bezierCurveTo(
                size * 0.1, -size * 1.1,
                -size * 0.1, -size * 0.6,
                0, 0
            );
            ctx.fill();

            ctx.fillStyle = wingEdgeColor;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                size * 0.9, size * 0.1,
                size * 1.0, size * 0.7,
                size * 0.4, size * 0.8
            );
            ctx.bezierCurveTo(
                size * 0.0, size * 0.85,
                -size * 0.1, size * 0.4,
                0, 0
            );
            ctx.fill();
        }

        ctx.setTransform(body);

        ctx.fillStyle = bodyColor;
        const bodyLength = size * 1.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.08, bodyLength * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        const antennaLength = size * 0.7;
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = this.#scale;

        for (const antSide of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(antSide * size * 0.04, -bodyLength * 0.4);
            ctx.quadraticCurveTo(
                antSide * size * 0.3, -bodyLength * 0.6,
                antSide * size * 0.25, -bodyLength * 0.5 - antennaLength
            );
            ctx.stroke();

            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.arc(antSide * size * 0.25, -bodyLength * 0.5 - antennaLength, size * 0.06, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    #createButterfly(colors: string[]): Butterfly {
        const colorStr = colors[Math.floor(MULBERRY.next() * colors.length)];
        const {r, g, b} = parseColor(colorStr);

        return {
            x: MULBERRY.next(),
            y: MULBERRY.next(),
            angle: MULBERRY.next() * Math.PI * 2 + Math.PI / 2,
            flapSpeed: 4 + MULBERRY.next() * 4,
            flapOffset: MULBERRY.next() * Math.PI * 2,
            size: 0.7 + MULBERRY.next() * 0.6,
            colorR: r,
            colorG: g,
            colorB: b,
            orbitRadiusX: 0.06 + MULBERRY.next() * 0.15,
            orbitRadiusY: 0.05 + MULBERRY.next() * 0.12,
            orbitSpeedX: 0.6 + MULBERRY.next() * 1.2,
            orbitSpeedY: 0.5 + MULBERRY.next() * 1.0,
            orbitOffsetX: MULBERRY.next() * Math.PI * 2,
            orbitOffsetY: MULBERRY.next() * Math.PI * 2,
            driftX: 0.15 + MULBERRY.next() * 0.7,
            driftY: 0.15 + MULBERRY.next() * 0.7,
            driftVX: (MULBERRY.next() - 0.5) * 0.0005,
            driftVY: (MULBERRY.next() - 0.5) * 0.0004
        };
    }
}
