<template>
    <div
        class="effect-demo effect-demo--clickable"
        ref="containerRef"
        @click="onClick">
        <canvas ref="canvasRef"></canvas>
        <div class="effect-demo__controls">
            <button
                v-for="variant in FIREWORK_VARIANTS"
                :key="variant"
                :style="selectedVariant === variant ? 'background: rgba(255,255,255,.25); color: white;' : ''"
                @click.stop="selectedVariant = variant">
                {{ variant }}
            </button>
        </div>
    </div>
</template>

<script
    setup
    lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import type { FireworkVariant } from '@basmilius/sparkle';
    import { createExplosion, Explosion, FIREWORK_VARIANTS, Spark } from '@basmilius/sparkle';

    const canvasRef = ref<HTMLCanvasElement>();
    const containerRef = ref<HTMLDivElement>();
    const selectedVariant = ref<FireworkVariant>('peony');

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let running = false;
    let animFrame = 0;
    let then = 0;
    let explosions: Explosion[] = [];
    let sparks: Spark[] = [];

    function onClick(evt: MouseEvent): void {
        if (!canvasRef.value) {
            return;
        }

        const rect = canvasRef.value.getBoundingClientRect();
        const position = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
        const hue = Math.random() * 360;

        explosions.push(...createExplosion(selectedVariant.value, position, hue));
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

        const newExplosions: Explosion[] = [];
        const newSparks: Spark[] = [];

        for (let i = explosions.length - 1; i >= 0; i--) {
            const explosion = explosions[i];
            explosion.tick(dt);

            if (explosion.checkSplit()) {
                for (let j = 0; j < 4; j++) {
                    const angle = explosion.angle + (Math.PI / 2) * j + Math.PI / 4;
                    newExplosions.push(new Explosion(explosion.position, explosion.hue, 3, 'peony', 1, angle, 3 + Math.random() * 3));
                }
            }

            if (explosion.checkCrackle()) {
                for (let j = 0; j < 8; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const spd = 3 + Math.random() * 5;
                    newSparks.push(new Spark(explosion.position, explosion.hue, Math.cos(angle) * spd, Math.sin(angle) * spd));
                }
            }

            if (explosion.isDead) {
                explosions.splice(i, 1);
            } else {
                explosion.draw(ctx);
            }
        }

        explosions.push(...newExplosions);
        sparks.push(...newSparks);

        ctx.globalCompositeOperation = 'source-over';
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
        sparks = [];
        ctx = null;
    });
</script>
