# Custom Effects

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

## Available particles

### Trail

A glowing line traveling from a start point to an end point. `isDone` when it arrives — no events or spark emission by default. Call `collectSparks()` to pick up the small trail sparks it emits.

::: example Demo || Click anywhere to launch trails from all four edges.
example=../code/custom-effects/trail.vue
:::

```typescript
import { Trail, Explosion } from '@basmilius/sparkle';

const trail = new Trail(
    {x: canvas.width / 2, y: canvas.height},
    {x: canvas.width / 2, y: 100},
    {hue: 45, width: 3, length: 8}
);

// In your loop:
trail.tick(dt);
sparks.push(...trail.collectSparks());

if (trail.isDone) {
    // Spawn an explosion at the arrival point
    for (let i = 0; i < 60; i++) {
        explosions.push(new Explosion(trail.position, trail.hue, 3, 'peony'));
    }
} else {
    trail.draw(ctx);
}
```

### SparklerParticle

A glowing spark with a circular trail. Accepts an explicit position, velocity, and RGB color.

::: example Demo || Click anywhere to emit a burst of glowing sparks.
example=../code/custom-effects/sparkler-particle.vue
:::

```typescript
import { SparklerParticle } from '@basmilius/sparkle';

const spark = new SparklerParticle(
    {x: 300, y: 400},
    {x: 2, y: -4},
    [255, 180, 50],
    {trailLength: 5, scale: 1.2}
);

// Use 'lighter' composite for additive glow
ctx.globalCompositeOperation = 'lighter';
spark.tick(dt);
spark.draw(ctx);
```

### ConfettiParticle

A single confetti piece with physics (velocity, swing, rotation, flip) and one of 11 shapes.

::: example Demo || Click anywhere to burst confetti in all shapes.
example=../code/custom-effects/confetti-particle.vue
:::

```typescript
import { ConfettiParticle } from '@basmilius/sparkle';

const particle = new ConfettiParticle(
    { x: 400, y: 300 },
    90,           // launch direction in degrees (90 = straight up)
    'star',
    '#ff4466',
    { spread: 120, startVelocity: 25, ticks: 180 }
);
```

The 11 shapes are also exported as `SHAPE_PATHS` — normalized `Path2D` objects you can use in your own rendering code.

```typescript
import { SHAPE_PATHS } from '@basmilius/sparkle';

ctx.save();
ctx.setTransform(size, 0, 0, size, x, y);
ctx.fillStyle = color;
ctx.fill(SHAPE_PATHS['heart']);
ctx.restore();
```

### BalloonParticle

A floating balloon with gradient body, gloss highlight, knot, and swaying string. Rises upward until it leaves the canvas.

::: example Demo || Click anywhere to release a balloon.
example=../code/custom-effects/balloon-particle.vue
:::

```typescript
import { BalloonParticle } from '@basmilius/sparkle';

const balloon = new BalloonParticle(
    { x: 300, y: 400 },
    [255, 68, 68],   // RGB color
    { riseSpeed: 0.8, stringLength: 60 }
);
```

### RaindropParticle + SplashParticle

A line-rendered raindrop and the circular splashes it spawns on landing.

::: example Demo || Continuous rain with wind and splashes.
example=../code/custom-effects/rain-particle.vue
:::

```typescript
import { RaindropParticle, SplashParticle } from '@basmilius/sparkle';

const drop = new RaindropParticle(
    {x: 200, y: 0},
    {x: 1, y: 8},         // vx = wind, vy = fall speed
    [174, 194, 224],
    {depth: 0.7, groundY: canvas.height}
);

// On landing:
if (drop.isDead) {
    const splashes = SplashParticle.burst(drop.position, [174, 194, 224]);
}
```

### FireflyParticle

A softly pulsing glow dot with organic Lissajous drift. Wraps around canvas edges. Create one sprite per color with `createFireflySprite()` and share it across all particles of that color.

::: example Demo || 40 fireflies drifting across a dark canvas.
example=../code/custom-effects/firefly-particle.vue
:::

```typescript
import { FireflyParticle, createFireflySprite } from '@basmilius/sparkle';

const sprite = createFireflySprite('#b4ff6a');
const bounds = {width: canvas.width, height: canvas.height};

const firefly = new FireflyParticle(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    bounds,
    sprite,
    {size: 6, glowSpeed: 1.2}
);

ctx.globalCompositeOperation = 'lighter';
firefly.tick(dt);
firefly.draw(ctx);
```

### ShootingStarSystem

A self-contained system that spawns and animates shooting stars at configurable intervals. Pass any `() => number` RNG — `Math.random` works fine.

```typescript
import { ShootingStarSystem } from '@basmilius/sparkle';

const system = new ShootingStarSystem(
    {interval: [60, 180], color: [200, 230, 255], trailLength: 20},
    Math.random
);

// In your loop:
system.tick(dt, canvas.width, canvas.height);
ctx.globalCompositeOperation = 'lighter';
system.draw(ctx);
```

### LightningSystem

A procedural lightning bolt generator that fires bolts at configurable intervals. Uses normalized coordinates (0–1) internally; pass `width` and `height` to `draw()` to scale to your canvas. Read `flashAlpha` to overlay a screen-wide light flash on each strike.

::: example Demo || Automatic lightning bolts with branching and screen flash.
example=../code/custom-effects/lightning-system.vue
:::

```typescript
import { LightningSystem } from '@basmilius/sparkle';

const system = new LightningSystem(
    {frequency: 0.5, color: [180, 200, 255], branches: true, flash: true},
    Math.random
);

// In your loop:
system.tick(dt);

if (system.flashAlpha > 0) {
    ctx.fillStyle = `rgba(180, 200, 255, ${system.flashAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

system.draw(ctx, canvas.width, canvas.height);
```

## Fireworks

### createExplosion

Creates an array of `Explosion` particles for any of the 16 firework variants. This is the main entry point for using fireworks in a custom simulator — no `Fireworks` instance needed.

::: example Demo || Select a variant and click anywhere to fire.
example=../code/custom-effects/playground.vue
:::

```typescript
import { createExplosion, FIREWORK_VARIANTS } from '@basmilius/sparkle';

// Fire any variant at a position with a given hue
const hue = Math.random() * 360;
explosions.push(...createExplosion('heart', {x: 400, y: 300}, hue));

// Optional: custom line width, scale, and seeded RNG
explosions.push(...createExplosion('saturn', position, hue, {lineWidth: 5, scale: 1}, Math.random));
```

All 16 variants work: `peony`, `chrysanthemum`, `willow`, `ring`, `palm`, `crackle`, `crossette`, `saturn`, `dahlia`, `brocade`, `horsetail`, `strobe`, `heart`, `spiral`, `flower`, `concentric`.

### Split and crackle

`crossette` and `crackle` particles have secondary effects that trigger mid-flight. Handle them in your loop with `checkSplit()` and `checkCrackle()` — each fires only once per particle.

```typescript
import { createExplosion, Explosion, Spark } from '@basmilius/sparkle';

// In your tick loop:
for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];
    explosion.tick(dt);

    if (explosion.checkSplit()) {
        for (let j = 0; j < 4; j++) {
            const angle = explosion.angle + (Math.PI / 2) * j + Math.PI / 4;
            explosions.push(new Explosion(explosion.position, explosion.hue, 3, 'peony', 1, angle, 3 + Math.random() * 3));
        }
    }

    if (explosion.checkCrackle()) {
        for (let j = 0; j < 8; j++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            sparks.push(new Spark(explosion.position, explosion.hue, Math.cos(angle) * speed, Math.sin(angle) * speed));
        }
    }

    if (explosion.isDead) {
        explosions.splice(i, 1);
    } else {
        explosion.draw(ctx);
    }
}
```

### Firework projectile

`Trail` moves from A to B with no event system. Use `Firework` when you want the projectile to emit sparks along the way and fire a `'remove'` event on arrival.

```typescript
import { Firework, createExplosion } from '@basmilius/sparkle';

const firework = new Firework(
    {x: canvas.width / 2, y: canvas.height},
    {x: canvas.width / 2, y: canvas.height * 0.2},
    Math.random() * 360, 2, 5
);

firework.addEventListener('remove', () => {
    const hue = Math.random() * 360;
    explosions.push(...createExplosion('peony', firework.position, hue));
}, {once: true});
```
