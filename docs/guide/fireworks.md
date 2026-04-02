# Fireworks

The fireworks simulation creates a continuous display with 16 unique explosion variants, 3D depth effects, and configurable scale. Fireworks are launched automatically and explode into one of the available variants.

::: render
render=../code/fireworks/preview.vue
:::

## Examples

::: example Basic || An auto-spawning firework display with default settings.
example=../code/fireworks/basic.vue
:::

::: example Manual control || Click anywhere on the canvas to fire a random explosion at that position.
example=../code/fireworks/manual.vue
:::

::: example Variant picker || Try each of the 16 variants individually using the buttons.
example=../code/fireworks/lab.vue
:::

## Scaling

Use the `scale` option to control the overall size of all effects:

```typescript
// Smaller, more subtle fireworks
const sim = new FireworkSimulation(canvas, { scale: 0.5 });

// Bigger, more dramatic fireworks
const sim = new FireworkSimulation(canvas, { scale: 2 });
```

## Variants

There are 16 variants organized in four categories.

### Classic

| Variant | Description |
|---------|-------------|
| `peony` | Classic spherical burst with round particles. |
| `chrysanthemum` | Dense burst with long trailing particles and sparkle. |
| `willow` | Particles fall gracefully with very long trails, like a weeping willow. |
| `palm` | Narrow upward cone that arcs into drooping trails. |
| `brocade` | Dense golden shimmer trails in warm amber tones. |
| `horsetail` | Narrow upward fountain with extreme gravity, creating a cascade. |

### Geometric

| Variant | Description |
|---------|-------------|
| `ring` | Particles form a perfect circle with diamond shapes. |
| `concentric` | Two concentric rings at different sizes with complementary colors. |
| `saturn` | A filled 3D sphere with a tilted elliptical ring around it. |

### Shapes

| Variant | Description |
|---------|-------------|
| `heart` | Particles follow a parametric heart curve. |
| `flower` | Rose curve that creates a petal pattern with 4-8 lobes. |
| `spiral` | Multiple arms that spiral outward like a galaxy. |
| `dahlia` | Multi-colored petal clusters with alternating hues. |

### Effects

| Variant | Description |
|---------|-------------|
| `crackle` | Star-shaped particles that create spark flashes when dying. |
| `crossette` | Particles that split into 4 sub-explosions mid-flight. |
| `strobe` | Particles that blink on/off at ~10Hz. |
