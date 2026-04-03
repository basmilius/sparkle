<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { PlasmaSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: PlasmaSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new PlasmaSimulation(canvasRef.value, {
                speed: 2,
                resolution: 6
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
