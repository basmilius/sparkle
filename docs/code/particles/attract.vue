<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Move your mouse to attract particles</span>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { ParticleSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ParticleSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new ParticleSimulation(canvasRef.value, {
                mouseMode: 'attract',
                mouseStrength: 0.05,
                mouseRadius: 200
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
