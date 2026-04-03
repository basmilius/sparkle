<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { FirepitSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: FirepitSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new FirepitSimulation(canvasRef.value, {
                embers: 120,
                intensity: 1.5,
                flameHeight: 0.45
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
