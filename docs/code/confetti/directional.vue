<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>

        <div class="effect-demo__controls">
            <button @click="celebrate">Celebrate!</button>
        </div>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createConfetti } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ReturnType<typeof createConfetti> | null = null;

    function celebrate(): void {
        if (!sim) {
            return;
        }

        sim.burst({
            angle: 45,
            spread: 50,
            particles: 80,
            startVelocity: 50,
            x: 0,
            y: 0.7
        });

        sim.burst({
            angle: 135,
            spread: 50,
            particles: 80,
            startVelocity: 50,
            x: 1,
            y: 0.7
        });
    }

    onMounted(() => {
        if (canvasRef.value) {
            sim = createConfetti();
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
