<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click to pop bubbles</span>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createBubbles } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createBubbles> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createBubbles({
                count: 50,
                sizeRange: [15, 50],
                popOnClick: true,
                popRadius: 80
            });
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
