<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createFireworks } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createFireworks> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createFireworks();
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
