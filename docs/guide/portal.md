# Portal

Spinning energy portal with swirling rings and particles spiraling inward or outward. Creates a mystical vortex effect with configurable colors and direction.

::: render
render=../code/portal/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/portal/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createPortal } from '@basmilius/sparkle';

const portal = createPortal({
    speed: 1,
    particles: 100,
    size: 0.3,
    color: '#8844ff',
    secondaryColor: '#44aaff',
    direction: 'inward',
    scale: 1
});
portal.mount(canvas).start();
```

### `speed`

Speed multiplier for the portal rotation and particle movement.

```typescript
createPortal({ speed: 1.5 });
```

### `particles`

Number of particles spiraling around the portal.

```typescript
createPortal({ particles: 200 });
```

### `size`

Relative size of the portal (0–1). A value of 0.3 means the portal takes up roughly 30% of the smallest canvas dimension.

```typescript
createPortal({ size: 0.5 });
```

### `color`

Primary color of the portal rings and inner glow.

```typescript
createPortal({ color: '#ff4488' });
```

### `secondaryColor`

Secondary color used for the outer ring and particle trails.

```typescript
createPortal({ secondaryColor: '#ffaa44' });
```

### `direction`

Direction of the particle spiral. Use `'inward'` for particles spiraling into the center, or `'outward'` for particles expanding outward.

```typescript
createPortal({ direction: 'outward' });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createPortal({ scale: 1.5 });
```
