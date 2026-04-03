<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createFireworks } from '@basmilius/sparkle';
    import type { FireworksInstance } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: FireworksInstance | null = null;

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

<template>
    <div class="effect-demo effect-demo--dark">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>
