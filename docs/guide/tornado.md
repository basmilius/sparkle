# Tornado

Spinning funnel vortex with swaying motion and flying debris particles. The funnel sways organically while debris particles spiral around the vortex at varying speeds and distances.

::: render
render=../code/tornado/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/tornado/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createTornado } from '@basmilius/sparkle';

const tornado = createTornado({
    speed: 1,
    debris: 150,
    width: 0.3,
    intensity: 1,
    color: '#8B7355',
    scale: 1
});
tornado.mount(canvas).start();
```

### `speed`

Controls the overall animation speed of the vortex rotation and debris movement.

```typescript
createTornado({ speed: 1.5 });
```

### `debris`

The number of debris particles spiraling around the funnel.

```typescript
createTornado({ debris: 200 });
```

### `width`

The relative width of the funnel base (0–1). Higher values create a wider tornado.

```typescript
createTornado({ width: 0.5 });
```

### `intensity`

Controls the strength of the vortex. Higher values make debris spin faster and the funnel more dramatic.

```typescript
createTornado({ intensity: 1.5 });
```

### `color`

The base color of the tornado funnel and debris particles.

```typescript
createTornado({ color: '#6B5B45' });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createTornado({ scale: 1.5 });
```
