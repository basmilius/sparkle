# Pulse Grid API

## `PulseGrid`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createPulseGrid(config?: PulseGridConfig): Effect<PulseGridConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `PulseGridConfig`

```typescript
interface PulseGridConfig {
    readonly spacing?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly dotSize?: number;
    readonly waveCount?: number;
    readonly waveSpeed?: number;
    readonly scale?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `spacing` | `number` | `30` | Distance in pixels between grid dots. |
| `speed` | `number` | `1` | Overall animation speed multiplier. |
| `color` | `string` | `'#4488ff'` | Base color of the dots. |
| `dotSize` | `number` | `2` | Radius of each dot. |
| `waveCount` | `number` | `3` | Number of simultaneous ripple waves. |
| `waveSpeed` | `number` | `100` | Expansion speed of waves in pixels per second. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |

---

## `PulseWave`

```typescript
interface PulseWave {
    readonly x: number;
    readonly y: number;
    readonly radius: number;
    readonly maxRadius: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X coordinate of the wave origin. |
| `y` | `number` | Y coordinate of the wave origin. |
| `radius` | `number` | Current radius of the expanding wave. |
| `maxRadius` | `number` | Maximum radius before the wave resets. |
