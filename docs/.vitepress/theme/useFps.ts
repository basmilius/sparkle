import { ref } from 'vue';

export const fpsEnabled = ref(false);

export function toggleFps(): void {
    fpsEnabled.value = !fpsEnabled.value;
}
