<script
    setup
    lang="ts">
    import type { ToggleControl } from '../../config/types';

    const props = defineProps<{ control: ToggleControl; modelValue: boolean }>();
    const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
    <div class="control control-toggle">
        <label>{{ control.label }}</label>
        <button
            class="toggle"
            :class="{ 'is-on': modelValue }"
            type="button"
            @click="emit('update:modelValue', !modelValue)"
        >
            <span class="toggle-knob"/>
        </button>
    </div>
</template>
