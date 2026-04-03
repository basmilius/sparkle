<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createSandstorm } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createSandstorm> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createSandstorm({
                count: 500,
                wind: 1.5,
                turbulence: 1.5,
                hazeOpacity: 0.25
            });
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
