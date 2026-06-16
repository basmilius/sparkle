<template>
    <EffectDemo>
        <canvas ref="canvasRef"></canvas>

        <div class="effect-demo__controls">
            <button @click="toggle">{{ paused ? 'Resume' : 'Pause' }}</button>
            <button
                :style="buttonStyle(0.5)"
                @click="setSpeed(0.5)">
                Gentle
            </button>
            <button
                :style="buttonStyle(1)"
                @click="setSpeed(1)">
                Normal
            </button>
            <button
                :style="buttonStyle(2.5)"
                @click="setSpeed(2.5)">
                Blizzard
            </button>
        </div>
    </EffectDemo>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { createSnow } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    const paused = ref(false);
    const speed = ref(1);
    let sim: ReturnType<typeof createSnow> | null = null;

    function buttonStyle(value: number): Record<string, string> {
        if (value !== speed.value) {
            return {};
        }

        return {
            background: 'rgba(255, 255, 255, .2)',
            borderColor: 'rgba(255, 255, 255, .3)',
            color: 'white'
        };
    }

    function toggle(): void {
        if (!sim) {
            return;
        }

        if (paused.value) {
            sim.resume();
        } else {
            sim.pause();
        }

        paused.value = !paused.value;
    }

    function setSpeed(value: number): void {
        speed.value = value;
        sim?.configure({speed: value});
    }

    onMounted(() => {
        if (canvasRef.value) {
            sim = createSnow();
            sim.mount(canvasRef.value).start();
        }
    });

    onUnmounted(() => {
        sim?.destroy();
        sim = null;
    });
</script>
