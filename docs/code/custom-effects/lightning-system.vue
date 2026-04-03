<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { LightningSystem } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let running = false;
    let animFrame = 0;
    let then = 0;
    let system: LightningSystem | null = null;

    function loop(now: number): void {
        if (!running || !canvasRef.value || !ctx || !system) {
            return;
        }

        animFrame = requestAnimationFrame(loop);

        const dt = then > 0 ? (now - then) / (1000 / 60) : 1;
        then = now;

        canvasRef.value.width = width;
        canvasRef.value.height = height;

        ctx.fillStyle = '#090912';
        ctx.fillRect(0, 0, width, height);

        system.tick(dt);

        if (system.flashAlpha > 0) {
            ctx.fillStyle = `rgba(180, 200, 255, ${system.flashAlpha})`;
            ctx.fillRect(0, 0, width, height);
        }

        system.draw(ctx, width, height);
    }

    onMounted(() => {
        if (!canvasRef.value) {
            return;
        }

        width = canvasRef.value.offsetWidth;
        height = canvasRef.value.offsetHeight;

        system = new LightningSystem(
            {frequency: 0.5, color: [180, 200, 255], branches: true, flash: true},
            Math.random
        );

        ctx = canvasRef.value.getContext('2d', {colorSpace: 'display-p3'});
        running = true;
        animFrame = requestAnimationFrame(loop);
    });

    onUnmounted(() => {
        running = false;
        cancelAnimationFrame(animFrame);
        then = 0;
        system = null;
        ctx = null;
    });
</script>
