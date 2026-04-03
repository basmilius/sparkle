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
    const { MatrixSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new MatrixSimulation(canvasRef.value, {
            speed: 2,
            fontSize: 12,
            columns: 60
        });
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
