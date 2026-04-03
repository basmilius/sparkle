# Custom Effects

Sparkle exposes its internal particle classes so you can build fully custom simulations without using a pre-built `*Simulation` wrapper. You pick the particles you want, manage the canvas yourself, and write your own render loop.

## The basic pattern

Every custom effect needs: a canvas, a `requestAnimationFrame` loop, and a list of particles you tick and draw each frame.

```typescript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
const particles = [];

function loop() {
    requestAnimationFrame(loop);

    // Setting canvas.width clears the canvas and resets context state
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].tick();

        if (particles[i].isDead || particles[i].isDone) {
            particles.splice(i, 1);
        } else {
            particles[i].draw(ctx);
        }
    }
}

loop();
```

All particle classes follow the same interface: `tick()`, `draw(ctx)`, and either `isDead` or `isDone` to signal when to remove them.

## Available particles

### Trail

A glowing line traveling from a start point to an end point. `isDone` when it arrives — no events or spark emission by default. Call `collectSparks()` to pick up the small trail sparks it emits.

::: example Demo || Click anywhere to launch trails from all four edges.
example=../code/custom-effects/trail.vue
:::

```typescript
import { Trail, Explosion } from '@basmilius/sparkle';

const trail = new Trail(
    { x: canvas.width / 2, y: canvas.height },
    { x: canvas.width / 2, y: 100 },
    { hue: 45, width: 3, length: 8 }
);

// In your loop:
trail.tick();
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
    { x: 300, y: 400 },
    { x: 2, y: -4 },
    [255, 180, 50],
    { trailLength: 5, scale: 1.2 }
);

// Use 'lighter' composite for additive glow
ctx.globalCompositeOperation = 'lighter';
spark.tick();
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
    { x: 200, y: 0 },
    { x: 1, y: 8 },         // vx = wind, vy = fall speed
    [174, 194, 224],
    { depth: 0.7, groundY: canvas.height }
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
const bounds = { width: canvas.width, height: canvas.height };

const firefly = new FireflyParticle(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    bounds,
    sprite,
    { size: 6, glowSpeed: 1.2 }
);

ctx.globalCompositeOperation = 'lighter';
firefly.tick();
firefly.draw(ctx);
```

### ShootingStarSystem

A self-contained system that spawns and animates shooting stars at configurable intervals. Pass any `() => number` RNG — `Math.random` works fine.

```typescript
import { ShootingStarSystem } from '@basmilius/sparkle';

const system = new ShootingStarSystem(
    { interval: [60, 180], color: [200, 230, 255], trailLength: 20 },
    Math.random
);

// In your loop:
system.tick(dt, canvas.width, canvas.height);
ctx.globalCompositeOperation = 'lighter';
system.draw(ctx);
```

## Firework particles

The firework simulation exposes its internal particle classes directly.

### Explosion

A single burst particle. Moves outward from a position, leaves a trail, and fades out. Most types work with random angles; a few require pre-calculated angles to form their shape.

**Simple types** (random angles work fine): `peony`, `chrysanthemum`, `willow`, `brocade`, `horsetail`, `strobe`, `crackle`, `crossette`

```typescript
import { Explosion, EXPLOSION_CONFIGS } from '@basmilius/sparkle';

const config = EXPLOSION_CONFIGS['chrysanthemum'];
const count = Math.floor(config.particleCount[0] + Math.random() * (config.particleCount[1] - config.particleCount[0]));

for (let i = 0; i < count; i++) {
    explosions.push(new Explosion(position, hue, 3, 'chrysanthemum'));
}
```

**Shaped types** — require pre-calculated angles:

```typescript
// ring — evenly distributed circle
const count = 50;
for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    explosions.push(new Explosion(position, hue, 3, 'ring', 1, angle));
}

// heart — parametric heart curve
const velocity = 3 + Math.random() * 2;
const rotation = (Math.random() - 0.5) * 0.6;
const cosR = Math.cos(rotation), sinR = Math.sin(rotation);
for (let i = 0; i < 70; i++) {
    const t = (i / 70) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const scale = velocity / 16;
    const vx = hx * scale * cosR - hy * scale * sinR;
    const vy = hx * scale * sinR + hy * scale * cosR;
    explosions.push(new Explosion(position, hue, 3, 'heart', 1, Math.atan2(vy, vx), Math.sqrt(vx * vx + vy * vy)));
}

// flower — rose curve
const petals = 2 + Math.floor(Math.random() * 3);
const speed = 4 + Math.random() * 3;
for (let i = 0; i < 80; i++) {
    const t = (i / 80) * Math.PI * 2;
    const r = Math.abs(Math.cos(petals * t));
    if (r * speed < 0.3) continue;
    explosions.push(new Explosion(position, hue, 3, 'flower', 1, t, r * speed));
}
```

### Split and crackle

`crossette` splits mid-flight; `crackle` emits sparks when dying. Both `checkSplit()` and `checkCrackle()` fire only once per particle.

```typescript
if (explosion.checkSplit()) {
    for (let j = 0; j < 4; j++) {
        const angle = explosion.angle + (Math.PI / 2) * j + Math.PI / 4;
        newExplosions.push(new Explosion(explosion.position, explosion.hue, 2, 'peony', 1, angle, 3 + Math.random() * 3));
    }
}

if (explosion.checkCrackle()) {
    for (let j = 0; j < 8; j++) {
        newSparks.push(new Spark(explosion.position, explosion.hue));
    }
}
```

### Trail + Firework

`Trail` is the simpler way to move from A to B. Use `Firework` when you need the projectile to emit sparks along the way and dispatch a `'remove'` event on arrival.

```typescript
import { Firework, Explosion } from '@basmilius/sparkle';

const firework = new Firework(
    { x: canvas.width / 2, y: canvas.height },
    { x: canvas.width / 2, y: canvas.height * 0.2 },
    Math.random() * 360, 2, 5
);

firework.addEventListener('remove', () => {
    for (let i = 0; i < 60; i++) {
        explosions.push(new Explosion(firework.position, firework.hue, 3, 'peony'));
    }
});
```

### Playground

All 16 firework variants, click to fire:

::: example Demo || Select a variant and click anywhere to fire.
example=../code/custom-effects/playground.vue
:::
