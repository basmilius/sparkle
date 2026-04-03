<script setup lang="ts">
    import { ref } from 'vue';
    import type { ControlDef } from '../config/types';
    import ColorControl from './controls/ColorControl.vue';
    import ColorsControl from './controls/ColorsControl.vue';
    import MultiSelectControl from './controls/MultiSelectControl.vue';
    import RangeControl from './controls/RangeControl.vue';
    import SelectControl from './controls/SelectControl.vue';
    import SliderControl from './controls/SliderControl.vue';
    import ToggleControl from './controls/ToggleControl.vue';

    const props = defineProps<{
        title: string;
        schema: ControlDef[];
        config: Record<string, unknown>;
    }>();

    const emit = defineEmits<{ change: [key: string, value: unknown] }>();
    const isOpen = ref(true);

    function update(key: string, value: unknown): void {
        emit('change', key, value);
    }
</script>

<template>
    <div class="config-panel" :class="{ 'is-open': isOpen }">
        <button class="config-panel-toggle" type="button" @click="isOpen = !isOpen">
            <span class="config-panel-title">{{ title }}</span>
            <svg
                class="config-panel-chevron"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>

        <div v-if="isOpen" class="config-panel-body">
            <slot name="prepend" />

            <template v-for="control in schema" :key="control.key">
                <SliderControl
                    v-if="control.type === 'slider'"
                    :control="control"
                    :model-value="(config[control.key] ?? control.default) as number"
                    @update:model-value="(val) => update(control.key, val)"
                />
                <ToggleControl
                    v-else-if="control.type === 'toggle'"
                    :control="control"
                    :model-value="(config[control.key] ?? control.default) as boolean"
                    @update:model-value="(val) => update(control.key, val)"
                />
                <ColorControl
                    v-else-if="control.type === 'color'"
                    :control="control"
                    :model-value="(config[control.key] ?? control.default) as string"
                    @update:model-value="(val) => update(control.key, val)"
                />
                <SelectControl
                    v-else-if="control.type === 'select'"
                    :control="control"
                    :model-value="(config[control.key] ?? control.default) as string"
                    @update:model-value="(val) => update(control.key, val)"
                />
                <RangeControl
                    v-else-if="control.type === 'range'"
                    :control="control"
                    :model-value="(config[control.key] ?? control.default) as [number, number]"
                    @update:model-value="(val) => update(control.key, val)"
                />
                <ColorsControl
                    v-else-if="control.type === 'colors'"
                    :control="control"
                    :model-value="(config[control.key] ?? control.default) as string[]"
                    @update:model-value="(val) => update(control.key, val)"
                />
                <MultiSelectControl
                    v-else-if="control.type === 'multiselect'"
                    :control="control"
                    :model-value="(config[control.key] ?? control.default) as string[]"
                    @update:model-value="(val) => update(control.key, val)"
                />
            </template>

            <slot name="append" />
        </div>
    </div>
</template>
