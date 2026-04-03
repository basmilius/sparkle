# Neon

The neon effect renders animated glowing tubes — circles, waves, zig-zags, and curves — that flicker like real neon signs. Each tube is drawn with multiple glow passes and a bright white core for a vivid, electric look.

::: render
render=../code/neon/preview.vue
:::

## Examples

::: example Basic || Default neon tubes with flicker.
example=../code/neon/preview.vue
:::

## Configuration

```typescript
import { createNeon } from '@basmilius/sparkle';

const neon = createNeon({
    count: 8,
    speed: 1,
    colors: ['#ff0080', '#00ffff', '#ffff00', '#ff6600', '#aa00ff'],
    flicker: true,
    scale: 1
});
neon.mount(canvas).start();
```

### Tube Count

Control the number of neon tubes on screen:

```typescript
// Sparse
createNeon({ count: 4 });

// Dense
createNeon({ count: 16 });
```

### Colors

Customize the neon palette:

```typescript
createNeon({ colors: ['#ff0080', '#00ffff'] });
```

### Flicker

Disable flicker for a steady glow:

```typescript
createNeon({ flicker: false });
```

### Speed

Control how fast the tubes animate:

```typescript
createNeon({ speed: 0.5 }); // slow
createNeon({ speed: 2 });   // fast
```
