<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { BalloonLayer, LayeredSimulation, SnowLayer } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: LayeredSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new LayeredSimulation(canvasRef.value)
                .add(new SnowLayer())
                .add(new BalloonLayer({count: 8}));
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
