<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createAurora } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createAurora> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createAurora({
                bands: 6,
                intensity: 1,
                waveAmplitude: 1.5,
                speed: 1.5
            });
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
