<a href="https://bas.dev" target="_blank" rel="noopener">
	<img src="https://bmcdn.nl/assets/branding/logo.svg" alt="Bas Milius Logo" height="60" width="60" />
</a>

---

# Sparkle

Canvas-based visual effects library for the web. Includes fireworks, confetti and snow simulations.

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
import { FireworkSimulation, ConfettiSimulation, SnowSimulation } from '@basmilius/sparkle';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// Fireworks
const fireworks = new FireworkSimulation(canvas);
fireworks.start();

// Confetti
const confetti = new ConfettiSimulation(canvas);
confetti.fire({ angle: 90, spread: 60, particles: 150, startVelocity: 45, x: 0.5, y: 0.5 });

// Snow
const snow = new SnowSimulation(canvas);
snow.start();
```

### Documentation

Visit the [documentation site](https://sparkle.graphics) for guides, examples and the full API reference.

### License

MIT
