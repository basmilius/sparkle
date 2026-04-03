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
    const { LayeredSimulation, LightningLayer, RainLayer } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new LayeredSimulation(canvasRef.value)
            .add(new RainLayer({ variant: 'downpour' }))
            .add(new LightningLayer({ branches: true, frequency: 0.4 }));
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
