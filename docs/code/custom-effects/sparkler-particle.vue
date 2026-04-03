<template>
    <div ref="containerRef" class="effect-demo effect-demo--clickable" @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click anywhere</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface SparkInstance {
    tick(dt?: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDead: boolean;
}

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();

let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let running = false;
let animFrame = 0;
let sparks: SparkInstance[] = [];

const COLORS: [number, number, number][] = [
    [255, 200, 50],
    [255, 140, 20],
    [255, 255, 180],
    [255, 100, 80],
    [100, 200, 255]
];

async function onClick(evt: MouseEvent): Promise<void> {
    if (!containerRef.value) {
        return;
    }

    const { SparklerParticle } = await import('@basmilius/sparkle');
    const rect = containerRef.value.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        sparks.push(new SparklerParticle(
            {x, y},
            {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed},
            color,
            {trailLength: 5, scale: 1.2}
        ));
    }
}

function loop(): void {
    if (!running || !canvasRef.value || !ctx) {
        return;
    }

    animFrame = requestAnimationFrame(loop);

    canvasRef.value.width = width;
    canvasRef.value.height = height;
    ctx.globalCompositeOperation = 'lighter';

    for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].tick();

        if (sparks[i].isDead) {
            sparks.splice(i, 1);
        } else {
            sparks[i].draw(ctx);
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
    sparks = [];
    ctx = null;
});
</script>
