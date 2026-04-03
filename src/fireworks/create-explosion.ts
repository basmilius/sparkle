import type { Point } from '../point';
import { Explosion } from './explosion';
import { EXPLOSION_CONFIGS, type ExplosionType, type FireworkVariant } from './types';

function between(rng: () => number, min: number, max: number): number {
    return min + rng() * (max - min);
}

/**
 * Creates an array of {@link Explosion} particles for the given firework variant.
 * Use this to fire a fully formed explosion burst in your own render loop without
 * needing a {@link FireworkSimulation}.
 *
 * @param variant - The firework variant to create.
 * @param position - The center position of the explosion in canvas pixels.
 * @param hue - Base hue in degrees (0–360).
 * @param options - Optional overrides for `lineWidth` (default `5`) and `scale` (default `1`).
 * @param rng - Optional `() => number` RNG returning values in [0, 1). Defaults to `Math.random`.
 */
export function createExplosion(
    variant: FireworkVariant,
    position: Point,
    hue: number,
    options: { lineWidth?: number; scale?: number } = {},
    rng: () => number = Math.random
): Explosion[] {
    const lineWidth = options.lineWidth ?? 5;
    const scale = options.scale ?? 1;
    const explosions: Explosion[] = [];

    switch (variant) {
        case 'saturn':
            createSaturn(explosions, position, hue, lineWidth, scale, rng);
            break;
        case 'dahlia':
            createDahlia(explosions, position, hue, lineWidth, scale, rng);
            break;
        case 'heart':
            createHeart(explosions, position, hue, lineWidth, scale, rng);
            break;
        case 'spiral':
            createSpiral(explosions, position, hue, lineWidth, scale, rng);
            break;
        case 'flower':
            createFlower(explosions, position, hue, lineWidth, scale, rng);
            break;
        case 'concentric':
            createConcentric(explosions, position, hue, lineWidth, scale, rng);
            break;
        default: {
            const type: ExplosionType = variant;
            const config = EXPLOSION_CONFIGS[type];
            const count = Math.floor(between(rng, config.particleCount[0], config.particleCount[1]));
            const effectiveHue = type === 'brocade' ? between(rng, 35, 50) : hue;

            for (let i = 0; i < count; i++) {
                let angle: number | undefined;
                let speed: number | undefined;

                if (type === 'ring') {
                    angle = (i / count) * Math.PI * 2;
                    speed = between(rng, config.speed[0], config.speed[1]) * 0.5 + config.speed[0] * 0.5;
                } else if (type === 'palm' || type === 'horsetail') {
                    const spread = type === 'horsetail' ? Math.PI / 8 : Math.PI / 5;
                    angle = -Math.PI / 2 + between(rng, -spread, spread);
                }

                explosions.push(new Explosion(position, effectiveHue, lineWidth, type, scale, angle, speed));
            }
        }
    }

    return explosions;
}

function createSaturn(explosions: Explosion[], position: Point, hue: number, lineWidth: number, scale: number, rng: () => number): void {
    const velocity = between(rng, 4, 6);
    const shellCount = Math.floor(between(rng, 25, 35));

    for (let i = 0; i < shellCount; i++) {
        const rad = (i / shellCount) * Math.PI * 2;

        explosions.push(new Explosion(
            position, hue, lineWidth, 'peony', scale,
            rad + between(rng, -0.05, 0.05),
            velocity + between(rng, -0.25, 0.25)
        ));
    }

    const fillCount = Math.floor(between(rng, 40, 60));

    for (let i = 0; i < fillCount; i++) {
        explosions.push(new Explosion(
            position, hue, lineWidth, 'peony', scale,
            between(rng, 0, Math.PI * 2),
            velocity * between(rng, 0, 1)
        ));
    }

    const ringRotation = between(rng, 0, Math.PI * 2);
    const ringCount = Math.floor(between(rng, 40, 55));
    const ringVx = velocity * between(rng, 2, 3);
    const ringVy = velocity * 0.6;

    for (let i = 0; i < ringCount; i++) {
        const rad = (i / ringCount) * Math.PI * 2;
        const cx = Math.cos(rad) * ringVx + between(rng, -0.25, 0.25);
        const cy = Math.sin(rad) * ringVy + between(rng, -0.25, 0.25);
        const cosR = Math.cos(ringRotation);
        const sinR = Math.sin(ringRotation);
        const vx = cx * cosR - cy * sinR;
        const vy = cx * sinR + cy * cosR;
        const vz = Math.sin(rad) * velocity * 0.8;

        explosions.push(new Explosion(
            position, hue + 60, lineWidth, 'ring', scale,
            Math.atan2(vy, vx),
            Math.sqrt(vx * vx + vy * vy),
            vz
        ));
    }
}

function createDahlia(explosions: Explosion[], position: Point, hue: number, lineWidth: number, scale: number, rng: () => number): void {
    const petalCount = Math.floor(between(rng, 6, 9));
    const particlesPerPetal = Math.floor(between(rng, 8, 12));

    for (let petal = 0; petal < petalCount; petal++) {
        const baseAngle = (petal / petalCount) * Math.PI * 2;
        const petalHue = hue + (petal % 2 === 0 ? 25 : -25);

        for (let i = 0; i < particlesPerPetal; i++) {
            explosions.push(new Explosion(
                position, petalHue, lineWidth, 'dahlia', scale,
                baseAngle + between(rng, -0.3, 0.3)
            ));
        }
    }
}

function createHeart(explosions: Explosion[], position: Point, hue: number, lineWidth: number, scale: number, rng: () => number): void {
    const velocity = between(rng, 3, 5);
    const count = Math.floor(between(rng, 60, 80));
    const rotation = between(rng, -0.3, 0.3);
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const s = velocity / 16;
        const vx = hx * s;
        const vy = hy * s;
        const rvx = vx * cosR - vy * sinR;
        const rvy = vx * sinR + vy * cosR;

        explosions.push(new Explosion(
            position, hue, lineWidth, 'heart', scale,
            Math.atan2(rvy, rvx),
            Math.max(0.1, Math.sqrt(rvx * rvx + rvy * rvy) + between(rng, -0.15, 0.15))
        ));
    }
}

function createSpiral(explosions: Explosion[], position: Point, hue: number, lineWidth: number, scale: number, rng: () => number): void {
    const arms = Math.floor(between(rng, 3, 5));
    const particlesPerArm = Math.floor(between(rng, 15, 20));
    const twist = between(rng, 2, 3.5);
    const baseRotation = between(rng, 0, Math.PI * 2);

    for (let arm = 0; arm < arms; arm++) {
        const baseAngle = baseRotation + (arm / arms) * Math.PI * 2;
        const armHue = hue + arm * (360 / arms / 3);

        for (let i = 0; i < particlesPerArm; i++) {
            const progress = i / particlesPerArm;

            explosions.push(new Explosion(
                position, armHue, lineWidth, 'spiral', scale,
                baseAngle + progress * twist,
                2 + progress * 8 + between(rng, -0.3, 0.3)
            ));
        }
    }
}

function createFlower(explosions: Explosion[], position: Point, hue: number, lineWidth: number, scale: number, rng: () => number): void {
    const velocity = between(rng, 4, 7);
    const count = Math.floor(between(rng, 70, 90));
    const petals = Math.floor(between(rng, 2, 4));
    const rotation = between(rng, 0, Math.PI * 2);

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const r = Math.abs(Math.cos(petals * t));
        const speed = velocity * r;

        if (speed < 0.3) {
            continue;
        }

        explosions.push(new Explosion(
            position, hue + between(rng, -15, 15), lineWidth, 'flower', scale,
            t + rotation,
            speed + between(rng, -0.2, 0.2)
        ));
    }
}

function createConcentric(explosions: Explosion[], position: Point, hue: number, lineWidth: number, scale: number, rng: () => number): void {
    const outerCount = Math.floor(between(rng, 35, 50));
    const outerSpeed = between(rng, 7, 10);

    for (let i = 0; i < outerCount; i++) {
        const angle = (i / outerCount) * Math.PI * 2;

        explosions.push(new Explosion(
            position, hue, lineWidth, 'ring', scale,
            angle + between(rng, -0.05, 0.05),
            outerSpeed + between(rng, -0.25, 0.25)
        ));
    }

    const innerCount = Math.floor(between(rng, 25, 35));
    const innerSpeed = between(rng, 3, 5);

    for (let i = 0; i < innerCount; i++) {
        const angle = (i / innerCount) * Math.PI * 2;

        explosions.push(new Explosion(
            position, hue + 120, lineWidth, 'ring', scale,
            angle + between(rng, -0.05, 0.05),
            innerSpeed + between(rng, -0.25, 0.25)
        ));
    }
}
