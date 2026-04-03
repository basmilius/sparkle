<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createStars } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createStars> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createStars({mode: 'both'});
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
