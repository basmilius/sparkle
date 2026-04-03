<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Move your mouse over the canvas</span>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createSparklers } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createSparklers> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createSparklers({
                hoverMode: true
            });
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
