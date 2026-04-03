<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { LayeredSimulation, LightningLayer, RainLayer } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: LayeredSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new LayeredSimulation(canvasRef.value)
                .add(new RainLayer({variant: 'downpour'}))
                .add(new LightningLayer({branches: true, frequency: 0.4}));
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
