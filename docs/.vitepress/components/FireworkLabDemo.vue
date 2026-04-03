<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { FIREWORK_VARIANTS, FireworkSimulation } from '@basmilius/effects';
import type { FireworkVariant } from '@basmilius/effects';

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();
let sim: FireworkSimulation | null = null;

function fire(variant: FireworkVariant): void {
    if (!sim || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();

    sim.fireExplosion(variant, {
        x: rect.width * (0.2 + Math.random() * 0.6),
        y: rect.height * (0.2 + Math.random() * 0.3)
    });
}

onMounted(() => {
    if (canvasRef.value) {
        sim = new FireworkSimulation(canvasRef.value, {autoSpawn: false});
        sim.start();
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>

<template>
    <div ref="containerRef" class="effect-demo effect-demo--dark">
        <canvas ref="canvasRef"></canvas>

        <div class="effect-demo__controls">
            <button v-for="variant in FIREWORK_VARIANTS"
                    :key="variant"
                    @click="fire(variant as FireworkVariant)">
                {{ variant }}
            </button>
        </div>
    </div>
</template>
