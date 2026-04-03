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
    const { FirepitSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new FirepitSimulation(canvasRef.value, {
            embers: 120,
            intensity: 1.5,
            flameHeight: 0.45
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
