# Roots API

## `Roots`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createRoots(config?: RootsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `RootsConfig`

```typescript
interface RootsConfig {
    count?: number;
    speed?: number;
    color?: string;
    branchProbability?: number;
    maxSegments?: number;
    scale?: number;
}
```

| Property            | Type     | Default      | Description                                                               |
|---------------------|----------|--------------|---------------------------------------------------------------------------|
| `count`             | `number` | `5`          | Number of independent root systems.                                       |
| `speed`             | `number` | `1`          | Growth speed multiplier.                                                  |
| `color`             | `string` | `'#4a3728'`  | CSS color string for the root lines. Slight variation applied per branch. |
| `branchProbability` | `number` | `0.3`        | Relative probability of a tip splitting into two branches.                |
| `maxSegments`       | `number` | `200`        | Maximum segments per root system before it fades and resets.              |
| `scale`             | `number` | `1`          | Scales root line widths and step sizes proportionally.                    |
