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
                mode: 'shooting',
                shootingInterval: [30, 90],
                shootingSpeed: 1.5,
                trailLength: 20
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
