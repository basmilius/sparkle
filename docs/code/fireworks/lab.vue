<template>
    <div ref="containerRef" class="effect-demo">
        <canvas ref="canvasRef"></canvas>

        <div v-if="ready" class="effect-demo__controls">
            <button v-for="variant in variants"
                    :key="variant"
                    @click="fire(variant)">
                {{ variant }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();
const ready = ref(false);
const variants = ref<string[]>([]);
let sim: { fireExplosion(variant: string, position: { x: number; y: number }): void; start(): void; destroy(): void } | null = null;

function fire(variant: string): void {
    if (!sim || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();

    sim.fireExplosion(variant, {
        x: rect.width * (0.2 + Math.random() * 0.6),
        y: rect.height * (0.15 + Math.random() * 0.35)
    });
}

onMounted(async () => {
    const { FIREWORK_VARIANTS, FireworkSimulation } = await import('@basmilius/sparkle');

    variants.value = [...FIREWORK_VARIANTS];

    if (canvasRef.value) {
        sim = new FireworkSimulation(canvasRef.value, {autoSpawn: false});
        sim.start();
        ready.value = true;
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
