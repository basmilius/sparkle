import { SimulationLayer } from '../layer';
import type { Point } from '../point';
import { MULBERRY } from './consts';
import { createExplosion } from './create-explosion';
import { Explosion } from './explosion';
import { Firework } from './firework';
import { Spark } from './spark';
import { FIREWORK_VARIANTS, type FireworkSimulationConfig, type FireworkVariant } from './types';

export class FireworkLayer extends SimulationLayer {
    #explosions: Explosion[] = [];
    #fireworks: Firework[] = [];
    #sparks: Spark[] = [];
    #hue: number = 120;
    #spawnTimer: number = 0;
    #positionRandom = MULBERRY.fork();
    #autoSpawn: boolean;
    #variants: FireworkVariant[];
    readonly #baseSize: number;
    #scale: number;
    readonly #tailWidth: number;
    #width: number = 960;
    #height: number = 540;

    constructor(config: FireworkSimulationConfig = {}) {
        super();

        const scale = config.scale ?? 1;
        this.#autoSpawn = config.autoSpawn ?? true;
        this.#variants = config.variants?.length ? [...config.variants] : [...FIREWORK_VARIANTS];
        this.#baseSize = 5 * scale;
        this.#scale = scale;
        this.#tailWidth = 2 * scale;
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
    }

    fireExplosion(variant: FireworkVariant, position?: Point): void {
        const pos = position ?? {x: this.#width / 2, y: this.#height * 0.4};
        this.#hue = MULBERRY.nextBetween(0, 360);
        this.#spawnExplosion(pos, this.#hue, variant);
    }

    configure(config: Record<string, unknown>): void {
        if (config.scale !== undefined) {
            this.#scale = config.scale as number;
        }
        if (config.autoSpawn !== undefined) {
            this.#autoSpawn = config.autoSpawn as boolean;
        }
        if (Array.isArray(config.variants) && config.variants.length > 0) {
            this.#variants = [...config.variants as FireworkVariant[]];
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#spawnTimer += dt;

        const isSmall = innerWidth < 991;
        const spawnInterval = isSmall ? 60 : 30;

        if (this.#autoSpawn && this.#fireworks.length < 6 && this.#spawnTimer >= spawnInterval) {
            this.#spawnTimer -= spawnInterval;
            let count = MULBERRY.nextBetween(1, 100) < 10 ? 2 : 1;

            while (count--) {
                this.#hue = MULBERRY.nextBetween(0, 360);
                this.#createFirework();
            }
        }

        for (const firework of this.#fireworks) {
            firework.tick(dt);
            this.#sparks.push(...firework.collectSparks());
        }

        for (const explosion of this.#explosions) {
            explosion.tick(dt);
        }

        for (const spark of this.#sparks) {
            spark.tick(dt);
        }

        const newExplosions: Explosion[] = [];
        const newSparks: Spark[] = [];

        for (const explosion of this.#explosions) {
            if (explosion.checkSplit()) {
                for (let i = 0; i < 4; i++) {
                    const angle = explosion.angle + (Math.PI / 2) * i + Math.PI / 4;

                    newExplosions.push(new Explosion(
                        explosion.position,
                        explosion.hue,
                        this.#baseSize * 0.6,
                        'peony',
                        this.#scale,
                        angle,
                        MULBERRY.nextBetween(3, 6)
                    ));
                }
            }

            if (explosion.checkCrackle()) {
                for (let j = 0; j < 14; j++) {
                    const angle = MULBERRY.nextBetween(0, Math.PI * 2);
                    const speed = MULBERRY.nextBetween(3, 8);

                    newSparks.push(new Spark(
                        explosion.position,
                        explosion.hue + MULBERRY.nextBetween(-30, 30),
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    ));
                }
            }
        }

        this.#explosions.push(...newExplosions);
        this.#sparks.push(...newSparks);

        this.#explosions = this.#explosions.filter(e => !e.isDead);
        this.#sparks = this.#sparks.filter(s => !s.isDead);
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
            ctx.canvas.width = width;
            ctx.canvas.height = height;
        }

        ctx.globalCompositeOperation = 'lighter';

        for (const spark of this.#sparks) {
            spark.draw(ctx);
        }

        for (const explosion of this.#explosions) {
            explosion.draw(ctx);
        }

        for (const firework of this.#fireworks) {
            firework.draw(ctx);
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    #spawnExplosion(position: Point, hue: number, variant?: FireworkVariant): void {
        const selected = variant ?? this.#pickVariant();
        const rng = () => MULBERRY.nextBetween(0, 1);
        this.#explosions.push(...createExplosion(selected, position, hue, {lineWidth: this.#baseSize, scale: this.#scale}, rng));
    }

    #createFirework(position?: Point): void {
        const hue = this.#hue;
        const targetX = position?.x || this.#positionRandom.nextBetween(this.#width * .1, this.#width * .9);
        const targetY = position?.y || this.#height * .1 + this.#positionRandom.nextBetween(0, this.#height * .5);
        const startX = this.#width * 0.3 + this.#positionRandom.nextBetween(0, this.#width * 0.4);

        const firework = new Firework(
            {x: startX, y: this.#height},
            {x: targetX, y: targetY},
            hue,
            this.#tailWidth,
            this.#baseSize
        );

        firework.addEventListener('remove', () => {
            this.#fireworks.splice(this.#fireworks.indexOf(firework), 1);
            this.#spawnExplosion(firework.position, hue);
        }, {once: true});

        this.#fireworks.push(firework);
    }

    #pickVariant(): FireworkVariant {
        const index = Math.floor(MULBERRY.nextBetween(0, this.#variants.length));
        return this.#variants[index];
    }
}
