# Primordial Soup

The primordial soup effect simulates a microscopic world of single-celled organisms. Cells drift via Brownian motion, consume food particles to gain energy, grow, and divide through an animated mitosis sequence. Cells that can't find food shrink and eventually die off.

::: render
render=../code/primordial-soup/preview.vue
:::

## Examples

::: example Basic || Default cell simulation with colorful organisms.
example=../code/primordial-soup/preview.vue
:::

## Configuration

```typescript
import { createPrimordialSoup } from '@basmilius/sparkle';

const soup = createPrimordialSoup({
    speed: 1,
    maxCells: 40,
    foodRate: 3,
    colors: ['#66bb6a', '#42a5f5', '#ab47bc', '#ef5350', '#ffa726'],
    scale: 1
});
soup.mount(canvas).start();
```

### Population Size

```typescript
// Small, sparse population
createPrimordialSoup({ maxCells: 15 });

// Crowded petri dish
createPrimordialSoup({ maxCells: 80 });
```

### Food Rate

Controls how quickly food particles appear for cells to consume:

```typescript
// Scarce food, cells must compete
createPrimordialSoup({ foodRate: 1 });

// Abundant food, rapid growth and division
createPrimordialSoup({ foodRate: 8 });
```

### Colors

Each color is assigned to a cell lineage. Child cells inherit their parent's color:

```typescript
// Monochrome
createPrimordialSoup({ colors: ['#44aaff'] });

// Earthy tones
createPrimordialSoup({
    colors: ['#8bc34a', '#cddc39', '#ffeb3b', '#ff9800', '#795548']
});
```
