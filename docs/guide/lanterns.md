# Lanterns

The lanterns simulation creates glowing paper lanterns that rise gently from the bottom while swaying side to side. Each lantern has a warm pulsing glow, a flickering flame inside, and a small dangling string. The effect evokes the atmosphere of a peaceful lantern festival.

::: render
render=../code/lanterns/preview.vue
:::

## Examples

::: example Basic lanterns || Gently rising lanterns with warm, pulsing glow.
example=../code/lanterns/preview.vue
:::

::: example Lantern festival || A dense sky filled with rising lanterns.
example=../code/lanterns/festival.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createLanterns } from '@basmilius/sparkle';

const lanterns = createLanterns({
    count: 25,
    colors: ['#ff6b35', '#ff8c42', '#ffd166', '#ffb347', '#e85d04', '#f4845f', '#c1121f'],
    size: 20,
    speed: 0.5,
    scale: 1
});
lanterns.mount(canvas).start();
```

### Count

Control the number of lanterns:

```typescript
// Sparse, subtle
createLanterns({ count: 10 });

// Dense festival
createLanterns({ count: 50 });
```

### Colors

Customize the lantern colors with an array of hex color strings:

```typescript
// Red and gold theme
createLanterns({ colors: ['#c1121f', '#ffd166', '#ffb347'] });

// Cool tones
createLanterns({ colors: ['#4488ff', '#66ccff', '#88ddff'] });
```

### Size

Control the base lantern size in pixels:

```typescript
// Small, distant lanterns
createLanterns({ size: 12 });

// Large, close lanterns
createLanterns({ size: 30 });
```

### Speed

Control how fast the lanterns rise:

```typescript
// Very slow, meditative
createLanterns({speed: 0.3});

// Brisk ascent
createLanterns({speed: 1});
```
