<template>
    <div
        ref="el"
        v-bind="$attrs"
        class="effect-demo"
        :class="{'effect-demo--clickable': clickable}">
        <slot/>

        <div class="effect-demo__speed">
            <button
                :class="{'effect-demo__speed-button--active': fpsEnabled}"
                @click.stop="toggleFps">
                FPS
            </button>

            <div class="effect-demo__speed-divider"/>

            <button
                v-for="option in FRAME_RATE_OPTIONS"
                :key="String(option.value)"
                :class="{'effect-demo__speed-button--active': frameRate === option.value}"
                @click.stop="setFrameRate(option.value)">
                {{ option.label }}
            </button>

            <div class="effect-demo__speed-divider"/>

            <button
                v-for="option in SPEED_OPTIONS"
                :key="option.value"
                :class="{'effect-demo__speed-button--active': speed === option.value}"
                @click.stop="setSpeed(option.value)">
                {{ option.label }}
            </button>
        </div>
    </div>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import { speed } from './useSpeed';
    import { fpsEnabled, toggleFps } from './useFps';
    import { frameRate } from './useFrameRate';

    const FRAME_RATE_OPTIONS = [
        {label: '15fps', value: 15},
        {label: '30fps', value: 30},
        {label: '60fps', value: null},
        {label: '∞', value: 0}
    ] as const;

    const SPEED_OPTIONS = [
        {label: '1x', value: 1},
        {label: '0.5x', value: 0.5},
        {label: '0.25x', value: 0.25}
    ] as const;

    const props = defineProps<{
        clickable?: boolean;
    }>();

    defineOptions({inheritAttrs: false});

    const el = ref<HTMLDivElement>();

    let Canvas: { globalSpeed: number; globalFrameRate: number | null; showFps: boolean } | null = null;

    onMounted(async () => {
        const {LimitedFrameRateCanvas} = await import('@basmilius/sparkle');
        Canvas = LimitedFrameRateCanvas;
        Canvas.globalSpeed = speed.value;
        Canvas.globalFrameRate = frameRate.value;
        Canvas.showFps = fpsEnabled.value;
    });

    onUnmounted(() => {
        if (Canvas) {
            Canvas.showFps = false;
        }
    });

    watch(speed, value => {
        if (Canvas) {
            Canvas.globalSpeed = value;
        }
    });

    watch(frameRate, value => {
        if (Canvas) {
            Canvas.globalFrameRate = value;
        }
    });

    watch(fpsEnabled, value => {
        if (Canvas) {
            Canvas.showFps = value;
        }
    });

    function setSpeed(value: number): void {
        speed.value = value;
    }

    function setFrameRate(value: number | null): void {
        frameRate.value = value;
    }

    defineExpose({
        getBoundingClientRect: () => el.value!.getBoundingClientRect(),
        addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) =>
            el.value!.addEventListener(type, listener, options),
        removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) =>
            el.value!.removeEventListener(type, listener, options)
    });
</script>
