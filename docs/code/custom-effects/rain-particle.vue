<template>
    <div class="effect-demo">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { RaindropParticle, SplashParticle } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let running = false;
    let animFrame = 0;
    let then = 0;
    let drops: RaindropParticle[] = [];
    let splashes: SplashParticle[] = [];
    let spawnInterval: ReturnType<typeof setInterval>;

    const COLOR: [number, number, number] = [174, 194, 224];
    const MAX_DROPS = 150;
    const WIND = 0.25;

    function spawnDrop(): void {
        const depth = 0.3 + Math.random() * 0.7;
        const vy = (3.5 + Math.random() * 5) * depth;
        const vx = WIND * vy * 0.6;

        drops.push(new RaindropParticle(
            {x: Math.random() * width, y: -10},
            {x: vx, y: vy},
            COLOR,
            {depth, groundY: height}
        ));
    }

    function spawnSplash(x: number, y: number): void {
        splashes.push(...SplashParticle.burst({x, y}, COLOR));
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

        ctx.fillStyle = 'rgba(22, 22, 24, 0.6)';
        ctx.fillRect(0, 0, width, height);

        for (let i = splashes.length - 1; i >= 0; i--) {
            splashes[i].tick(dt);

            if (splashes[i].isDead) {
                splashes.splice(i, 1);
            } else {
                splashes[i].draw(ctx);
            }
        }

        for (let i = drops.length - 1; i >= 0; i--) {
            drops[i].tick(dt);

            if (drops[i].isDead) {
                spawnSplash(drops[i].position.x, height);
                drops.splice(i, 1);
            } else {
                drops[i].draw(ctx);
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

        for (let i = 0; i < MAX_DROPS; i++) {
            spawnDrop();
        }

        spawnInterval = setInterval(spawnDrop, 30);
    });

    onUnmounted(() => {
        running = false;
        cancelAnimationFrame(animFrame);
        clearInterval(spawnInterval);
        then = 0;
        drops = [];
        splashes = [];
        ctx = null;
    });
</script>
