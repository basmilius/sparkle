# Confetti

The confetti simulation creates customizable confetti bursts triggered by user interaction.

## Basic Usage

```typescript
import { ConfettiSimulation } from '@basmilius/effects';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const sim = new ConfettiSimulation(canvas);

// Fire confetti from the center
sim.fire({
    angle: 90,
    spread: 60,
    particles: 150,
    startVelocity: 45,
    x: 0.5,
    y: 0.5
});
```

## Fire Options

| Option | Type | Description |
|--------|------|-------------|
| `angle` | `number` | Launch angle in degrees (90 = upward). |
| `spread` | `number` | Spread angle in degrees. |
| `particles` | `number` | Number of confetti particles. |
| `startVelocity` | `number` | Initial velocity of particles. |
| `x` | `number` | Horizontal position (0-1, relative to canvas width). |
| `y` | `number` | Vertical position (0-1, relative to canvas height). |

## Example: Click to Confetti

```typescript
canvas.addEventListener('click', (evt) => {
    sim.fire({
        angle: 90,
        spread: 60,
        particles: 150,
        startVelocity: 45,
        x: evt.clientX / innerWidth,
        y: evt.clientY / innerHeight
    });
});
```
