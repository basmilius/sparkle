<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">The emitter follows a path set with moveTo()</span>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createSparklers } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createSparklers> | null = null;
    let frame = 0;
    let raf = 0;

    function animate(): void {
        if (!sim) {
            return;
        }

        // Move the emitter along a Lissajous path using normalized 0-1 coordinates.
        frame += 1;
        const t = frame / 60;
        const x = 0.5 + 0.35 * Math.sin(t * 0.9);
        const y = 0.5 + 0.25 * Math.sin(t * 1.7);
        sim.moveTo(x, y);

        raf = requestAnimationFrame(animate);
    }

    onMounted(() => {
        if (canvasRef.value) {
            sim = createSparklers();
            sim.mount(canvasRef.value).start();
            raf = requestAnimationFrame(animate);
        }
    });

    onUnmounted(() => {
        cancelAnimationFrame(raf);
        sim?.destroy();
        sim = null;
    });
</script>
