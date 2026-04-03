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
            mode: 'shooting',
            shootingInterval: [30, 90],
            shootingSpeed: 1.5,
            trailLength: 20
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
