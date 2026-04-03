<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { StarSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: StarSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new StarSimulation(canvasRef.value, {
                mode: 'sky',
                starCount: 250,
                twinkleSpeed: 1.5
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
