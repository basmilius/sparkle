import { SimulationLayer } from '../layer';
import { LEAF_COLORS, MULBERRY } from './consts';
import type { LeafSimulationConfig } from './simulation';
import type { Leaf } from './types';

export class LeafLayer extends SimulationLayer {
    readonly #scale: number;
    readonly #size: number;
    #speed: number;
    #wind: number;
    readonly #colors: string[];
    #maxCount: number;
    #time: number = 0;
    #leaves: Leaf[] = [];
    #sprites: HTMLCanvasElement[] = [];
    #height: number = 540;

    constructor(config: LeafSimulationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 80;
        this.#size = (config.size ?? 22) * this.#scale;
        this.#speed = config.speed ?? 1;
        this.#wind = config.wind ?? 0.3;
        this.#colors = config.colors ?? LEAF_COLORS;

        if (innerWidth < 991) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        this.#sprites = this.#createSprites();

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#leaves.push(this.#createLeaf(true));
        }
    }

    onResize(_width: number, height: number): void {
        this.#height = height;
    }

    configure(config: Record<string, unknown>): void {
        if (config.speed !== undefined) { this.#speed = config.speed as number; }
        if (config.wind !== undefined) { this.#wind = config.wind as number; }
    }

    tick(dt: number, _width: number, height: number): void {
        this.#height = height;
        const speedFactor = (height / 540) / this.#speed;

        this.#time += 0.015 * dt;

        const globalWind = Math.sin(this.#time * 0.5) * 0.4
                         + Math.sin(this.#time * 1.3 + 2) * 0.2
                         + Math.sin(this.#time * 3.1) * 0.1;

        for (let index = 0; index < this.#leaves.length; index++) {
            const leaf = this.#leaves[index];

            const swing = Math.sin(this.#time * leaf.swingFrequency + leaf.swingOffset) * leaf.swingAmplitude;

            leaf.x += (swing + (this.#wind + globalWind * 0.5) * leaf.depth) * dt / (2500 * speedFactor);
            leaf.y += (leaf.fallSpeed * 2 + leaf.depth + leaf.size * 0.05) * dt / (500 * speedFactor);

            leaf.rotation += leaf.rotationSpeed * dt;
            leaf.flipAngle += leaf.flipSpeed * dt;

            if (leaf.x > 1.15 || leaf.x < -0.15 || leaf.y > 1.05) {
                const recycled = this.#createLeaf(false);

                if (this.#wind + globalWind > 0.15) {
                    recycled.x = -0.15;
                    recycled.y = MULBERRY.next() * 0.7;
                } else if (this.#wind + globalWind < -0.15) {
                    recycled.x = 1.15;
                    recycled.y = MULBERRY.next() * 0.7;
                } else {
                    recycled.x = MULBERRY.next();
                    recycled.y = -0.05 - MULBERRY.next() * 0.15;
                }

                this.#leaves[index] = recycled;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

        for (const leaf of this.#leaves) {
            const px = leaf.x * width;
            const py = leaf.y * height;
            const displaySize = leaf.size * leaf.depth;
            const scaleX = Math.cos(leaf.flipAngle);

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(leaf.rotation);
            ctx.scale(scaleX, 1);
            ctx.globalAlpha = 0.3 + leaf.depth * 0.7;
            ctx.drawImage(
                this.#sprites[leaf.colorIndex % this.#sprites.length],
                -displaySize / 2,
                -displaySize / 2,
                displaySize,
                displaySize
            );
            ctx.restore();
        }

        ctx.globalAlpha = 1;
    }

    #createSprites(): HTMLCanvasElement[] {
        const sprites: HTMLCanvasElement[] = [];

        for (const color of this.#colors) {
            sprites.push(this.#createLeafSprite(color, 0));
            sprites.push(this.#createLeafSprite(color, 1));
            sprites.push(this.#createLeafSprite(color, 2));
        }

        return sprites;
    }

    #createLeafSprite(color: string, shape: number): HTMLCanvasElement {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        const cx = size / 2;
        const cy = size / 2;

        ctx.fillStyle = color;

        switch (shape) {
            case 0:
                this.#drawOvalLeaf(ctx, cx, cy, size);
                break;
            case 1:
                this.#drawMapleLeaf(ctx, cx, cy, size);
                break;
            case 2:
                this.#drawPointedLeaf(ctx, cx, cy, size);
                break;
        }

        return canvas;
    }

    #drawOvalLeaf(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
        const hw = size * 0.3;
        const hh = size * 0.42;

        ctx.beginPath();
        ctx.moveTo(cx, cy - hh);
        ctx.bezierCurveTo(cx + hw * 1.2, cy - hh * 0.5, cx + hw, cy + hh * 0.5, cx, cy + hh);
        ctx.bezierCurveTo(cx - hw, cy + hh * 0.5, cx - hw * 1.2, cy - hh * 0.5, cx, cy - hh);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy - hh * 0.8);
        ctx.lineTo(cx, cy + hh * 0.8);
        ctx.stroke();

        for (const offset of [-0.3, 0, 0.3]) {
            const py = cy + hh * offset;
            ctx.beginPath();
            ctx.moveTo(cx, py);
            ctx.quadraticCurveTo(cx + hw * 0.5, py - 3, cx + hw * 0.7, py - 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx, py);
            ctx.quadraticCurveTo(cx - hw * 0.5, py - 3, cx - hw * 0.7, py - 1);
            ctx.stroke();
        }
    }

    #drawMapleLeaf(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
        const r = size * 0.38;

        ctx.beginPath();
        ctx.moveTo(cx, cy - r);

        const points = 5;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
            const nextAngle = ((i + 1) / points) * Math.PI * 2 - Math.PI / 2;
            const outerR = r * (0.85 + (i % 2) * 0.15);
            const innerR = r * 0.45;
            const midAngle = (angle + nextAngle) / 2;

            ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
            ctx.lineTo(cx + Math.cos(midAngle) * innerR, cy + Math.sin(midAngle) * innerR);
        }

        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.lineWidth = 0.7;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
            const outerR = r * 0.7;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
            ctx.stroke();
        }
    }

    #drawPointedLeaf(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
        const hw = size * 0.22;
        const hh = size * 0.44;

        ctx.beginPath();
        ctx.moveTo(cx, cy - hh);
        ctx.quadraticCurveTo(cx + hw * 1.6, cy - hh * 0.1, cx + hw * 0.3, cy + hh * 0.6);
        ctx.quadraticCurveTo(cx, cy + hh, cx, cy + hh);
        ctx.quadraticCurveTo(cx, cy + hh, cx - hw * 0.3, cy + hh * 0.6);
        ctx.quadraticCurveTo(cx - hw * 1.6, cy - hh * 0.1, cx, cy - hh);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy - hh * 0.7);
        ctx.lineTo(cx, cy + hh * 0.9);
        ctx.stroke();
    }

    #createLeaf(initialSpread: boolean): Leaf {
        const depth = 0.3 + MULBERRY.next() * 0.7;

        return {
            x: MULBERRY.next(),
            y: initialSpread ? MULBERRY.next() * 2 - 1 : -0.05 - MULBERRY.next() * 0.15,
            size: (MULBERRY.next() * 0.6 + 0.5) * this.#size,
            depth,
            rotation: MULBERRY.next() * Math.PI * 2,
            rotationSpeed: (MULBERRY.next() - 0.5) * 0.04,
            flipAngle: MULBERRY.next() * Math.PI * 2,
            flipSpeed: 0.02 + MULBERRY.next() * 0.04,
            swingAmplitude: 0.4 + MULBERRY.next() * 0.8,
            swingFrequency: 0.5 + MULBERRY.next() * 1.5,
            swingOffset: MULBERRY.next() * Math.PI * 2,
            fallSpeed: 0.3 + MULBERRY.next() * 0.7,
            shape: Math.floor(MULBERRY.next() * 3),
            colorIndex: Math.floor(MULBERRY.next() * this.#colors.length * 3)
        };
    }
}
