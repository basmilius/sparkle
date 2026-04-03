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
    import { SparklerParticle } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let running = false;
    let animFrame = 0;
    let then = 0;
    let sparks: SparklerParticle[] = [];

    const COLORS: [number, number, number][] = [
        [255, 200, 50],
        [255, 140, 20],
        [255, 255, 180],
        [255, 100, 80],
        [100, 200, 255]
    ];

    function onClick(evt: MouseEvent): void {
        if (!canvasRef.value) {
            return;
        }

        const rect = canvasRef.value.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;

        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 2 + Math.random() * 6;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            sparks.push(new SparklerParticle(
                {x, y},
                {x: Math.cos(angle) * spd, y: Math.sin(angle) * spd},
                color,
                {trailLength: 5, scale: 1.2}
            ));
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

        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].tick(dt);

            if (sparks[i].isDead) {
                sparks.splice(i, 1);
            } else {
                sparks[i].draw(ctx);
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
        sparks = [];
        ctx = null;
    });
</script>
