<script
    setup
    lang="ts">
    import type { ColorsControl } from '../../config/types';

    const props = defineProps<{ control: ColorsControl; modelValue: string[] }>();
    const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

    function updateColor(index: number, color: string): void {
        const updated = [...props.modelValue];
        updated[index] = color;
        emit('update:modelValue', updated);
    }

    function addColor(): void {
        emit('update:modelValue', [...props.modelValue, '#ffffff']);
    }

    function removeColor(index: number): void {
        if (props.modelValue.length <= 1) {
            return;
        }
        const updated = [...props.modelValue];
        updated.splice(index, 1);
        emit('update:modelValue', updated);
    }
</script>

<template>
    <div class="control control-colors">
        <label>{{ control.label }}</label>
        <div class="colors-list">
            <div
                v-for="(color, index) in modelValue"
                :key="index"
                class="colors-item"
            >
                <input
                    type="color"
                    :value="color"
                    @input="(evt) => updateColor(index, (evt.target as HTMLInputElement).value)"
                />
                <span class="color-hex">{{ color }}</span>
                <button
                    class="colors-remove"
                    type="button"
                    @click="removeColor(index)"
                >✕
                </button>
            </div>
            <button
                class="colors-add"
                type="button"
                @click="addColor">+ Add color
            </button>
        </div>
    </div>
</template>
