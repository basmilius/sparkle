<template>
    <EffectDemo ref="containerRef">
        <canvas ref="canvasRef"></canvas>

        <div
            v-if="ready"
            class="effect-demo__controls">
            <button
                v-for="variant in variants"
                :key="variant"
                @click="fire(variant)">
                {{ variant }}
            </button>
        </div>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createFireworks, FIREWORK_VARIANTS } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    const containerRef = ref<HTMLDivElement>();
    const ready = ref(false);
    const variants = ref<string[]>([]);
    let sim: ReturnType<typeof createFireworks> | null = null;

    function fire(variant: string): void {
        if (!sim || !containerRef.value) {
            return;
        }

        const rect = containerRef.value.getBoundingClientRect();

        sim.launch(variant, {
            x: rect.width * (0.2 + Math.random() * 0.6),
            y: rect.height * (0.15 + Math.random() * 0.35)
        });
    }

    onMounted(() => {
        variants.value = [...FIREWORK_VARIANTS];

        if (canvasRef.value) {
            sim = createFireworks({autoSpawn: false});
            sim.mount(canvasRef.value).start();
            ready.value = true;
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
