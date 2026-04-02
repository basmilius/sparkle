# Getting Started

## Installation

::: code-group
```bash [bun]
bun add @basmilius/effects
```
```bash [npm]
npm install @basmilius/effects
```
```bash [pnpm]
pnpm add @basmilius/effects
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
import { FireworkSimulation } from '@basmilius/effects';

const sim = new FireworkSimulation(canvas);
sim.start();
```

### Confetti

Fire confetti bursts on demand:

```typescript
import { ConfettiSimulation } from '@basmilius/effects';

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
import { SnowSimulation } from '@basmilius/effects';

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
