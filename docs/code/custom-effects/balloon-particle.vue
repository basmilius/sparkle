<template>
    <div
        class="effect-demo effect-demo--clickable"
        @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click to release a balloon</span>
    </div>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { BalloonParticle } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let running = false;
    let animFrame = 0;
    let then = 0;
    let balloons: BalloonParticle[] = [];

    const COLORS: [number, number, number][] = [
        [255, 68, 68],
        [68, 136, 255],
        [68, 204, 68],
        [255, 204, 0],
        [255, 136, 204],
        [136, 68, 255]
    ];

    function onClick(evt: MouseEvent): void {
        if (!canvasRef.value) {
            return;
        }

        const rect = canvasRef.value.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        balloons.push(new BalloonParticle({x, y}, color));
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

        for (let i = balloons.length - 1; i >= 0; i--) {
            balloons[i].tick(dt);

            if (balloons[i].isDone) {
                balloons.splice(i, 1);
            } else {
                balloons[i].draw(ctx);
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
        balloons = [];
        ctx = null;
    });
</script>
