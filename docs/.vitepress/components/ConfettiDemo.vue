<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { ConfettiSimulation } from '@basmilius/effects';

    const canvasRef = ref<HTMLCanvasElement>();
    const containerRef = ref<HTMLDivElement>();
    let sim: ConfettiSimulation | null = null;

    function onClick(evt: MouseEvent): void {
        if (!sim || !containerRef.value) {
            return;
        }

        const rect = containerRef.value.getBoundingClientRect();

        sim.fire({
            angle: 90,
            spread: 60,
            particles: 120,
            startVelocity: 45,
            x: (evt.clientX - rect.left) / rect.width,
            y: (evt.clientY - rect.top) / rect.height
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

<template>
    <div
        ref="containerRef"
        class="effect-demo effect-demo--dark effect-demo--clickable"
        @click="onClick">
        <canvas ref="canvasRef"></canvas>

        <span class="effect-demo__hint">Click anywhere</span>
    </div>
</template>
