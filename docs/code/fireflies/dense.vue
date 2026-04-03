<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { FireflySimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: FireflySimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new FireflySimulation(canvasRef.value, {
                count: 150,
                size: 8,
                glowSpeed: 1.5
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
