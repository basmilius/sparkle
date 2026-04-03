<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { SnowSimulation } from '@basmilius/effects';

const canvasRef = ref<HTMLCanvasElement>();
let sim: SnowSimulation | null = null;

onMounted(() => {
    if (canvasRef.value) {
        sim = new SnowSimulation(canvasRef.value);
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>

<template>
    <div class="effect-demo effect-demo--blue">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>
