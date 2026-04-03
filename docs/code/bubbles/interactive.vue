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
            sim = new BubbleSimulation(canvasRef.value, {
                count: 50,
                sizeRange: [15, 50],
                popOnClick: true,
                popRadius: 80
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
