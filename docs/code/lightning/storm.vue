<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { LightningSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: LightningSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new LightningSimulation(canvasRef.value, {frequency: 3, flash: true});
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
