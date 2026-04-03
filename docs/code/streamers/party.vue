<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { StreamerSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: StreamerSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new StreamerSimulation(canvasRef.value, {count: 40, speed: 1.5});
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
