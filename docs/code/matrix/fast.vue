<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { MatrixSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: MatrixSimulation | null = null;

    onMounted(() => {
        if (canvasRef.value) {
            sim = new MatrixSimulation(canvasRef.value, {
                speed: 2,
                fontSize: 12,
                columns: 60
            });
            sim.start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
