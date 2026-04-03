<template>
    <div ref="containerRef" class="effect-demo effect-demo--clickable" @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click to set target</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface TrailInstance {
    tick(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    collectSparks(): SparkInstance[];
    isDone: boolean;
    hue: number;
    position: { x: number; y: number };
}

interface SparkInstance {
    tick(): void;
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
let trails: TrailInstance[] = [];
let sparks: SparkInstance[] = [];

function randomEdgePoint(): { x: number; y: number } {
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
        case 0: return {x: Math.random() * width, y: 0};           // top
        case 1: return {x: Math.random() * width, y: height};      // bottom
        case 2: return {x: 0, y: Math.random() * height};          // left
        default: return {x: width, y: Math.random() * height};     // right
    }
}

async function onClick(evt: MouseEvent): Promise<void> {
    if (!containerRef.value) {
        return;
    }

    const { Trail } = await import('@basmilius/sparkle');
    const rect = containerRef.value.getBoundingClientRect();
    const end = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};

    for (let i = 0; i < 5; i++) {
        trails.push(new Trail(randomEdgePoint(), end, {hue: Math.random() * 360, width: 3, length: 8}));
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

    for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].tick();
        sparks.push(...trails[i].collectSparks());

        if (trails[i].isDone) {
            trails.splice(i, 1);
        } else {
            trails[i].draw(ctx);
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
    trails = [];
    sparks = [];
    ctx = null;
});
</script>
