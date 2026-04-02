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
    const { AuroraSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new AuroraSimulation(canvasRef.value, {
            bands: 6,
            intensity: 1,
            waveAmplitude: 1.5,
            speed: 1.5
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
