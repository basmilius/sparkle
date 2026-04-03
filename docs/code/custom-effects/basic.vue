<template>
    <div ref="containerRef" class="effect-demo effect-demo--clickable" @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click anywhere</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Particle {
    tick(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDead: boolean;
}

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();

let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let running = false;
let animFrame = 0;
let explosions: Particle[] = [];

async function onClick(evt: MouseEvent): Promise<void> {
    if (!containerRef.value) {
        return;
    }

    const { Explosion, EXPLOSION_CONFIGS } = await import('@basmilius/sparkle');
    const rect = containerRef.value.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    const hue = Math.random() * 360;
    const config = EXPLOSION_CONFIGS['peony'];
    const count = Math.floor(config.particleCount[0] + Math.random() * (config.particleCount[1] - config.particleCount[0]));

    for (let i = 0; i < count; i++) {
        explosions.push(new Explosion({x, y}, hue, 3, 'peony'));
    }
}

function loop(): void {
    if (!running || !canvasRef.value || !ctx) {
        return;
    }

    animFrame = requestAnimationFrame(loop);

    canvasRef.value.width = width;
    canvasRef.value.height = height;
    ctx.globalCompositeOperation = 'lighter';

    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].tick();

        if (explosions[i].isDead) {
            explosions.splice(i, 1);
        } else {
            explosions[i].draw(ctx);
        }
    }
}

onMounted(() => {
    if (!canvasRef.value || !containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    ctx = canvasRef.value.getContext('2d', {colorSpace: 'display-p3'});
    running = true;
    animFrame = requestAnimationFrame(loop);
});

onUnmounted(() => {
    running = false;
    cancelAnimationFrame(animFrame);
    explosions = [];
    ctx = null;
});
</script>
