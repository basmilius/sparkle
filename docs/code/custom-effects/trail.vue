<template>
    <div
        class="effect-demo effect-demo--clickable"
        @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <span class="effect-demo__hint">Click to set target</span>
    </div>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { Spark, Trail } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let running = false;
    let animFrame = 0;
    let then = 0;
    let trails: Trail[] = [];
    let sparks: Spark[] = [];

    function randomEdgePoint(): { x: number; y: number } {
        const edge = Math.floor(Math.random() * 4);

        switch (edge) {
            case 0:
                return {x: Math.random() * width, y: 0};
            case 1:
                return {x: Math.random() * width, y: height};
            case 2:
                return {x: 0, y: Math.random() * height};
            default:
                return {x: width, y: Math.random() * height};
        }
    }

    function onClick(evt: MouseEvent): void {
        if (!canvasRef.value) {
            return;
        }

        const rect = canvasRef.value.getBoundingClientRect();
        const end = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};

        for (let i = 0; i < 5; i++) {
            trails.push(new Trail(randomEdgePoint(), end, {hue: Math.random() * 360, width: 3, length: 8}));
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

        for (let i = trails.length - 1; i >= 0; i--) {
            trails[i].tick(dt);
            sparks.push(...trails[i].collectSparks());

            if (trails[i].isDone) {
                trails.splice(i, 1);
            } else {
                trails[i].draw(ctx);
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
        trails = [];
        sparks = [];
        ctx = null;
    });
</script>
