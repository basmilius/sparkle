<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { PetalSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: PetalSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new PetalSimulation(canvasRef.value, {
                count: 200,
                size: 12,
                wind: 0.3
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
