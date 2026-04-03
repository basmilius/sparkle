<template>
    <EffectDemo ref="containerRef">
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { speed } from '../../.vitepress/theme/useSpeed';

interface DropInstance {
    tick(dt?: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDead: boolean;
    position: { x: number; y: number };
}

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();

let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let running = false;
let animFrame = 0;
let then = 0;
let drops: DropInstance[] = [];
let splashes: DropInstance[] = [];

const COLOR: [number, number, number] = [174, 194, 224];
const MAX_DROPS = 150;
const WIND = 0.25;

async function spawnDrop(): Promise<void> {
    const { RaindropParticle } = await import('@basmilius/sparkle');

    const depth = 0.3 + Math.random() * 0.7;
    const vy = (3.5 + Math.random() * 5) * depth;
    const vx = WIND * vy * 0.6;

    drops.push(new RaindropParticle(
        {x: Math.random() * width, y: -10},
        {x: vx, y: vy},
        COLOR,
        {depth, groundY: height}
    ));
}

function loop(now: number): void {
    if (!running || !canvasRef.value || !ctx) {
        return;
    }

    animFrame = requestAnimationFrame(loop);

    const dt = (then > 0 ? (now - then) / (1000 / 60) : 1) * speed.value;
    then = now;

    canvasRef.value.width = width;
    canvasRef.value.height = height;

    ctx.fillStyle = 'rgba(22, 22, 24, 0.6)';
    ctx.fillRect(0, 0, width, height);

    for (let i = splashes.length - 1; i >= 0; i--) {
        splashes[i].tick(dt);

        if (splashes[i].isDead) {
            splashes.splice(i, 1);
        } else {
            splashes[i].draw(ctx);
        }
    }

    for (let i = drops.length - 1; i >= 0; i--) {
        drops[i].tick(dt);

        if (drops[i].isDead) {
            spawnSplash(drops[i].position.x, height);
            drops.splice(i, 1);
        } else {
            drops[i].draw(ctx);
        }
    }
}

async function spawnSplash(x: number, y: number): Promise<void> {
    const { SplashParticle } = await import('@basmilius/sparkle');
    splashes.push(...SplashParticle.burst({x, y}, COLOR));
}

async function fill(): Promise<void> {
    for (let i = 0; i < MAX_DROPS; i++) {
        await spawnDrop();
    }
}

let spawnInterval: ReturnType<typeof setInterval>;

onMounted(async () => {
    if (!canvasRef.value || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    ctx = canvasRef.value.getContext('2d', {colorSpace: 'display-p3'});
    running = true;
    animFrame = requestAnimationFrame(loop);

    await fill();
    spawnInterval = setInterval(spawnDrop, 30);
});

onUnmounted(() => {
    running = false;
    cancelAnimationFrame(animFrame);
    then = 0;
    clearInterval(spawnInterval);
    drops = [];
    splashes = [];
    ctx = null;
});
</script>
