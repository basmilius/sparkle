<script
    setup
    lang="ts">
    import type { ColorControl } from '../../config/types';

    const props = defineProps<{ control: ColorControl; modelValue: string }>();
    const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

    function onInput(evt: Event): void {
        emit('update:modelValue', (evt.target as HTMLInputElement).value);
    }
</script>

<template>
    <div class="control control-color">
        <label>{{ control.label }}</label>
        <div class="color-input-wrap">
            <input
                type="color"
                :value="modelValue"
                @input="onInput"
            />
            <span class="color-hex">{{ modelValue }}</span>
        </div>
    </div>
</template>
