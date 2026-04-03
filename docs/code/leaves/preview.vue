<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createLeaves } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createLeaves> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createLeaves();
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
