<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let sim: { start(): void; destroy(): void } | null = null;

onMounted(async () => {
    const { AuroraLayer, LayeredSimulation, StarLayer } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new LayeredSimulation(canvasRef.value)
            .add(new AuroraLayer())
            .add(new StarLayer({ mode: 'both' }).withFade({ bottom: [0.3, 0.5] }));
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
