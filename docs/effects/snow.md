# Snow

The snow simulation creates a gentle snowfall effect with realistic physics.

## Basic Usage

```typescript
import { SnowSimulation } from '@basmilius/effects';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const sim = new SnowSimulation(canvas);
sim.start();
```

## Lifecycle

```typescript
// Start the simulation
sim.start();

// Stop the simulation
sim.stop();

// Clean up event listeners
sim.destroy();
```

The simulation automatically pauses when the browser tab is not visible and resumes when the tab becomes active again.
