import type { ShootingStar } from './types';

export interface ShootingStarSystemConfig {
    readonly interval: [number, number];
    readonly color?: [number, number, number];
    readonly trailLength?: number;
    readonly trailAlphaFactor?: number;
    readonly speed?: number;
    readonly scale?: number;
    readonly alphaMin?: number;
    readonly alphaRange?: number;
    readonly decayMin?: number;
    readonly decayRange?: number;
}

export class ShootingStarSystem {
    readonly #interval: [number, number];
    readonly #color: [number, number, number];
    readonly #trailLength: number;
    readonly #trailAlphaFactor: number;
    readonly #speed: number;
    readonly #scale: number;
    readonly #alphaMin: number;
    readonly #alphaRange: number;
    readonly #decayMin: number;
    readonly #decayRange: number;
    readonly #rng: () => number;
    #cooldown: number;
    #stars: ShootingStar[] = [];

    constructor(config: ShootingStarSystemConfig, rng: () => number) {
        this.#interval = config.interval;
        this.#color = config.color ?? [200, 230, 255];
        this.#trailLength = config.trailLength ?? 18;
        this.#trailAlphaFactor = config.trailAlphaFactor ?? 0.5;
        this.#speed = config.speed ?? 1;
        this.#scale = config.scale ?? 1;
        this.#alphaMin = config.alphaMin ?? 0.7;
        this.#alphaRange = config.alphaRange ?? 0.3;
        this.#decayMin = config.decayMin ?? 0.008;
        this.#decayRange = config.decayRange ?? 0.01;
        this.#rng = rng;
        this.#cooldown = this.#interval[0] + this.#rng() * (this.#interval[1] - this.#interval[0]);
    }

    tick(dt: number, width: number, height: number): void {
        this.#cooldown -= dt;

        if (this.#cooldown <= 0) {
            this.#stars.push(this.#create(width, height));
            this.#cooldown = this.#interval[0] + this.#rng() * (this.#interval[1] - this.#interval[0]);
        }

        let alive = 0;

        for (let i = 0; i < this.#stars.length; i++) {
            const star = this.#stars[i];

            const trail = star.trail;
            const maxLen = this.#trailLength;

            if (trail.length < maxLen) {
                trail.push({x: star.x, y: star.y});
                star.trailHead = trail.length - 1;
            } else {
                const next = (star.trailHead + 1) % maxLen;
                trail[next].x = star.x;
                trail[next].y = star.y;
                star.trailHead = next;
            }

            star.x += star.vx * this.#speed * dt;
            star.y += star.vy * this.#speed * dt;
            star.alpha -= star.decay * dt;

            const inBounds = star.alpha > 0 && star.x > -50 && star.x < width + 50 && star.y < height + 50;

            if (inBounds) {
                this.#stars[alive++] = star;
            }
        }

        this.#stars.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const [cr, cg, cb] = this.#color;

        ctx.globalCompositeOperation = 'lighter';

        for (const star of this.#stars) {
            const trail = star.trail;
            const trailLen = trail.length;
            const isFull = trailLen === this.#trailLength;
            const oldest = isFull ? (star.trailHead + 1) % trailLen : 0;

            for (let t = 0; t < trailLen; t++) {
                const progress = t / trailLen;
                const trailAlpha = star.alpha * progress * this.#trailAlphaFactor;
                const trailSize = star.size * progress * this.#scale;

                if (trailAlpha < 0.01) {
                    continue;
                }

                const idx = (oldest + t) % trailLen;

                ctx.globalAlpha = trailAlpha;
                ctx.beginPath();
                ctx.arc(trail[idx].x, trail[idx].y, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
                ctx.fill();
            }

            const alpha = star.alpha;
            const headSize = star.size * 2 * this.#scale;
            const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, headSize);
            glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha})`);
            glow.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.3})`);
            glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(star.x, star.y, headSize, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    #create(width: number, height: number): ShootingStar {
        const startX = this.#rng() * width * 0.8;
        const startY = this.#rng() * height * 0.4;
        const angle = 0.3 + this.#rng() * 0.5;
        const speed = 8 + this.#rng() * 12;

        return {
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed * this.#scale,
            vy: Math.sin(angle) * speed * this.#scale,
            alpha: this.#alphaMin + this.#rng() * this.#alphaRange,
            size: 1.5 + this.#rng() * 2,
            decay: this.#decayMin + this.#rng() * this.#decayRange,
            trail: [],
            trailHead: 0
        };
    }
}
