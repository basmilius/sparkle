# Bubbles

The bubbles simulation creates rising soap bubbles with iridescent light reflections and subtle color shifts. Bubbles gently wobble as they float upward and can be popped with a click.

::: render
render=../code/bubbles/preview.vue
:::

## Examples

::: example Basic bubbles || Rising soap bubbles with click-to-pop interaction.
example=../code/bubbles/preview.vue
:::

::: example Dense and interactive || More bubbles with a larger pop radius.
example=../code/bubbles/interactive.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createBubbles } from '@basmilius/sparkle';

const bubbles = createBubbles({
    count: 30,
    sizeRange: [10, 40],
    speed: 1,
    popOnClick: true,
    scale: 1
});
bubbles.mount(canvas).start();
```

### Count

Control the number of bubbles:

```typescript
// Few, sparse bubbles
createBubbles({ count: 10 });

// Dense bubble field
createBubbles({ count: 60 });
```

### Size Range

Set the minimum and maximum bubble radius:

```typescript
// Small, uniform bubbles
createBubbles({ sizeRange: [5, 15] });

// Large, varied bubbles
createBubbles({ sizeRange: [20, 60] });
```

### Pop on Click

Enable or disable click-to-pop:

```typescript
// Disable popping
createBubbles({ popOnClick: false });

// Larger pop detection area
createBubbles({ popOnClick: true, popRadius: 100 });
```

### Wobble

Control the horizontal wobble intensity:

```typescript
// Minimal wobble
createBubbles({ wobbleAmount: 0.3 });

// Exaggerated wobble
createBubbles({ wobbleAmount: 2 });
```
