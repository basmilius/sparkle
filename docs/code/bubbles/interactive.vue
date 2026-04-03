<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click to pop bubbles</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let sim: { start(): void; destroy(): void } | null = null;

onMounted(async () => {
    const { BubbleSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new BubbleSimulation(canvasRef.value, {
            count: 50,
            sizeRange: [15, 50],
            popOnClick: true,
            popRadius: 80
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
