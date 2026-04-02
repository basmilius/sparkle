<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>

        <div class="effect-demo__controls">
            <button @click="celebrate">Celebrate!</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let sim: { fire(config: Record<string, unknown>): void; destroy(): void } | null = null;

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

onMounted(async () => {
    const { ConfettiSimulation } = await import('@basmilius/effects');

    if (canvasRef.value) {
        sim = new ConfettiSimulation(canvasRef.value, {scale: 0.5});
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
