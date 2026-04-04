# Fluid

The fluid effect simulates an interactive dye-in-fluid simulation. Colorful dye is periodically injected into a velocity field that flows, diffuses, and advects over time. Moving the mouse across the canvas stirs the fluid, creating organic swirling patterns.

::: render
render=../code/fluid/preview.vue
:::

## Examples

::: example Basic || Fluid simulation with default colors and settings.
example=../code/fluid/preview.vue
:::

## Configuration

```typescript
import { createFluid } from '@basmilius/sparkle';

const fluid = createFluid({
    speed: 1,
    resolution: 128,
    colors: ['#ff3366', '#33ccff', '#66ff33', '#ff9933', '#cc33ff'],
    viscosity: 0.5,
    diffusion: 0.5,
    mouseForce: 1,
    scale: 1
});
fluid.mount(canvas).start();
```

### Mouse Interaction

Moving the mouse over the canvas stirs the fluid and injects colored dye along the cursor path. The strength of this interaction is controlled by `mouseForce`.

### Speed

```typescript
// Slow, calm flow
createFluid({ speed: 0.4 });

// Fast, turbulent flow
createFluid({ speed: 2 });
```

### Resolution

Lower resolution is faster but looks blockier; higher is smoother but more expensive:

```typescript
// Low resolution, fast
createFluid({ resolution: 64 });

// High resolution, detailed
createFluid({ resolution: 256 });
```

### Colors

```typescript
// Warm palette
createFluid({ colors: ['#ff6600', '#ffcc00', '#ff3300'] });

// Cool palette
createFluid({ colors: ['#0033ff', '#0099ff', '#00ccff'] });
```

### Viscosity & Diffusion

```typescript
// Thick, slow-spreading fluid
createFluid({ viscosity: 0.9, diffusion: 0.1 });

// Thin, fast-spreading fluid
createFluid({ viscosity: 0.1, diffusion: 0.9 });
```
