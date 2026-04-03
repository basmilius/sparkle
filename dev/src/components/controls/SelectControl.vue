<script
    setup
    lang="ts">
    import type { SelectControl } from '../../config/types';

    const props = defineProps<{ control: SelectControl; modelValue: string }>();
    const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

    function onChange(evt: Event): void {
        emit('update:modelValue', (evt.target as HTMLSelectElement).value);
    }
</script>

<template>
    <div class="control control-select">
        <label>{{ control.label }}</label>
        <select
            :value="modelValue"
            @change="onChange">
            <option
                v-for="opt in control.options"
                :key="opt.value"
                :value="opt.value"
            >{{ opt.label }}
            </option>
        </select>
    </div>
</template>
