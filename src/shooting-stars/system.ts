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
    readonly verticalFade?: [number, number];
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
    readonly #verticalFade: [number, number] | null;
    readonly #rng: () => number;
    #cooldown: number;
    #height: number = 0;
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
        this.#verticalFade = config.verticalFade ?? null;
        this.#rng = rng;
        this.#cooldown = this.#interval[0] + this.#rng() * (this.#interval[1] - this.#interval[0]);
    }

    tick(dt: number, width: number, height: number): void {
        this.#height = height;
        this.#cooldown -= dt;

        if (this.#cooldown <= 0) {
            this.#stars.push(this.#create(width, height));
            this.#cooldown = this.#interval[0] + this.#rng() * (this.#interval[1] - this.#interval[0]);
        }

        let alive = 0;

        for (let i = 0; i < this.#stars.length; i++) {
            const star = this.#stars[i];

            star.trail.push({x: star.x, y: star.y});

            if (star.trail.length > this.#trailLength) {
                star.trail.shift();
            }

            star.x += star.vx * this.#speed * dt;
            star.y += star.vy * this.#speed * dt;
            star.alpha -= star.decay * dt;

            const inBounds = star.alpha > 0 && star.x > -50 && star.x < width + 50 && star.y < height + 50;
            const fullyFaded = this.#verticalFade !== null && star.y / height >= this.#verticalFade[1];

            if (inBounds && !fullyFaded) {
                this.#stars[alive++] = star;
            }
        }

        this.#stars.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const [cr, cg, cb] = this.#color;

        ctx.globalCompositeOperation = 'lighter';

        for (const star of this.#stars) {
            let fadeFactor = 1;

            if (this.#verticalFade && this.#height > 0) {
                const [fadeStart, fadeEnd] = this.#verticalFade;
                fadeFactor = 1 - Math.max(0, Math.min(1, (star.y / this.#height - fadeStart) / (fadeEnd - fadeStart)));
            }

            for (let t = 0; t < star.trail.length; t++) {
                const progress = t / star.trail.length;
                const trailAlpha = star.alpha * progress * this.#trailAlphaFactor * fadeFactor;
                const trailSize = star.size * progress * this.#scale;

                if (trailAlpha < 0.01) {
                    continue;
                }

                ctx.globalAlpha = trailAlpha;
                ctx.beginPath();
                ctx.arc(star.trail[t].x, star.trail[t].y, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
                ctx.fill();
            }

            const alpha = star.alpha * fadeFactor;
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
            trail: []
        };
    }
}
