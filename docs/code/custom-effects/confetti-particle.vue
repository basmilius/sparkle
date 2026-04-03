<template>
    <div ref="containerRef" class="effect-demo effect-demo--clickable" @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click anywhere</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface ConfettiInstance {
    tick(dt?: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDead: boolean;
}

type ConfettiShape = 'bowtie' | 'circle' | 'crescent' | 'diamond' | 'heart' | 'hexagon' | 'ribbon' | 'ring' | 'square' | 'star' | 'triangle';

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();

let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let running = false;
let animFrame = 0;
let particles: ConfettiInstance[] = [];

const SHAPES: ConfettiShape[] = ['bowtie', 'circle', 'crescent', 'diamond', 'heart', 'hexagon', 'ribbon', 'ring', 'square', 'star', 'triangle'];
const COLORS = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

async function onClick(evt: MouseEvent): Promise<void> {
    if (!containerRef.value) {
        return;
    }

    const { ConfettiParticle } = await import('@basmilius/sparkle');
    const rect = containerRef.value.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    for (let i = 0; i < 60; i++) {
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        particles.push(new ConfettiParticle(
            {x, y},
            90,
            shape,
            color,
            {spread: 120, startVelocity: 25, ticks: 180}
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

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].tick();

        if (particles[i].isDead) {
            particles.splice(i, 1);
        } else {
            particles[i].draw(ctx);
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
    particles = [];
    ctx = null;
});
</script>
