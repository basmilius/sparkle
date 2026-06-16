<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>

        <span class="effect-demo__hint">{{ active ? 'Particles in flight…' : 'Idle — no particles' }}</span>

        <div class="effect-demo__controls">
            <button @click="celebrate">Burst</button>
        </div>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createConfetti } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    const active = ref(false);
    let sim: ReturnType<typeof createConfetti> | null = null;
    let poll = 0;

    function celebrate(): void {
        sim?.burst({
            angle: 90,
            spread: 70,
            particles: 120,
            startVelocity: 45,
            x: 0.5,
            y: 0.6
        });
    }

    onMounted(() => {
        if (canvasRef.value) {
            sim = createConfetti();
            sim.mount(canvasRef.value).start();

            // hasParticles reflects whether any burst is still animating.
            poll = window.setInterval(() => {
                active.value = sim?.hasParticles ?? false;
            }, 100);
        }
    });

    onUnmounted(() => {
        window.clearInterval(poll);
        sim?.destroy();
        sim = null;
    });
</script>
