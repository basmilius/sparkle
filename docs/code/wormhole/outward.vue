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
    const { WormholeSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new WormholeSimulation(canvasRef.value, {
            direction: 'outward',
            speed: 1.5,
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
