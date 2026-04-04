# Spirograph API

## `Spirograph`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createSpirograph(config?: SpirographConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `SpirographConfig`

```typescript
interface SpirographConfig {
    speed?: number;
    curves?: number;
    colors?: string[];
    lineWidth?: number;
    fadeSpeed?: number;
    complexity?: number;
    scale?: number;
}
```

| Property    | Type       | Default                                                          | Description                                                        |
|-------------|------------|------------------------------------------------------------------|--------------------------------------------------------------------|
| `speed`     | `number`   | `1`                                                              | Drawing speed multiplier.                                          |
| `curves`    | `number`   | `3`                                                              | Number of simultaneous spirograph curves.                          |
| `colors`    | `string[]` | `['#ff3366', '#33aaff', '#ffcc00', '#66ff99', '#cc66ff', '#ff6633']` | Colors assigned to curves, cycling if fewer than curves.       |
| `lineWidth` | `number`   | `1.5`                                                            | Stroke width in pixels (before scale).                             |
| `fadeSpeed` | `number`   | `0.003`                                                          | Rate at which a curve ages — higher values replace patterns faster.|
| `complexity`| `number`   | `5`                                                              | Controls the range of gear ratio denominators used.                |
| `scale`     | `number`   | `1`                                                              | Global scale factor.                                               |

---

## `SpirographCurve`

Internal representation of a single spirograph curve.

```typescript
type SpirographCurve = {
    outerRadius: number;
    innerRadius: number;
    penOffset: number;
    phase: number;
    color: string;
    colorRGB: [number, number, number];
    points: Point[];
    pointHead: number;
    maxPoints: number;
    age: number;
    maxAge: number;
};
```
