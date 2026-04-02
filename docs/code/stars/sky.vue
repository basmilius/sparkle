<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let sim: { start(): void; destroy(): void } | null = null;

onMounted(async () => {
    const { StarSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new StarSimulation(canvasRef.value, {
            mode: 'sky',
            starCount: 250,
            twinkleSpeed: 1.5,
            scale: 0.5
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
