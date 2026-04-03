<template>
    <div ref="containerRef" class="effect-demo effect-demo--clickable" @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click to release a balloon</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface BalloonInstance {
    tick(dt?: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDone: boolean;
}

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();

let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let running = false;
let animFrame = 0;
let balloons: BalloonInstance[] = [];

const COLORS: [number, number, number][] = [
    [255, 68, 68],
    [68, 136, 255],
    [68, 204, 68],
    [255, 204, 0],
    [255, 136, 204],
    [136, 68, 255]
];

async function onClick(evt: MouseEvent): Promise<void> {
    if (!containerRef.value) {
        return;
    }

    const { BalloonParticle } = await import('@basmilius/sparkle');
    const rect = containerRef.value.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    balloons.push(new BalloonParticle({x, y}, color));
}

function loop(): void {
    if (!running || !canvasRef.value || !ctx) {
        return;
    }

    animFrame = requestAnimationFrame(loop);

    canvasRef.value.width = width;
    canvasRef.value.height = height;

    for (let i = balloons.length - 1; i >= 0; i--) {
        balloons[i].tick();

        if (balloons[i].isDone) {
            balloons.splice(i, 1);
        } else {
            balloons[i].draw(ctx);
        }
    }
}

onMounted(() => {
    if (!canvasRef.value || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    ctx = canvasRef.value.getContext('2d', {colorSpace: 'display-p3'});
    running = true;
    animFrame = requestAnimationFrame(loop);
});

onUnmounted(() => {
    running = false;
    cancelAnimationFrame(animFrame);
    balloons = [];
    ctx = null;
});
</script>
