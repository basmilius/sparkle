<template>
    <div
        class="effect-demo effect-demo--clickable"
        @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click anywhere</span>
    </div>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { Explosion, EXPLOSION_CONFIGS } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let running = false;
    let animFrame = 0;
    let then = 0;
    let explosions: Explosion[] = [];

    function onClick(evt: MouseEvent): void {
        if (!canvasRef.value) {
            return;
        }

        const rect = canvasRef.value.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        const hue = Math.random() * 360;
        const config = EXPLOSION_CONFIGS['peony'];
        const count = Math.floor(config.particleCount[0] + Math.random() * (config.particleCount[1] - config.particleCount[0]));

        for (let i = 0; i < count; i++) {
            explosions.push(new Explosion({x, y}, hue, 3, 'peony'));
        }
    }

    function loop(now: number): void {
        if (!running || !canvasRef.value || !ctx) {
            return;
        }

        animFrame = requestAnimationFrame(loop);

        const dt = then > 0 ? (now - then) / (1000 / 60) : 1;
        then = now;

        canvasRef.value.width = width;
        canvasRef.value.height = height;
        ctx.globalCompositeOperation = 'lighter';

        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].tick(dt);

            if (explosions[i].isDead) {
                explosions.splice(i, 1);
            } else {
                explosions[i].draw(ctx);
            }
        }
    }

    onMounted(() => {
        if (!canvasRef.value) {
            return;
        }

        width = canvasRef.value.offsetWidth;
        height = canvasRef.value.offsetHeight;

        ctx = canvasRef.value.getContext('2d', {colorSpace: 'display-p3'});
        running = true;
        animFrame = requestAnimationFrame(loop);
    });

    onUnmounted(() => {
        running = false;
        cancelAnimationFrame(animFrame);
        then = 0;
        explosions = [];
        ctx = null;
    });
</script>
