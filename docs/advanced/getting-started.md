# Advanced Usage

Sparkle exposes its internal particle classes and standalone systems so you can build fully custom simulations without using a pre-built effect class. You pick the particles you want, manage the canvas yourself, and write your own render loop.

## The basic pattern

Every custom effect needs: a canvas, a `requestAnimationFrame` loop, and a list of particles you tick and draw each frame.

::: example Demo || Click anywhere to fire an explosion.
example=../code/custom-effects/basic.vue
:::

```typescript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', {colorSpace: 'display-p3'});
const particles = [];
let then = 0;

function loop(now: number) {
    requestAnimationFrame(loop);

    const dt = then > 0 ? (now - then) / (1000 / 60) : 1;
    then = now;

    // Setting canvas.width clears the canvas and resets context state
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].tick(dt);

        if (particles[i].isDead || particles[i].isDone) {
            particles.splice(i, 1);
        } else {
            particles[i].draw(ctx);
        }
    }
}

requestAnimationFrame(loop);
```

All particle classes follow the same interface: `tick(dt)`, `draw(ctx)`, and either `isDead` or `isDone` to signal when to remove them. The `dt` value is a frame-normalized delta — `1.0` at 60 FPS, `2.0` at 30 FPS — which keeps physics frame-rate independent.
