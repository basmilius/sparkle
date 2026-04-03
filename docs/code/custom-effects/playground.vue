<template>
    <div ref="containerRef" class="effect-demo effect-demo--clickable" @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <div class="effect-demo__controls">
            <button v-for="variant in ALL_VARIANTS"
                    :key="variant"
                    :style="selectedVariant === variant ? 'background: rgba(255,255,255,.25); color: white;' : ''"
                    @click.stop="selectedVariant = variant">
                {{ variant }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface ExplosionParticle {
    tick(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDead: boolean;
    checkSplit(): boolean;
    checkCrackle(): boolean;
    position: { x: number; y: number };
    hue: number;
    angle: number;
}

interface SparkParticle {
    tick(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDead: boolean;
}

type FireworkVariant =
    | 'peony' | 'chrysanthemum' | 'willow' | 'ring' | 'palm'
    | 'crackle' | 'crossette' | 'dahlia' | 'brocade' | 'horsetail'
    | 'strobe' | 'heart' | 'spiral' | 'flower' | 'saturn' | 'concentric';

type ExplosionType = Exclude<FireworkVariant, 'saturn' | 'concentric'>;

const ALL_VARIANTS: FireworkVariant[] = [
    'peony', 'chrysanthemum', 'willow', 'ring', 'palm',
    'crackle', 'crossette', 'dahlia', 'brocade', 'horsetail',
    'strobe', 'heart', 'spiral', 'flower', 'saturn', 'concentric'
];

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();
const selectedVariant = ref<FireworkVariant>('peony');

let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let running = false;
let animFrame = 0;
let explosions: ExplosionParticle[] = [];
let sparks: SparkParticle[] = [];

let ExplosionClass: (new (...args: unknown[]) => ExplosionParticle) | null = null;
let SparkClass: (new (...args: unknown[]) => SparkParticle) | null = null;
let explosionConfigs: Record<string, { particleCount: [number, number]; speed: [number, number] }> | null = null;

function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function push(position: { x: number; y: number }, hue: number, type: ExplosionType, angle?: number, speed?: number): void {
    if (!ExplosionClass) {
        return;
    }

    explosions.push(new ExplosionClass(position, hue, 3, type, 1, angle, speed));
}

function spawnExplosion(x: number, y: number): void {
    if (!ExplosionClass || !explosionConfigs) {
        return;
    }

    const pos = {x, y};
    const hue = Math.random() * 360;
    const variant = selectedVariant.value;

    if (variant === 'heart') {
        const velocity = rand(3, 5);
        const rotation = rand(-0.3, 0.3);
        const cosR = Math.cos(rotation);
        const sinR = Math.sin(rotation);
        const count = Math.floor(rand(60, 80));

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            const scale = velocity / 16;
            const vx = hx * scale * cosR - hy * scale * sinR;
            const vy = hx * scale * sinR + hy * scale * cosR;
            push(pos, hue, 'heart', Math.atan2(vy, vx), Math.max(0.1, Math.sqrt(vx * vx + vy * vy) + rand(-0.15, 0.15)));
        }
        return;
    }

    if (variant === 'flower') {
        const velocity = rand(4, 7);
        const petals = Math.floor(rand(2, 4));
        const rotation = Math.random() * Math.PI * 2;
        const count = Math.floor(rand(70, 90));

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const r = Math.abs(Math.cos(petals * t));
            const speed = velocity * r;
            if (speed < 0.3) { continue; }
            push(pos, hue + rand(-15, 15), 'flower', t + rotation, speed + rand(-0.2, 0.2));
        }
        return;
    }

    if (variant === 'spiral') {
        const arms = Math.floor(rand(3, 5));
        const particlesPerArm = Math.floor(rand(15, 20));
        const twist = rand(2, 3.5);
        const baseRotation = Math.random() * Math.PI * 2;

        for (let arm = 0; arm < arms; arm++) {
            const baseAngle = baseRotation + (arm / arms) * Math.PI * 2;
            const armHue = hue + arm * (360 / arms / 3);

            for (let i = 0; i < particlesPerArm; i++) {
                const progress = i / particlesPerArm;
                push(pos, armHue, 'spiral', baseAngle + progress * twist, 2 + progress * 8 + rand(-0.3, 0.3));
            }
        }
        return;
    }

    if (variant === 'dahlia') {
        const petalCount = Math.floor(rand(6, 9));
        const particlesPerPetal = Math.floor(rand(8, 12));

        for (let petal = 0; petal < petalCount; petal++) {
            const baseAngle = (petal / petalCount) * Math.PI * 2;
            const petalHue = hue + (petal % 2 === 0 ? 25 : -25);

            for (let i = 0; i < particlesPerPetal; i++) {
                push(pos, petalHue, 'dahlia', baseAngle + rand(-0.3, 0.3));
            }
        }
        return;
    }

    if (variant === 'saturn') {
        const velocity = rand(4, 6);
        const shellCount = Math.floor(rand(25, 35));

        for (let i = 0; i < shellCount; i++) {
            const rad = (i / shellCount) * Math.PI * 2;
            push(pos, hue, 'peony', rad + rand(-0.05, 0.05), velocity + rand(-0.25, 0.25));
        }

        const fillCount = Math.floor(rand(40, 60));
        for (let i = 0; i < fillCount; i++) {
            push(pos, hue, 'peony', Math.random() * Math.PI * 2, velocity * Math.random());
        }

        const ringRotation = Math.random() * Math.PI * 2;
        const ringCount = Math.floor(rand(40, 55));
        const ringVx = velocity * rand(2, 3);
        const ringVy = velocity * 0.6;
        const cosR = Math.cos(ringRotation);
        const sinR = Math.sin(ringRotation);

        for (let i = 0; i < ringCount; i++) {
            const rad = (i / ringCount) * Math.PI * 2;
            const cx = Math.cos(rad) * ringVx + rand(-0.25, 0.25);
            const cy = Math.sin(rad) * ringVy + rand(-0.25, 0.25);
            const vx = cx * cosR - cy * sinR;
            const vy = cx * sinR + cy * cosR;
            const vz = Math.sin(rad) * velocity * 0.8;
            push(pos, hue + 60, 'ring', Math.atan2(vy, vx), Math.sqrt(vx * vx + vy * vy));
            // Note: vz depth effect omitted in this simplified version
        }
        return;
    }

    if (variant === 'concentric') {
        const outerCount = Math.floor(rand(35, 50));
        const outerSpeed = rand(7, 10);

        for (let i = 0; i < outerCount; i++) {
            push(pos, hue, 'ring', (i / outerCount) * Math.PI * 2 + rand(-0.05, 0.05), outerSpeed + rand(-0.25, 0.25));
        }

        const innerCount = Math.floor(rand(25, 35));
        const innerSpeed = rand(3, 5);

        for (let i = 0; i < innerCount; i++) {
            push(pos, hue + 120, 'ring', (i / innerCount) * Math.PI * 2 + rand(-0.05, 0.05), innerSpeed + rand(-0.25, 0.25));
        }
        return;
    }

    // Simple types: peony, chrysanthemum, willow, brocade, horsetail, strobe, crackle, crossette
    const type = variant as ExplosionType;
    const config = explosionConfigs[type];
    const count = Math.floor(config.particleCount[0] + Math.random() * (config.particleCount[1] - config.particleCount[0]));

    for (let i = 0; i < count; i++) {
        let angle: number | undefined;
        let speed: number | undefined;

        if (type === 'ring') {
            angle = (i / count) * Math.PI * 2;
            speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
        } else if (type === 'palm' || type === 'horsetail') {
            const spread = type === 'horsetail' ? Math.PI / 8 : Math.PI / 5;
            angle = -Math.PI / 2 + (Math.random() * 2 - 1) * spread;
        }

        push(pos, type === 'brocade' ? rand(35, 50) : hue, type, angle, speed);
    }
}

function onClick(evt: MouseEvent): void {
    if (!containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    spawnExplosion(evt.clientX - rect.left, evt.clientY - rect.top);
}

function loop(): void {
    if (!running || !canvasRef.value || !ctx) {
        return;
    }

    animFrame = requestAnimationFrame(loop);

    canvasRef.value.width = width;
    canvasRef.value.height = height;
    ctx.globalCompositeOperation = 'lighter';

    const newExplosions: ExplosionParticle[] = [];
    const newSparks: SparkParticle[] = [];

    for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].tick();

        if (sparks[i].isDead) {
            sparks.splice(i, 1);
        } else {
            sparks[i].draw(ctx);
        }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];
        explosion.tick();

        if (explosion.checkSplit() && ExplosionClass) {
            for (let j = 0; j < 4; j++) {
                const angle = explosion.angle + (Math.PI / 2) * j + Math.PI / 4;
                newExplosions.push(new ExplosionClass(explosion.position, explosion.hue, 1.8, 'peony', 1, angle, 3 + Math.random() * 3));
            }
        }

        if (explosion.checkCrackle() && SparkClass) {
            for (let j = 0; j < 8; j++) {
                newSparks.push(new SparkClass(explosion.position, explosion.hue + (Math.random() * 60 - 30)));
            }
        }

        if (explosion.isDead) {
            explosions.splice(i, 1);
        } else {
            explosion.draw(ctx);
        }
    }

    explosions.push(...newExplosions);
    sparks.push(...newSparks);
}

onMounted(async () => {
    if (!canvasRef.value || !containerRef.value) {
        return;
    }

    const { Explosion, Spark, EXPLOSION_CONFIGS } = await import('@basmilius/sparkle');
    ExplosionClass = Explosion as unknown as typeof ExplosionClass;
    SparkClass = Spark as unknown as typeof SparkClass;
    explosionConfigs = EXPLOSION_CONFIGS as typeof explosionConfigs;

    const rect = containerRef.value.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    ctx = canvasRef.value.getContext('2d', {colorSpace: 'display-p3'});
    running = true;
    animFrame = requestAnimationFrame(loop);

    spawnExplosion(width * 0.5, height * 0.35);
});

onUnmounted(() => {
    running = false;
    cancelAnimationFrame(animFrame);
    explosions = [];
    sparks = [];
    ctx = null;
    ExplosionClass = null;
    SparkClass = null;
    explosionConfigs = null;
});
</script>
