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
import { FireworkSimulation } from '@basmilius/sparkle';

const sim = new FireworkSimulation(canvas);
sim.start();
```

### Confetti

Fire confetti bursts on demand:

```typescript
import { ConfettiSimulation } from '@basmilius/sparkle';

const sim = new ConfettiSimulation(canvas);

sim.fire({
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
import { SnowSimulation } from '@basmilius/sparkle';

const sim = new SnowSimulation(canvas);
sim.start();
```

## Lifecycle

All simulations share the same lifecycle methods:

```typescript
// Start the animation loop.
sim.start();

// Stop the animation loop.
sim.stop();

// Stop and remove all event listeners.
sim.destroy();
```

Simulations automatically pause when the browser tab is hidden and resume when it becomes visible again.
