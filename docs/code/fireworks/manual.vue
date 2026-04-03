<template>
    <EffectDemo
        ref="containerRef"
        clickable>
        <canvas ref="canvasRef"></canvas>

        <span class="effect-demo__hint">Click anywhere to fire a random explosion</span>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createFireworks, FIREWORK_VARIANTS } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    const containerRef = ref<HTMLDivElement>();
    let sim: ReturnType<typeof createFireworks> | null = null;
    let variants: string[] = [];

    function onClick(evt: MouseEvent): void {
        if (!sim || !containerRef.value || variants.length === 0) {
            return;
        }

        const rect = containerRef.value.getBoundingClientRect();
        const variant = variants[Math.floor(Math.random() * variants.length)];

        sim.launch(variant, {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        });
    }

    onMounted(() => {
        variants = [...FIREWORK_VARIANTS];

        if (canvasRef.value && containerRef.value) {
            sim = createFireworks({autoSpawn: false});
            sim.mount(canvasRef.value).start();
            containerRef.value.addEventListener('click', onClick);
        }
    });

    onUnmounted(() => {
        containerRef.value?.removeEventListener('click', onClick);
        sim?.destroy();
        sim = null;
    });
</script>
