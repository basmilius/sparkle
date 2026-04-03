# Fireworks

Sparkle exports the fireworks internals so you can build fully custom firework simulations without the `Fireworks` effect class.

## createExplosion

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

## Split and crackle

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

## Firework projectile

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
