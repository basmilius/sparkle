# Orbits

The orbits simulation creates particles traveling in elliptical paths around center points, producing an effect reminiscent of atoms or planetary systems. Each orbiter follows a tilted ellipse for a 3D perspective effect, leaving a fading trail behind it.

::: render
render=../code/orbits/preview.vue
:::

## Examples

::: example Basic orbits || Three orbital centers with particles circling at varying speeds.
example=../code/orbits/preview.vue
:::

::: example Dense system || Five centers with many fast-moving orbiters.
example=../code/orbits/dense.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createOrbits } from '@basmilius/sparkle';

const orbits = createOrbits({
    centers: 3,
    orbitersPerCenter: 8,
    speed: 1,
    trailLength: 15,
    showCenters: true,
    scale: 1
});
orbits.mount(canvas).start();
```

### Centers

Control the number of orbital center points:

```typescript
// Single atom
createOrbits({ centers: 1 });

// Complex system
createOrbits({ centers: 6 });
```

### Orbiters Per Center

Set how many particles orbit each center:

```typescript
// Minimal
createOrbits({ orbitersPerCenter: 4 });

// Dense
createOrbits({ orbitersPerCenter: 16 });
```

### Speed

Control the orbital velocity:

```typescript
// Slow, meditative
createOrbits({speed: 0.5});

// Fast, energetic
createOrbits({speed: 2});
```

### Trail Length

Set how long the trails are behind each orbiter:

```typescript
// Short trails
createOrbits({ trailLength: 5 });

// Long, flowing trails
createOrbits({ trailLength: 30 });
```

### Show Centers

Toggle the glow effect at each orbital center:

```typescript
// Hide center glows
createOrbits({ showCenters: false });
```

### Colors

Provide a custom palette for the orbiters:

```typescript
createOrbits({
    colors: ['#ff6b6b', '#ffd93d', '#6bcb77']
});
```
