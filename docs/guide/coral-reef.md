# Coral Reef

Underwater scene with swaying sea anemones, pulsing jellyfish, and rising bubbles. Anemones wave gently with the current while jellyfish drift and pulse through the water column.

::: render
render=../code/coral-reef/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/coral-reef/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createCoralReef } from '@basmilius/sparkle';

const coralReef = createCoralReef({
    anemones: 8,
    jellyfish: 5,
    bubbles: 20,
    speed: 1,
    colors: ['#ff6b9d', '#c44dff', '#4dc9f6', '#f67019', '#acc236'],
    scale: 1
});
coralReef.mount(canvas).start();
```

### `anemones`

The number of sea anemones swaying at the bottom of the scene.

```typescript
createCoralReef({ anemones: 12 });
```

### `jellyfish`

The number of jellyfish drifting through the water.

```typescript
createCoralReef({ jellyfish: 8 });
```

### `bubbles`

The number of bubbles rising from the reef.

```typescript
createCoralReef({ bubbles: 30 });
```

### `speed`

Controls the overall animation speed of all underwater elements.

```typescript
createCoralReef({ speed: 0.5 });
```

### `colors`

An array of colors used for the coral, anemones, and jellyfish.

```typescript
createCoralReef({ colors: ['#ff4488', '#8844ff', '#44aaff'] });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createCoralReef({ scale: 1.5 });
```
