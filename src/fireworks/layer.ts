import { SimulationLayer } from '../layer';
import type { Point } from '../point';
import { MULBERRY } from './consts';
import { Explosion } from './explosion';
import { Firework } from './firework';
import { Spark } from './spark';
import { EXPLOSION_CONFIGS, type ExplosionType, type FireworkSimulationConfig, type FireworkVariant } from './types';

export class FireworkLayer extends SimulationLayer {
    #explosions: Explosion[] = [];
    #fireworks: Firework[] = [];
    #sparks: Spark[] = [];
    #hue: number = 120;
    #ticks: number = 0;
    #positionRandom = MULBERRY.fork();
    readonly #autoSpawn: boolean;
    readonly #baseSize: number;
    readonly #scale: number;
    readonly #tailWidth: number;
    #width: number = 960;
    #height: number = 540;

    constructor(config: FireworkSimulationConfig = {}) {
        super();

        const scale = config.scale ?? 1;
        this.#autoSpawn = config.autoSpawn ?? true;
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
        this.#createExplosion(pos, this.#hue, variant);
    }

    tick(dt: number, width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#ticks++;

        const isSmall = innerWidth < 991;

        if (this.#autoSpawn && this.#fireworks.length < 6 && this.#ticks % (isSmall ? 60 : 30) === 0) {
            let count = MULBERRY.nextBetween(1, 100) < 10 ? 2 : 1;

            while (count--) {
                this.#hue = MULBERRY.nextBetween(0, 360);
                this.#createFirework();
            }
        }

        for (const firework of this.#fireworks) {
            firework.tick();
            this.#sparks.push(...firework.collectSparks());
        }

        for (const explosion of this.#explosions) {
            explosion.tick();
        }

        for (const spark of this.#sparks) {
            spark.tick();
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
                for (let j = 0; j < 8; j++) {
                    newSparks.push(new Spark(
                        explosion.position,
                        explosion.hue + MULBERRY.nextBetween(-30, 30)
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

    #createExplosion(position: Point, hue: number, variant?: FireworkVariant): void {
        const selected = variant ?? this.#pickVariant();

        if (selected === 'saturn') {
            this.#createSaturnExplosion(position, hue);
            return;
        }

        if (selected === 'dahlia') {
            this.#createDahliaExplosion(position, hue);
            return;
        }

        if (selected === 'heart') {
            this.#createHeartExplosion(position, hue);
            return;
        }

        if (selected === 'spiral') {
            this.#createSpiralExplosion(position, hue);
            return;
        }

        if (selected === 'flower') {
            this.#createFlowerExplosion(position, hue);
            return;
        }

        if (selected === 'concentric') {
            this.#createConcentricExplosion(position, hue);
            return;
        }

        const type: ExplosionType = selected;
        const config = EXPLOSION_CONFIGS[type];
        const particleCount = Math.floor(MULBERRY.nextBetween(config.particleCount[0], config.particleCount[1]));

        const effectiveHue = type === 'brocade'
            ? MULBERRY.nextBetween(35, 50)
            : hue;

        for (let i = 0; i < particleCount; i++) {
            let angle: number | undefined;
            let speed: number | undefined;

            if (type === 'ring') {
                angle = (i / particleCount) * Math.PI * 2;
                speed = MULBERRY.nextBetween(config.speed[0], config.speed[1]) * 0.5 + config.speed[0] * 0.5;
            } else if (type === 'palm' || type === 'horsetail') {
                const spread = type === 'horsetail' ? Math.PI / 8 : Math.PI / 5;
                angle = -Math.PI / 2 + MULBERRY.nextBetween(-spread, spread);
            }

            this.#explosions.push(new Explosion(position, effectiveHue, this.#baseSize, type, this.#scale, angle, speed));
        }
    }

    #createSaturnExplosion(position: Point, hue: number): void {
        const velocity = MULBERRY.nextBetween(4, 6);
        const shellCount = Math.floor(MULBERRY.nextBetween(25, 35));

        for (let i = 0; i < shellCount; i++) {
            const rad = (i / shellCount) * Math.PI * 2;

            this.#explosions.push(new Explosion(
                position,
                hue,
                this.#baseSize,
                'peony',
                this.#scale,
                rad + MULBERRY.nextBetween(-0.05, 0.05),
                velocity + MULBERRY.nextBetween(-0.25, 0.25)
            ));
        }

        const fillCount = Math.floor(MULBERRY.nextBetween(40, 60));

        for (let i = 0; i < fillCount; i++) {
            const rad = MULBERRY.nextBetween(0, Math.PI * 2);
            const speed = velocity * MULBERRY.nextBetween(0, 1);

            this.#explosions.push(new Explosion(
                position,
                hue,
                this.#baseSize,
                'peony',
                this.#scale,
                rad,
                speed
            ));
        }

        const ringRotation = MULBERRY.nextBetween(0, Math.PI * 2);
        const ringCount = Math.floor(MULBERRY.nextBetween(40, 55));
        const ringVx = velocity * MULBERRY.nextBetween(2, 3);
        const ringVy = velocity * 0.6;

        for (let i = 0; i < ringCount; i++) {
            const rad = (i / ringCount) * Math.PI * 2;

            const cx = Math.cos(rad) * ringVx + MULBERRY.nextBetween(-0.25, 0.25);
            const cy = Math.sin(rad) * ringVy + MULBERRY.nextBetween(-0.25, 0.25);

            const cosR = Math.cos(ringRotation);
            const sinR = Math.sin(ringRotation);
            const vx = cx * cosR - cy * sinR;
            const vy = cx * sinR + cy * cosR;

            const screenAngle = Math.atan2(vy, vx);
            const screenSpeed = Math.sqrt(vx * vx + vy * vy);
            const vz = Math.sin(rad) * velocity * 0.8;

            this.#explosions.push(new Explosion(
                position,
                hue + 60,
                this.#baseSize,
                'ring',
                this.#scale,
                screenAngle,
                screenSpeed,
                vz
            ));
        }
    }

    #createDahliaExplosion(position: Point, hue: number): void {
        const petalCount = Math.floor(MULBERRY.nextBetween(6, 9));
        const particlesPerPetal = Math.floor(MULBERRY.nextBetween(8, 12));

        for (let petal = 0; petal < petalCount; petal++) {
            const baseAngle = (petal / petalCount) * Math.PI * 2;
            const petalHue = hue + (petal % 2 === 0 ? 25 : -25);

            for (let i = 0; i < particlesPerPetal; i++) {
                const angle = baseAngle + MULBERRY.nextBetween(-0.3, 0.3);

                this.#explosions.push(new Explosion(
                    position,
                    petalHue,
                    this.#baseSize,
                    'dahlia',
                    this.#scale,
                    angle
                ));
            }
        }
    }

    #createHeartExplosion(position: Point, hue: number): void {
        const velocity = MULBERRY.nextBetween(3, 5);
        const count = Math.floor(MULBERRY.nextBetween(60, 80));
        const rotation = MULBERRY.nextBetween(-0.3, 0.3);

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;

            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const scale = velocity / 16;
            const vx = hx * scale;
            const vy = hy * scale;

            const cosR = Math.cos(rotation);
            const sinR = Math.sin(rotation);
            const rvx = vx * cosR - vy * sinR;
            const rvy = vx * sinR + vy * cosR;

            const angle = Math.atan2(rvy, rvx);
            const speed = Math.sqrt(rvx * rvx + rvy * rvy);

            this.#explosions.push(new Explosion(
                position,
                hue,
                this.#baseSize,
                'heart',
                this.#scale,
                angle,
                Math.max(0.1, speed + MULBERRY.nextBetween(-0.15, 0.15))
            ));
        }
    }

    #createSpiralExplosion(position: Point, hue: number): void {
        const arms = Math.floor(MULBERRY.nextBetween(3, 5));
        const particlesPerArm = Math.floor(MULBERRY.nextBetween(15, 20));
        const twist = MULBERRY.nextBetween(2, 3.5);
        const baseRotation = MULBERRY.nextBetween(0, Math.PI * 2);

        for (let arm = 0; arm < arms; arm++) {
            const baseAngle = baseRotation + (arm / arms) * Math.PI * 2;
            const armHue = hue + arm * (360 / arms / 3);

            for (let i = 0; i < particlesPerArm; i++) {
                const progress = i / particlesPerArm;
                const angle = baseAngle + progress * twist;
                const speed = 2 + progress * 8;

                this.#explosions.push(new Explosion(
                    position,
                    armHue,
                    this.#baseSize,
                    'spiral',
                    this.#scale,
                    angle,
                    speed + MULBERRY.nextBetween(-0.3, 0.3)
                ));
            }
        }
    }

    #createFlowerExplosion(position: Point, hue: number): void {
        const velocity = MULBERRY.nextBetween(4, 7);
        const count = Math.floor(MULBERRY.nextBetween(70, 90));
        const petals = Math.floor(MULBERRY.nextBetween(2, 4));
        const rotation = MULBERRY.nextBetween(0, Math.PI * 2);

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const r = Math.abs(Math.cos(petals * t));
            const speed = velocity * r;

            if (speed < 0.3) {
                continue;
            }

            this.#explosions.push(new Explosion(
                position,
                hue + MULBERRY.nextBetween(-15, 15),
                this.#baseSize,
                'flower',
                this.#scale,
                t + rotation,
                speed + MULBERRY.nextBetween(-0.2, 0.2)
            ));
        }
    }

    #createConcentricExplosion(position: Point, hue: number): void {
        const outerCount = Math.floor(MULBERRY.nextBetween(35, 50));
        const outerSpeed = MULBERRY.nextBetween(7, 10);

        for (let i = 0; i < outerCount; i++) {
            const angle = (i / outerCount) * Math.PI * 2;

            this.#explosions.push(new Explosion(
                position,
                hue,
                this.#baseSize,
                'ring',
                this.#scale,
                angle + MULBERRY.nextBetween(-0.05, 0.05),
                outerSpeed + MULBERRY.nextBetween(-0.25, 0.25)
            ));
        }

        const innerCount = Math.floor(MULBERRY.nextBetween(25, 35));
        const innerSpeed = MULBERRY.nextBetween(3, 5);

        for (let i = 0; i < innerCount; i++) {
            const angle = (i / innerCount) * Math.PI * 2;

            this.#explosions.push(new Explosion(
                position,
                hue + 120,
                this.#baseSize,
                'ring',
                this.#scale,
                angle + MULBERRY.nextBetween(-0.05, 0.05),
                innerSpeed + MULBERRY.nextBetween(-0.25, 0.25)
            ));
        }
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
            this.#createExplosion(firework.position, hue);
        }, {once: true});

        this.#fireworks.push(firework);
    }

    #pickVariant(): FireworkVariant {
        const roll = MULBERRY.nextBetween(0, 100);

        if (roll < 12) { return 'peony'; }
        if (roll < 22) { return 'chrysanthemum'; }
        if (roll < 29) { return 'willow'; }
        if (roll < 34) { return 'ring'; }
        if (roll < 39) { return 'palm'; }
        if (roll < 44) { return 'crackle'; }
        if (roll < 48) { return 'crossette'; }
        if (roll < 55) { return 'saturn'; }
        if (roll < 62) { return 'dahlia'; }
        if (roll < 67) { return 'brocade'; }
        if (roll < 71) { return 'horsetail'; }
        if (roll < 75) { return 'strobe'; }
        if (roll < 82) { return 'heart'; }
        if (roll < 89) { return 'spiral'; }
        if (roll < 94) { return 'flower'; }

        return 'concentric';
    }
}
