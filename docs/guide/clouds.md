# Clouds

Soft layered clouds slowly drifting across the canvas. Each cloud is built from multiple overlapping radial gradient blobs pre-rendered to an offscreen sprite. Different layers move at different speeds to create a parallax depth effect.

::: render
render=../code/clouds/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/clouds/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createClouds } from '@basmilius/sparkle';

const clouds = createClouds({
    count: 8,
    speed: 0.3,
    color: '#ffffff',
    opacity: 0.8,
    scale: 1
});
clouds.mount(canvas).start();
```

### `count`

The number of clouds visible at once.

```typescript
createClouds({ count: 12 });
```

### `speed`

How fast the clouds drift across the canvas. Lower values create a calm, peaceful sky.

```typescript
createClouds({ speed: 0.5 });
```

### `color`

The base color of the clouds. Use white for a bright sky or light gray for overcast conditions.

```typescript
createClouds({ color: '#e8e8e8' });
```

### `opacity`

Maximum opacity of the clouds (0–1). Reduces all cloud transparency proportionally.

```typescript
createClouds({ opacity: 0.6 });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createClouds({ scale: 1.5 });
```
