import type { Point } from '../point';
import { MULBERRY } from './consts';
import { EXPLOSION_CONFIGS, type ExplosionConfig, type ExplosionType, type ParticleShape } from './types';

const PERSPECTIVE = 800;

export class Explosion {
    readonly #position: Point;
    readonly #angle: number;
    readonly #brightness: number;
    readonly #config: ExplosionConfig;
    readonly #decay: number;
    readonly #hue: number;
    readonly #lineWidth: number;
    readonly #shape: ParticleShape;
    readonly #trail: Point[] = [];
    #trailHead: number = 0;
    readonly #type: ExplosionType;
    #alpha: number = 1;
    #depthScale: number = 1;
    #hasCrackled: boolean = false;
    #hasSplit: boolean = false;
    #speed: number;
    #sparkleTimer: number = 0;
    #vz: number;
    #z: number = 0;

    get angle(): number {
        return this.#angle;
    }

    get hue(): number {
        return this.#hue;
    }

    get isDead(): boolean {
        return this.#alpha <= 0;
    }

    get position(): Point {
        return this.#position;
    }

    get type(): ExplosionType {
        return this.#type;
    }

    constructor(position: Point, hue: number, lineWidth: number, type: ExplosionType, scale: number = 1, angle?: number, speed?: number, vz?: number) {
        const config = EXPLOSION_CONFIGS[type];

        this.#config = config;
        this.#type = type;
        this.#shape = config.shape;
        this.#position = {...position};
        this.#alpha = 1;
        this.#angle = angle ?? MULBERRY.nextBetween(0, Math.PI * 2);
        this.#brightness = MULBERRY.nextBetween(config.brightness[0], config.brightness[1]);
        this.#decay = MULBERRY.nextBetween(config.decay[0], config.decay[1]);
        this.#hue = hue + MULBERRY.nextBetween(-config.hueVariation, config.hueVariation);
        this.#lineWidth = lineWidth * config.lineWidthScale;
        this.#speed = (speed ?? MULBERRY.nextBetween(config.speed[0], config.speed[1])) * scale;

        if (vz !== undefined) {
            this.#vz = vz * scale;
        } else if (config.spread3d) {
            this.#vz = MULBERRY.nextBetween(-this.#speed * 0.5, this.#speed * 0.5);
        } else {
            this.#vz = 0;
        }

        for (let i = 0; i < config.trailMemory; i++) {
            this.#trail.push({...position});
        }
    }

    checkCrackle(): boolean {
        if (this.#type !== 'crackle' || this.#hasCrackled) {
            return false;
        }

        if (this.#alpha <= 0.4) {
            this.#hasCrackled = true;
            return true;
        }

        return false;
    }

    checkSplit(): boolean {
        if (this.#type !== 'crossette' || this.#hasSplit) {
            return false;
        }

        if (this.#alpha < 0.5) {
            this.#hasSplit = true;
            return true;
        }

        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.#config.strobe && this.#sparkleTimer % 6 < 3) {
            return;
        }

        const ds = this.#depthScale;
        const len = this.#trail.length;
        const trailEnd = this.#trail[(this.#trailHead + len - 1) % len];
        const effectiveWidth = this.#shape === 'line' ? this.#lineWidth * ds : this.#lineWidth * 0.4 * ds;
        const effectiveAlpha = this.#alpha * Math.min(ds, 1.2);

        ctx.save();
        ctx.lineCap = 'round';

        if (len > 2) {
            for (let i = len - 1; i > 0; i--) {
                const progress = i / len;
                const alpha = (1 - progress) * effectiveAlpha * 0.5;
                const width = effectiveWidth * (1 - progress * 0.4);

                const ti = (this.#trailHead + i) % len;
                const ti1 = (this.#trailHead + i - 1) % len;

                ctx.beginPath();
                ctx.moveTo(this.#trail[ti].x, this.#trail[ti].y);
                ctx.lineTo(this.#trail[ti1].x, this.#trail[ti1].y);
                ctx.lineWidth = width;
                ctx.strokeStyle = `hsla(${this.#hue}, 100%, ${this.#brightness * 0.7}%, ${alpha})`;
                ctx.stroke();
            }
        }

        ctx.beginPath();
        ctx.moveTo(trailEnd.x, trailEnd.y);
        ctx.lineTo(this.#position.x, this.#position.y);
        ctx.lineWidth = effectiveWidth;
        ctx.strokeStyle = `hsla(${this.#hue}, 100%, ${this.#brightness}%, ${effectiveAlpha})`;
        ctx.stroke();

        if (this.#shape !== 'line') {
            this.#drawShape(ctx, ds, effectiveAlpha);
        }

        if (this.#config.sparkle && this.#sparkleTimer % 4 < 2) {
            ctx.beginPath();
            ctx.arc(this.#position.x, this.#position.y, this.#lineWidth * 0.8 * ds, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.#hue}, 30%, 95%, ${effectiveAlpha * 0.9})`;
            ctx.fill();
        }

        ctx.restore();
    }

    tick(dt: number): void {
        this.#trailHead = (this.#trailHead - 1 + this.#trail.length) % this.#trail.length;
        this.#trail[this.#trailHead].x = this.#position.x;
        this.#trail[this.#trailHead].y = this.#position.y;

        this.#speed *= Math.pow(this.#config.friction, dt);
        this.#vz *= Math.pow(this.#config.friction, dt);

        this.#position.x += Math.cos(this.#angle) * this.#speed * dt;
        this.#position.y += (Math.sin(this.#angle) * this.#speed + this.#config.gravity) * dt;
        this.#z += this.#vz * dt;

        this.#depthScale = PERSPECTIVE / (PERSPECTIVE + this.#z);

        this.#alpha -= this.#decay * dt;
        this.#sparkleTimer += dt;
    }

    #drawShape(ctx: CanvasRenderingContext2D, ds: number, alpha: number): void {
        const size = this.#lineWidth * 1.2 * ds;
        const color = `hsla(${this.#hue}, 100%, ${this.#brightness}%, ${alpha})`;

        switch (this.#shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(this.#position.x, this.#position.y, size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                break;

            case 'star':
                this.#drawStarPath(ctx, this.#position.x, this.#position.y, size * 0.7, 4, this.#sparkleTimer * 0.15);
                ctx.fillStyle = `hsla(${this.#hue}, 60%, ${Math.min(this.#brightness + 10, 100)}%, ${alpha})`;
                ctx.fill();
                break;

            case 'diamond':
                this.#drawDiamondPath(ctx, this.#position.x, this.#position.y, size * 0.6, this.#angle);
                ctx.fillStyle = color;
                ctx.fill();
                break;
        }
    }

    #drawStarPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, points: number, rotation: number): void {
        const innerRadius = radius * 0.4;
        const totalPoints = points * 2;

        ctx.beginPath();

        for (let i = 0; i < totalPoints; i++) {
            const r = i % 2 === 0 ? radius : innerRadius;
            const angle = (i * Math.PI / points) + rotation;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.closePath();
    }

    #drawDiamondPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rotation: number): void {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const hw = size * 0.5;

        ctx.beginPath();
        ctx.moveTo(cx + cos * size - sin * 0, cy + sin * size + cos * 0);
        ctx.lineTo(cx + cos * 0 - sin * hw, cy + sin * 0 + cos * hw);
        ctx.lineTo(cx + cos * -size - sin * 0, cy + sin * -size + cos * 0);
        ctx.lineTo(cx + cos * 0 - sin * -hw, cy + sin * 0 + cos * -hw);
        ctx.closePath();
    }
}
