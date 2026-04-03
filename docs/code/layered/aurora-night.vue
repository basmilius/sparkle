<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createAurora, createScene, createStars } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createScene> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createScene()
                .mount(canvasRef.value)
                .layer(createAurora())
                .layer(createStars({mode: 'both'}).withFade({bottom: [0.3, 0.5]}));
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
