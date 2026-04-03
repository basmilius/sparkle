# Getting Started

## Installation

```bash
bun add @basmilius/effects
```

## Basic Usage

Each effect works with an HTML `<canvas>` element.

```html
<canvas id="canvas"></canvas>
```

### Fireworks

```typescript
import { FireworkSimulation } from '@basmilius/effects';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const sim = new FireworkSimulation(canvas);
sim.start();
```

### Confetti

```typescript
import { ConfettiSimulation } from '@basmilius/effects';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
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

```typescript
import { SnowSimulation } from '@basmilius/effects';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const sim = new SnowSimulation(canvas);
sim.start();
```

## Cleanup

All simulations can be stopped and cleaned up:

```typescript
sim.stop();
sim.destroy();
```
