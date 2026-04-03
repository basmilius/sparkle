<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { SandstormSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: SandstormSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new SandstormSimulation(canvasRef.value, {
                count: 500,
                wind: 1.5,
                turbulence: 1.5,
                hazeOpacity: 0.25
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
