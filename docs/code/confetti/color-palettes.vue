<template>
    <EffectDemo ref="containerRef" clickable @click="onClick">
        <canvas ref="canvasRef"></canvas>

        <div class="effect-demo__controls">
            <button v-for="(name, key) in paletteNames" :key="key" :style="buttonStyle(key)" @click.stop="onSelect(key, $event)">
                {{ name }}
            </button>
        </div>
    </EffectDemo>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Palette } from '@basmilius/sparkle';

const paletteNames: Record<Palette, string> = {
    classic: 'Classic',
    pastel: 'Soft Pastels',
    vibrant: 'Vibrant Modern',
    warm: 'Rich & Warm'
};

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();
const activePalette = ref<Palette>('vibrant');
let sim: { fire(config: Record<string, unknown>): void; destroy(): void } | null = null;

function buttonStyle(palette: Palette): Record<string, string> {
    if (palette !== activePalette.value) {
        return {};
    }

    return {
        background: 'rgba(255, 255, 255, .2)',
        borderColor: 'rgba(255, 255, 255, .3)',
        color: 'white'
    };
}

function onSelect(palette: Palette, evt: MouseEvent): void {
    activePalette.value = palette;

    if (!sim || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();

    sim.fire({
        angle: 90,
        spread: 70,
        particles: 120,
        startVelocity: 45,
        palette,
        x: (evt.clientX - rect.left) / rect.width,
        y: (evt.clientY - rect.top) / rect.height
    });
}

function onClick(evt: MouseEvent): void {
    if (!sim || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();

    sim.fire({
        angle: 90,
        spread: 70,
        particles: 120,
        startVelocity: 45,
        palette: activePalette.value,
        x: (evt.clientX - rect.left) / rect.width,
        y: (evt.clientY - rect.top) / rect.height
    });
}

onMounted(async () => {
    const { ConfettiSimulation } = await import('@basmilius/sparkle');

    if (canvasRef.value) {
        sim = new ConfettiSimulation(canvasRef.value);
    }
});

onUnmounted(() => {
    sim?.destroy();
    sim = null;
});
</script>
