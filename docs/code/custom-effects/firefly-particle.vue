<template>
    <div ref="containerRef" class="effect-demo">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface FireflyInstance {
    tick(dt?: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
}

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();

let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let running = false;
let animFrame = 0;
let fireflies: FireflyInstance[] = [];

function loop(): void {
    if (!running || !canvasRef.value || !ctx) {
        return;
    }

    animFrame = requestAnimationFrame(loop);

    canvasRef.value.width = width;
    canvasRef.value.height = height;

    ctx.globalCompositeOperation = 'lighter';

    for (const firefly of fireflies) {
        firefly.tick();
        firefly.draw(ctx);
    }

    ctx.globalCompositeOperation = 'source-over';
}

onMounted(async () => {
    if (!canvasRef.value || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    const { FireflyParticle, createFireflySprite } = await import('@basmilius/sparkle');

    // One sprite shared across all particles of the same color
    const greenSprite = createFireflySprite('#b4ff6a');
    const amberSprite = createFireflySprite('#ffcc44');
    const bounds = {width, height};

    for (let i = 0; i < 40; i++) {
        const sprite = Math.random() < 0.7 ? greenSprite : amberSprite;
        fireflies.push(new FireflyParticle(
            Math.random() * width,
            Math.random() * height,
            bounds,
            sprite,
            {size: 4 + Math.random() * 4}
        ));
    }

    ctx = canvasRef.value.getContext('2d', {colorSpace: 'display-p3'});
    running = true;
    animFrame = requestAnimationFrame(loop);
});

onUnmounted(() => {
    running = false;
    cancelAnimationFrame(animFrame);
    fireflies = [];
    ctx = null;
});
</script>
