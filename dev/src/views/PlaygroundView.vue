<script
    setup
    lang="ts">
    import { LimitedFrameRateCanvas, Scene, createScene } from '@basmilius/sparkle';
    import { onMounted, onUnmounted, ref } from 'vue';
    import { SIMULATOR_MAP, SIMULATORS } from '../config/registry';
    import ConfigPanel from '../components/ConfigPanel.vue';

    interface LayerEntry {
        uid: number;
        simulatorId: string;
        config: Record<string, unknown>;
        expanded: boolean;
    }

    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const layers = ref<LayerEntry[]>([]);
    const background = ref('#0f0f11');
    const showAddMenu = ref(false);
    const globalSpeed = ref(LimitedFrameRateCanvas.globalSpeed);
    let scene: Scene | null = null;
    // Holds effect instances in layer order for direct configure() calls
    const effectInstances: any[] = [];
    let uidCounter = 0;
    let rebuildTimer: ReturnType<typeof setTimeout> | null = null;

    function buildSim(): void {
        if (!canvasRef.value) {
            return;
        }

        scene?.destroy();
        scene = createScene().mount(canvasRef.value);
        effectInstances.length = 0;

        for (const entry of layers.value) {
            const def = SIMULATOR_MAP.get(entry.simulatorId);
            if (!def) {
                continue;
            }
            const effect = def.createLayer(entry.config);
            effectInstances.push(effect);
            scene.layer(effect as any);
        }

        scene.start();
    }

    function scheduleRebuild(): void {
        if (rebuildTimer) {
            clearTimeout(rebuildTimer);
        }
        rebuildTimer = setTimeout(buildSim, 350);
    }

    function addLayer(simulatorId: string): void {
        const def = SIMULATOR_MAP.get(simulatorId);
        if (!def) {
            return;
        }
        layers.value.push({
            uid: ++uidCounter,
            simulatorId,
            config: {...def.defaultConfig},
            expanded: false
        });
        showAddMenu.value = false;
        scheduleRebuild();
    }

    function removeLayer(uid: number): void {
        const index = layers.value.findIndex((layer) => layer.uid === uid);
        if (index >= 0) {
            layers.value.splice(index, 1);
            scheduleRebuild();
        }
    }

    function moveLayer(uid: number, direction: -1 | 1): void {
        const index = layers.value.findIndex((layer) => layer.uid === uid);
        if (index < 0) {
            return;
        }
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= layers.value.length) {
            return;
        }
        const copy = [...layers.value];
        [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
        layers.value = copy;
        scheduleRebuild();
    }

    function onLayerConfigChange(uid: number, key: string, value: unknown): void {
        const entry = layers.value.find((layer) => layer.uid === uid);
        if (!entry) {
            return;
        }
        entry.config = {...entry.config, [key]: value};

        const def = SIMULATOR_MAP.get(entry.simulatorId);
        if (def?.liveKeys.includes(key)) {
            const index = layers.value.indexOf(entry);
            effectInstances[index]?.configure?.({[key]: value});
        } else {
            scheduleRebuild();
        }
    }

    function onSpeedChange(val: number): void {
        globalSpeed.value = val;
        LimitedFrameRateCanvas.globalSpeed = val;
    }

    onMounted(() => {
        addLayer('aurora');
        addLayer('stars');
        if (rebuildTimer) {
            clearTimeout(rebuildTimer);
            rebuildTimer = null;
        }
        buildSim();
    });

    onUnmounted(() => {
        if (rebuildTimer) {
            clearTimeout(rebuildTimer);
        }
        scene?.destroy();
        scene = null;
    });
</script>

<template>
    <div class="sim-view">
        <div
            class="sim-canvas-bg"
            :style="{ background: background }"
        />
        <canvas
            ref="canvasRef"
            class="sim-canvas"/>

        <div class="sim-panel-wrap">
            <div class="config-panel is-open">
                <div
                    class="config-panel-toggle"
                    style="cursor: default;">
                    <span class="config-panel-title">Playground</span>
                </div>

                <div class="config-panel-body">
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

                    <div class="control control-color">
                        <label>Background</label>
                        <div class="color-input-wrap">
                            <input
                                type="color"
                                :value="background"
                                @input="(e) => background = (e.target as HTMLInputElement).value"
                            />
                            <span class="color-hex">{{ background }}</span>
                        </div>
                    </div>

                    <div class="panel-sep"/>

                    <div class="layers-header">
                        <span class="layers-title">Layers</span>
                        <div class="add-layer-wrap">
                            <button
                                class="add-layer-btn"
                                type="button"
                                @click="showAddMenu = !showAddMenu"
                            >+ Add Layer
                            </button>
                            <div
                                v-if="showAddMenu"
                                class="add-layer-menu">
                                <button
                                    v-for="s in SIMULATORS"
                                    :key="s.id"
                                    class="add-layer-item"
                                    type="button"
                                    @click="addLayer(s.id)"
                                >{{ s.name }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="layers.length === 0"
                        class="layers-empty">
                        No layers yet. Add one above.
                    </div>

                    <div class="layers-list">
                        <div
                            v-for="(entry, index) in layers"
                            :key="entry.uid"
                            class="layer-item"
                        >
                            <div class="layer-header">
                                <button
                                    class="layer-expand"
                                    type="button"
                                    @click="entry.expanded = !entry.expanded"
                                >
                                    <svg
                                        :style="{ transform: entry.expanded ? 'rotate(90deg)' : 'rotate(0deg)' }"
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                    >
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                </button>
                                <span class="layer-name">{{ SIMULATOR_MAP.get(entry.simulatorId)?.name }}</span>
                                <div class="layer-actions">
                                    <button
                                        class="layer-action"
                                        type="button"
                                        :disabled="index === 0"
                                        @click="moveLayer(entry.uid, -1)"
                                    >↑
                                    </button>
                                    <button
                                        class="layer-action"
                                        type="button"
                                        :disabled="index === layers.length - 1"
                                        @click="moveLayer(entry.uid, 1)"
                                    >↓
                                    </button>
                                    <button
                                        class="layer-action layer-action-remove"
                                        type="button"
                                        @click="removeLayer(entry.uid)"
                                    >✕
                                    </button>
                                </div>
                            </div>

                            <div
                                v-if="entry.expanded"
                                class="layer-config">
                                <ConfigPanel
                                    :title="SIMULATOR_MAP.get(entry.simulatorId)?.name ?? ''"
                                    :schema="SIMULATOR_MAP.get(entry.simulatorId)?.schema ?? []"
                                    :config="entry.config"
                                    @change="(key, val) => onLayerConfigChange(entry.uid, key, val)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
