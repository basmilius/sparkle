<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { AuroraLayer, LayeredSimulation, StarLayer } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: LayeredSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new LayeredSimulation(canvasRef.value)
                .add(new AuroraLayer())
                .add(new StarLayer({mode: 'both'}).withFade({bottom: [0.3, 0.5]}));
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
