# Voronoi API

## `Voronoi`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createVoronoi(config?: VoronoiConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `VoronoiConfig`

```typescript
interface VoronoiConfig {
    cells?: number;
    colors?: string[];
    edgeColor?: string;
    edgeWidth?: number;
    resolution?: number;
    scale?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cells` | `number` | `20` | Number of Voronoi cells. |
| `colors` | `string[]` | `['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']` | Colors used for filling cells. |
| `edgeColor` | `string` | `'#ffffff'` | Color of cell edges. |
| `edgeWidth` | `number` | `2` | Width of cell edges in pixels. |
| `resolution` | `number` | `3` | Pixel resolution for the Voronoi computation. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `0.5` | Drift speed of seed points. |

---

## `VoronoiCell`

Represents a single cell in the Voronoi diagram. Used internally by the effect.
