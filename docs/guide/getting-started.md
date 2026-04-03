# Getting Started

## Installation

::: code-group

```bash [bun]
bun add @basmilius/sparkle
```

```bash [npm]
npm install @basmilius/sparkle
```

```bash [pnpm]
pnpm add @basmilius/sparkle
```

:::

## Setup

Every effect requires an HTML `<canvas>` element. The canvas is used as the rendering surface for the effect.

```html

<canvas id="canvas"></canvas>
```

```typescript
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
```

## Quick Start

### Fireworks

An automatic firework display with 16 explosion variants:

```typescript
import { createFireworks } from '@basmilius/sparkle';

const fireworks = createFireworks();
fireworks.mount(canvas).start();
```

### Confetti

Fire confetti bursts on demand:

```typescript
import { createConfetti } from '@basmilius/sparkle';

const confetti = createConfetti();
confetti.mount(canvas);

confetti.burst({
    angle: 90,
    spread: 60,
    particles: 150,
    startVelocity: 45,
    x: 0.5,
    y: 0.5
});
```

### Snow

A continuous snowfall effect:

```typescript
import { createSnow } from '@basmilius/sparkle';

const snow = createSnow();
snow.mount(canvas).start();
```

## Lifecycle

All simulations share the same lifecycle methods:

```typescript
// Mount to a canvas element and start the animation loop.
sim.mount(canvas).start();

// Temporarily pause the animation loop.
sim.pause();

// Resume after pausing.
sim.start();

// Stop and remove all event listeners.
sim.destroy();
```

Simulations automatically pause when the browser tab is hidden and resume when it becomes visible again.
