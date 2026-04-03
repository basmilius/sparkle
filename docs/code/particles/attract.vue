<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Move your mouse to attract particles</span>
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
            mouseMode: 'attract',
            mouseStrength: 0.05,
            mouseRadius: 200
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
