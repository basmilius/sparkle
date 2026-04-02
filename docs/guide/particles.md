# Particles

The particles simulation creates a network of floating dots connected by lines when near each other, creating the popular "plexus" effect. Particles drift slowly, bounce off edges, and interact with the mouse cursor in multiple ways.

::: render
render=../code/particles/preview.vue
:::

## Examples

::: example Network effect || Particles connected by lines, mouse adds connections.
example=../code/particles/preview.vue
:::

::: example Mouse attract || Particles are pulled toward the cursor.
example=../code/particles/attract.vue
:::

::: example Mouse repel || Particles are pushed away from the cursor with glow.
example=../code/particles/repel.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { ParticleSimulation } from '@basmilius/sparkle';

const sim = new ParticleSimulation(canvas, {
    count: 100,
    color: '#6366f1',
    lineColor: '#6366f1',
    connectionDistance: 120,
    mouseMode: 'connect',
    scale: 1
});
sim.start();
```

### Mouse Mode

Choose how particles interact with the cursor:

```typescript
// Lines from cursor to nearby particles
new ParticleSimulation(canvas, { mouseMode: 'connect' });

// Pull particles toward cursor
new ParticleSimulation(canvas, { mouseMode: 'attract' });

// Push particles away from cursor
new ParticleSimulation(canvas, { mouseMode: 'repel' });

// No mouse interaction
new ParticleSimulation(canvas, { mouseMode: 'none' });
```

### Connection Distance

Control how close particles must be to connect:

```typescript
// Short connections, dense clusters
new ParticleSimulation(canvas, { connectionDistance: 60 });

// Long connections, web-like
new ParticleSimulation(canvas, { connectionDistance: 200 });
```

### Glow

Add a neon glow to particles:

```typescript
new ParticleSimulation(canvas, {
    glow: true,
    color: '#22d3ee',
    lineColor: '#22d3ee'
});
```

### Background

Set a solid background color:

```typescript
// Dark background
new ParticleSimulation(canvas, { background: '#0a0a1a' });

// Transparent (default)
new ParticleSimulation(canvas, { background: null });
```

::: tip Performance
Keep `count` under 200 for smooth performance. The spatial grid optimization ensures connection checks scale well, but rendering many lines can become expensive.
:::
