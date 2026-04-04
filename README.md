<a href="https://bas.dev" target="_blank" rel="noopener">
	<img src="https://bmcdn.nl/assets/branding/logo.svg" alt="Bas Milius Logo" height="60" width="60" />
</a>

---

# Sparkle

Canvas-based visual effects library for the web. Includes 61 visual effects ranging from nature simulations (rain, snow, leaves) to abstract visuals (plasma, voronoi, spirograph) and playful animations (popcorn, balloons, confetti).

### Install

```bash
bun add @basmilius/sparkle
```
```bash
npm install @basmilius/sparkle
```
```bash
pnpm add @basmilius/sparkle
```

### Quick Start

```typescript
import { createSnow, createConfetti, createFireworks } from '@basmilius/sparkle';

// Snow
const snow = createSnow({ particles: 200, speed: 1.5 });
snow.mount('#canvas').start();

// Confetti burst
const confetti = createConfetti();
confetti.mount('#canvas').start();
confetti.burst();

// Fireworks
const fireworks = createFireworks({ autoSpawn: true });
fireworks.mount('#canvas').start();
```

### Scene Composition

Layer multiple effects on a single canvas:

```typescript
import { createScene, createAurora, createStars, createSnow } from '@basmilius/sparkle';

const scene = createScene()
    .mount('#canvas')
    .layer(createAurora({ bands: 4 }))
    .layer(createStars({ mode: 'sky' }).withFade({ bottom: 0.4 }))
    .layer(createSnow())
    .start();
```

### Documentation

Visit the [documentation site](https://sparkle.graphics) for guides, examples and the full API reference.

### License

MIT
