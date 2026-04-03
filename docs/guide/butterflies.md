# Butterflies

Colorful butterflies flying organically around the canvas. Each butterfly has two bezier-curve wings that flap with a sine animation, and follows a Lissajous-like path for natural-looking flight patterns.

::: render
render=../code/butterflies/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/butterflies/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createButterflies } from '@basmilius/sparkle';

const butterflies = createButterflies({
    count: 12,
    speed: 1,
    size: 20,
    colors: ['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f'],
    scale: 1
});
butterflies.mount(canvas).start();
```

### `count`

The number of butterflies on screen at once.

```typescript
createButterflies({ count: 20 });
```

### `speed`

Overall speed multiplier for flight and flapping.

```typescript
createButterflies({ speed: 1.5 });
```

### `size`

Base wing size in pixels. Each butterfly has a random size variation applied on top.

```typescript
createButterflies({ size: 30 });
```

### `colors`

Array of CSS color strings used for butterfly wings. Each butterfly picks a random color from this list.

```typescript
createButterflies({ colors: ['#ffb7c5', '#c77dff', '#8ecae6'] });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createButterflies({ scale: 1.5 });
```
