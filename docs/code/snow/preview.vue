<template>
    <div class="effect-demo effect-demo--blue">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let sim: { start(): void; destroy(): void } | null = null;

onMounted(async () => {
    const { SnowSimulation } = await import('@basmilius/effects');

    if (canvasRef.value) {
        sim = new SnowSimulation(canvasRef.value, {scale: 0.5});
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
