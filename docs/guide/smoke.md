# Smoke

Soft rising smoke particles that drift upward from the bottom of the canvas with organic turbulence. Each particle expands and fades as it rises, creating a layered atmospheric effect.

::: render
render=../code/smoke/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/smoke/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createSmoke } from '@basmilius/sparkle';

const smoke = createSmoke({
    count: 40,
    speed: 1,
    color: '#888888',
    spread: 0.3,
    scale: 1
});
smoke.mount(canvas).start();
```

### `count`

The number of smoke particles. More particles create a denser smoke effect.

```typescript
createSmoke({ count: 60 });
```

### `speed`

Controls how fast the smoke rises. Lower values produce slow, lazy smoke.

```typescript
createSmoke({ speed: 0.5 });
```

### `color`

The base color of the smoke particles. Works best with neutral gray tones but any CSS color is accepted.

```typescript
createSmoke({ color: '#aaaaaa' });
```

### `spread`

How wide the smoke rises from the center (0–1). A value of `0.3` means smoke originates within 30% of the canvas width around center.

```typescript
createSmoke({ spread: 0.5 });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createSmoke({ scale: 1.5 });
```
