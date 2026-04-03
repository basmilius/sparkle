<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import type { FireworkVariant } from '@basmilius/sparkle';
    import { createFireworks, FIREWORK_VARIANTS } from '@basmilius/sparkle';
    import type { FireworksInstance } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    const containerRef = ref<HTMLDivElement>();
    let sim: FireworksInstance | null = null;

    function fire(variant: FireworkVariant): void {
        if (!sim || !containerRef.value) {
            return;
        }

        const rect = containerRef.value.getBoundingClientRect();

        sim.launch(variant, {
            x: rect.width * (0.2 + Math.random() * 0.6),
            y: rect.height * (0.2 + Math.random() * 0.3)
        });
    }

    onMounted(() => {
        if (canvasRef.value) {
            sim = createFireworks({ autoSpawn: false });
            sim.mount(canvasRef.value).start();
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
        class="effect-demo effect-demo--dark">
        <canvas ref="canvasRef"></canvas>

        <div class="effect-demo__controls">
            <button
                v-for="variant in FIREWORK_VARIANTS"
                :key="variant"
                @click="fire(variant as FireworkVariant)">
                {{ variant }}
            </button>
        </div>
    </div>
</template>
