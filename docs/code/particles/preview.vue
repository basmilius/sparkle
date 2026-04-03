<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Move your mouse over the canvas</span>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createParticles } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createParticles> | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = createParticles({
                mouseMode: 'connect'
            });
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
