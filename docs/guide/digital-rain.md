# Digital Rain

Falling binary or hex characters in columns with fading trails. Similar to the Matrix rain effect but with customizable character sets, including binary, hexadecimal, and mixed modes.

::: render
render=../code/digital-rain/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/digital-rain/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createDigitalRain } from '@basmilius/sparkle';

const rain = createDigitalRain({
    speed: 1,
    fontSize: 14,
    columns: 0,
    mode: 'hex',
    color: '#00ffaa',
    trailLength: 20,
    scale: 1
});
rain.mount(canvas).start();
```

### `speed`

Speed multiplier for the falling character columns.

```typescript
createDigitalRain({ speed: 1.5 });
```

### `fontSize`

Font size in pixels for the rendered characters.

```typescript
createDigitalRain({ fontSize: 18 });
```

### `columns`

Number of character columns. Set to `0` for automatic column count based on canvas width and font size.

```typescript
createDigitalRain({ columns: 30 });
```

### `mode`

Character set used for the falling data. Choose `'binary'` for 0s and 1s, `'hex'` for hexadecimal characters, or `'mixed'` for a combination of both.

```typescript
createDigitalRain({ mode: 'binary' });
```

### `color`

Color of the falling characters. The trailing characters fade from this color to transparent.

```typescript
createDigitalRain({ color: '#ff4400' });
```

### `trailLength`

Number of characters in each column's fading trail.

```typescript
createDigitalRain({ trailLength: 30 });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createDigitalRain({ scale: 1.5 });
```
