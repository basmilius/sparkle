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
import { BubbleSimulation } from '@basmilius/sparkle';

const sim = new BubbleSimulation(canvas, {
    count: 30,
    sizeRange: [10, 40],
    speed: 1,
    popOnClick: true,
    scale: 1
});
sim.start();
```

### Count

Control the number of bubbles:

```typescript
// Few, sparse bubbles
new BubbleSimulation(canvas, { count: 10 });

// Dense bubble field
new BubbleSimulation(canvas, { count: 60 });
```

### Size Range

Set the minimum and maximum bubble radius:

```typescript
// Small, uniform bubbles
new BubbleSimulation(canvas, { sizeRange: [5, 15] });

// Large, varied bubbles
new BubbleSimulation(canvas, { sizeRange: [20, 60] });
```

### Pop on Click

Enable or disable click-to-pop:

```typescript
// Disable popping
new BubbleSimulation(canvas, { popOnClick: false });

// Larger pop detection area
new BubbleSimulation(canvas, { popOnClick: true, popRadius: 100 });
```

### Wobble

Control the horizontal wobble intensity:

```typescript
// Minimal wobble
new BubbleSimulation(canvas, { wobbleAmount: 0.3 });

// Exaggerated wobble
new BubbleSimulation(canvas, { wobbleAmount: 2 });
```
