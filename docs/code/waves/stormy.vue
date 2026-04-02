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
    const { WaveSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new WaveSimulation(canvasRef.value, {speed: 2, foamAmount: 0.7, scale: 0.5});
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
