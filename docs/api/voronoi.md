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
    scale?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cells` | `number` | `20` | Number of Voronoi cells. |
| `colors` | `string[]` | `['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#e17055']` | Colors used for filling cells. |
| `edgeColor` | `string` | `'#ffffff'` | Color of cell edges. |
| `edgeWidth` | `number` | `2` | Width of cell edges in pixels. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `0.5` | Drift speed of seed points. |
