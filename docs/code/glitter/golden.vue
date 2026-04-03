<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { GlitterSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: GlitterSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new GlitterSimulation(canvasRef.value, {
                colors: ['#ffd700', '#ffb700', '#daa520'],
                count: 120
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
