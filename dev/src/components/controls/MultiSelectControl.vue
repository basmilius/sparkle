<script
    setup
    lang="ts">
    import type { MultiSelectControl } from '../../config/types';

    const props = defineProps<{ control: MultiSelectControl; modelValue: string[] }>();
    const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

    function toggle(value: string): void {
        const current = props.modelValue;
        if (current.includes(value)) {
            if (current.length <= 1) {
                return;
            }
            emit('update:modelValue', current.filter((v) => v !== value));
        } else {
            emit('update:modelValue', [...current, value]);
        }
    }
</script>

<template>
    <div class="control control-multiselect">
        <label>{{ control.label }}</label>
        <div class="multiselect-options">
            <button
                v-for="opt in control.options"
                :key="opt.value"
                class="multiselect-option"
                :class="{ 'is-active': modelValue.includes(opt.value) }"
                type="button"
                @click="toggle(opt.value)"
            >{{ opt.label }}
            </button>
        </div>
    </div>
</template>
