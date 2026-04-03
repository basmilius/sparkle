<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Move your mouse to repel particles</span>
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
                mouseMode: 'repel',
                mouseStrength: 0.06,
                mouseRadius: 180,
                glow: true,
                color: '#22d3ee',
                lineColor: '#22d3ee'
            });
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
