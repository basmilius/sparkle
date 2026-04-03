<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createLightning, createRain, createScene } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createScene> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createScene()
                .mount(canvasRef.value)
                .layer(createRain({variant: 'downpour'}))
                .layer(createLightning({branches: true, frequency: 0.4}));
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
