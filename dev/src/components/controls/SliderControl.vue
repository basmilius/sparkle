<script
    setup
    lang="ts">
    import type { SliderControl } from '../../config/types';

    const props = defineProps<{ control: SliderControl; modelValue: number }>();
    const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

    function onInput(evt: Event): void {
        emit('update:modelValue', parseFloat((evt.target as HTMLInputElement).value));
    }
</script>

<template>
    <div class="control">
        <div class="control-header">
            <label>{{ control.label }}</label>
            <span class="control-value">{{ modelValue }}</span>
        </div>
        <input
            type="range"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :value="modelValue"
            @input="onInput"
        />
    </div>
</template>
