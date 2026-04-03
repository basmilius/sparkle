<script setup lang="ts">
    import { LimitedFrameRateCanvas } from '@basmilius/sparkle';
    import { onMounted, onUnmounted, ref } from 'vue';
    import { FIREWORK_VARIANTS, SIMULATOR_MAP } from '../config/registry';
    import type { SimInstance } from '../config/types';
    import ConfigPanel from '../components/ConfigPanel.vue';

    const props = defineProps<{ id: string }>();

    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const config = ref<Record<string, unknown>>({});
    const globalSpeed = ref(LimitedFrameRateCanvas.globalSpeed);

    // Bewust geen ref() — Vue's Proxy breekt private class fields (#-syntax)
    let sim: SimInstance | null = null;

    const def = SIMULATOR_MAP.get(props.id);
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    function onConfettiClick(evt: MouseEvent): void {
        (sim as any)?.fire?.({
            ...config.value,
            x: evt.clientX / innerWidth,
            y: evt.clientY / innerHeight
        });
    }

    function onFireworksClick(evt: MouseEvent): void {
        const variant = FIREWORK_VARIANTS[Math.floor(Math.random() * FIREWORK_VARIANTS.length)];
        (sim as any)?.fireExplosion?.(variant, { x: evt.clientX, y: evt.clientY });
    }

    function initConfig(): void {
        if (!def) {
            return;
        }
        config.value = { ...def.defaultConfig };
    }

    function startSim(): void {
        if (!def || !canvasRef.value) {
            return;
        }
        sim?.destroy();
        sim = def.create(canvasRef.value, config.value);
    }

    function onConfigChange(key: string, value: unknown): void {
        config.value = { ...config.value, [key]: value };

        if (def?.liveKeys.includes(key)) {
            sim?.configure?.({ [key]: value });
        } else {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(startSim, 350);
        }
    }

    function fireVariant(variant: string): void {
        (sim as any)?.fireExplosion?.(variant, {
            x: innerWidth * 0.2 + Math.random() * innerWidth * 0.6,
            y: innerHeight * 0.15 + Math.random() * innerHeight * 0.35
        });
    }

    function onSpeedChange(val: number): void {
        globalSpeed.value = val;
        LimitedFrameRateCanvas.globalSpeed = val;
    }

    onMounted(() => {
        initConfig();
        startSim();

        if (def?.interactive === 'confetti') {
            canvasRef.value?.addEventListener('click', onConfettiClick, { passive: true });
        }
        if (def?.interactive === 'fireworks') {
            canvasRef.value?.addEventListener('click', onFireworksClick, { passive: true });
        }
    });

    onUnmounted(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        canvasRef.value?.removeEventListener('click', onConfettiClick);
        canvasRef.value?.removeEventListener('click', onFireworksClick);
        sim?.destroy();
        sim = null;
    });
</script>

<template>
    <div class="sim-view">
        <canvas ref="canvasRef" class="sim-canvas" />

        <template v-if="!def">
            <div class="sim-not-found">Simulator "{{ id }}" not found.</div>
        </template>

        <template v-else>
            <div v-if="def.interactive === 'confetti'" class="sim-hint">
                Click anywhere to fire confetti
            </div>

            <div v-if="def.interactive === 'fireworks'" class="sim-hint">
                Click anywhere to fire a random variant
            </div>

            <div v-if="def.interactive === 'fireworks'" class="fireworks-variants">
                <button
                    v-for="variant in FIREWORK_VARIANTS"
                    :key="variant"
                    class="variant-btn"
                    type="button"
                    @click="fireVariant(variant)"
                >{{ variant }}</button>
            </div>

            <div class="sim-panel-wrap">
                <ConfigPanel
                    :title="def.name"
                    :schema="def.schema"
                    :config="config"
                    @change="onConfigChange"
                >
                    <template #prepend>
                        <p class="sim-description">{{ def.description }}</p>
                        <div class="control">
                            <div class="control-header">
                                <label>Global Speed</label>
                                <span class="control-value">{{ globalSpeed.toFixed(1) }}</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="4"
                                step="0.1"
                                :value="globalSpeed"
                                @input="(e) => onSpeedChange(parseFloat((e.target as HTMLInputElement).value))"
                            />
                        </div>
                        <div class="panel-sep" />
                    </template>
                    <template #append>
                        <button class="restart-btn" type="button" @click="startSim">Restart</button>
                    </template>
                </ConfigPanel>
            </div>
        </template>
    </div>
</template>
