<template>
    <div ref="el" v-bind="$attrs" class="effect-demo" :class="{'effect-demo--clickable': clickable}">
        <slot />

        <div class="effect-demo__speed">
            <button v-for="option in SPEED_OPTIONS"
                    :key="option.value"
                    :class="{'effect-demo__speed-button--active': speed === option.value}"
                    @click.stop="setSpeed(option.value)">
                {{ option.label }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { speed } from './useSpeed';

const SPEED_OPTIONS = [
    {label: '1x', value: 1},
    {label: '0.5x', value: 0.5},
    {label: '0.25x', value: 0.25},
] as const;

defineProps<{ clickable?: boolean }>();
defineOptions({ inheritAttrs: false });

const el = ref<HTMLDivElement>();

let Canvas: { globalSpeed: number } | null = null;

onMounted(async () => {
    const { LimitedFrameRateCanvas } = await import('@basmilius/sparkle');
    Canvas = LimitedFrameRateCanvas;
    Canvas.globalSpeed = speed.value;
});

watch(speed, value => {
    if (Canvas) {
        Canvas.globalSpeed = value;
    }
});

function setSpeed(value: number): void {
    speed.value = value;
}

defineExpose({
    getBoundingClientRect: () => el.value!.getBoundingClientRect(),
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) =>
        el.value!.addEventListener(type, listener, options),
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) =>
        el.value!.removeEventListener(type, listener, options),
});
</script>
