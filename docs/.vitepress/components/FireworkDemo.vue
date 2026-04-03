<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { FireworkSimulation } from '@basmilius/effects';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: FireworkSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new FireworkSimulation(canvasRef.value);
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>

<template>
    <div class="effect-demo effect-demo--dark">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>
