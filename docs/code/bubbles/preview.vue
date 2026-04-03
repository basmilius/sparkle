<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click to pop bubbles</span>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { BubbleSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: BubbleSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new BubbleSimulation(canvasRef.value);
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
