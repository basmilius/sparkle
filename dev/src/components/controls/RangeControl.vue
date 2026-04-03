<script
    setup
    lang="ts">
    import type { RangeControl } from '../../config/types';

    const props = defineProps<{ control: RangeControl; modelValue: [number, number] }>();
    const emit = defineEmits<{ 'update:modelValue': [value: [number, number]] }>();

    function onMinInput(evt: Event): void {
        const val = parseFloat((evt.target as HTMLInputElement).value);
        emit('update:modelValue', [Math.min(val, props.modelValue[1]), props.modelValue[1]]);
    }

    function onMaxInput(evt: Event): void {
        const val = parseFloat((evt.target as HTMLInputElement).value);
        emit('update:modelValue', [props.modelValue[0], Math.max(val, props.modelValue[0])]);
    }
</script>

<template>
    <div class="control control-range">
        <label>{{ control.label }}</label>
        <div class="range-row">
            <div class="range-field">
                <span class="range-label">Min</span>
                <input
                    type="range"
                    :min="control.min"
                    :max="control.max"
                    :step="control.step"
                    :value="modelValue[0]"
                    @input="onMinInput"
                />
                <span class="control-value">{{ modelValue[0] }}</span>
            </div>
            <div class="range-field">
                <span class="range-label">Max</span>
                <input
                    type="range"
                    :min="control.min"
                    :max="control.max"
                    :step="control.step"
                    :value="modelValue[1]"
                    @input="onMaxInput"
                />
                <span class="control-value">{{ modelValue[1] }}</span>
            </div>
        </div>
    </div>
</template>
