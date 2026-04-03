<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createBalloons, createScene, createSnow } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createScene> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createScene()
                .mount(canvasRef.value)
                .layer(createSnow())
                .layer(createBalloons({count: 8}));
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
