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
import { createParticles } from '@basmilius/sparkle';

const particles = createParticles({
    count: 100,
    color: '#6366f1',
    lineColor: '#6366f1',
    connectionDistance: 120,
    mouseMode: 'connect',
    scale: 1
});
particles.mount(canvas).start();
```

### Mouse Mode

Choose how particles interact with the cursor:

```typescript
// Lines from cursor to nearby particles
createParticles({ mouseMode: 'connect' });

// Pull particles toward cursor
createParticles({ mouseMode: 'attract' });

// Push particles away from cursor
createParticles({ mouseMode: 'repel' });

// No mouse interaction
createParticles({ mouseMode: 'none' });
```

### Connection Distance

Control how close particles must be to connect:

```typescript
// Short connections, dense clusters
createParticles({ connectionDistance: 60 });

// Long connections, web-like
createParticles({ connectionDistance: 200 });
```

### Glow

Add a neon glow to particles:

```typescript
createParticles({
    glow: true,
    color: '#22d3ee',
    lineColor: '#22d3ee'
});
```

### Background

Set a solid background color:

```typescript
// Dark background
createParticles({ background: '#0a0a1a' });

// Transparent (default)
createParticles({ background: null });
```

::: tip Performance
Keep `count` under 200 for smooth performance. The spatial grid optimization ensures connection checks scale well, but rendering many lines can become expensive.
:::
