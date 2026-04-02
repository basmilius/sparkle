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
    const { GlitterSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new GlitterSimulation(canvasRef.value, {
            colors: ['#ffd700', '#ffb700', '#daa520'],
            count: 120,
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
