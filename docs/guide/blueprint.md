# Blueprint

The blueprint effect renders animated technical drawings — geometric shapes like lines, rectangles, circles, and dimension annotations — drawn progressively on a grid background, as if a draughtsman is sketching engineering diagrams in real time.

::: render
render=../code/blueprint/preview.vue
:::

## Examples

::: example Basic || Default blueprint with a dark blue background and white-blue lines.
example=../code/blueprint/preview.vue
:::

## Configuration

```typescript
import { createBlueprint } from '@basmilius/sparkle';

const blueprint = createBlueprint({
    speed: 1,
    gridSize: 30,
    lineColor: '#c8deff',
    backgroundColor: '#0d1b2a',
    complexity: 5,
    scale: 1
});
blueprint.mount(canvas).start();
```

### Speed

```typescript
// Slow, contemplative drawing
createBlueprint({ speed: 0.5 });

// Fast-paced drafting
createBlueprint({ speed: 2 });
```

### Grid Size

Controls the spacing of the background grid in pixels:

```typescript
// Fine grid
createBlueprint({ gridSize: 15 });

// Coarse grid
createBlueprint({ gridSize: 60 });
```

### Colors

Customize the line and background colors:

```typescript
// White on dark
createBlueprint({ lineColor: '#ffffff', backgroundColor: '#111111' });

// Amber engineering style
createBlueprint({ lineColor: '#ffcc44', backgroundColor: '#1a1000' });
```

### Complexity

Controls how many elements each drawing contains:

```typescript
// Simple shapes
createBlueprint({ complexity: 2 });

// Complex, detailed diagrams
createBlueprint({ complexity: 8 });
```
