<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { BalloonSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: BalloonSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new BalloonSimulation(canvasRef.value, {
                count: 30,
                sizeRange: [20, 55],
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
