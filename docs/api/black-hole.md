# Black Hole API

## `BlackHole`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createBlackHole(config?: BlackHoleConfig): Effect<BlackHoleConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `BlackHoleConfig`

```typescript
interface BlackHoleConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly size?: number;
    readonly scale?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `300` | Number of particles spiraling inward. |
| `speed` | `number` | `1` | Inward spiral speed. |
| `color` | `string` | `'#6644ff'` | Base particle color; shifts to white near the event horizon. |
| `size` | `number` | `2` | Base particle size in pixels. |
| `scale` | `number` | `1` | Uniform scale multiplier. |
