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
    import { ConfettiSimulation } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    let sim: ConfettiSimulation | null = null;

    function celebrate(): void {
        if (!sim) {
            return;
        }

        sim.fire({
            angle: 45,
            spread: 50,
            particles: 80,
            startVelocity: 50,
            x: 0,
            y: 0.7
        });

        sim.fire({
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
            sim = new ConfettiSimulation(canvasRef.value);
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
