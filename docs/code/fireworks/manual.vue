<template>
    <div ref="containerRef" class="effect-demo effect-demo--dark effect-demo--clickable">
        <canvas ref="canvasRef"></canvas>

        <span class="effect-demo__hint">Click anywhere to fire a random explosion</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();
let sim: { fireExplosion(variant: string, position: { x: number; y: number }): void; destroy(): void } | null = null;
let variants: string[] = [];

function onClick(evt: MouseEvent): void {
    if (!sim || !containerRef.value || variants.length === 0) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    const variant = variants[Math.floor(Math.random() * variants.length)];

    sim.fireExplosion(variant, {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    });
}

onMounted(async () => {
    const { FIREWORK_VARIANTS, FireworkSimulation } = await import('@basmilius/effects');

    variants = [...FIREWORK_VARIANTS];

    if (canvasRef.value && containerRef.value) {
        sim = new FireworkSimulation(canvasRef.value, {scale: 0.5, autoSpawn: false});
        sim.start();
        containerRef.value.addEventListener('click', onClick);
    }
});

onUnmounted(() => {
    containerRef.value?.removeEventListener('click', onClick);
    sim?.destroy();
    sim = null;
});
</script>
