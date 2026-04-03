<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { AuroraSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: AuroraSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new AuroraSimulation(canvasRef.value, {
                bands: 6,
                intensity: 1,
                waveAmplitude: 1.5,
                speed: 1.5
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
