<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let sim: { destroy(): void } | null = null;

onMounted(async () => {
    const { FireworkSimulation } = await import('@basmilius/effects');

    if (canvasRef.value) {
        sim = new FireworkSimulation(canvasRef.value, {scale: 0.5});
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
