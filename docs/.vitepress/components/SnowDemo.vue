<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createSnow } from '@basmilius/sparkle';
    import type { Effect, SnowConfig } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: Effect<SnowConfig> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createSnow();
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>

<template>
    <div class="effect-demo effect-demo--blue">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>
