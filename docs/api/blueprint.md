# Blueprint API

## `Blueprint`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createBlueprint(config?: BlueprintConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `BlueprintConfig`

```typescript
interface BlueprintConfig {
    speed?: number;
    gridSize?: number;
    lineColor?: string;
    backgroundColor?: string;
    complexity?: number;
    scale?: number;
}
```

| Property          | Type     | Default      | Description                                                     |
|-------------------|----------|--------------|-----------------------------------------------------------------|
| `speed`           | `number` | `1`          | Animation speed multiplier.                                     |
| `gridSize`        | `number` | `30`         | Background grid spacing in pixels.                              |
| `lineColor`       | `string` | `'#c8deff'`  | Color of drawn lines and shapes.                                |
| `backgroundColor` | `string` | `'#0d1b2a'`  | Background fill color.                                          |
| `complexity`      | `number` | `5`          | Number of elements per drawing (higher = more complex shapes).  |
| `scale`           | `number` | `1`          | Global scale factor.                                            |

---

## `BlueprintElement`

Internal representation of a single element within a drawing.

```typescript
type BlueprintElement = {
    type: 'line' | 'rect' | 'circle' | 'arc' | 'dashed' | 'polyline' | 'dimension';
    points: number[];
    progress: number;
};
```
