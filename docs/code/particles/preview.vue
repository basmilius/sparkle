<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Move your mouse over the canvas</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let sim: { start(): void; destroy(): void } | null = null;

onMounted(async () => {
    const { ParticleSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new ParticleSimulation(canvasRef.value, {
            mouseMode: 'connect'
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
