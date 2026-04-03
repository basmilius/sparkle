<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { LeafSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: LeafSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new LeafSimulation(canvasRef.value);
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
