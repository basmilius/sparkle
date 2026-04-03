# HyperSpace API

## `HyperSpace`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createHyperSpace(config?: HyperSpaceConfig): Effect<HyperSpaceConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `HyperSpaceConfig`

```typescript
interface HyperSpaceConfig {
    readonly count?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly scale?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `250` | Number of stars radiating outward. |
| `speed` | `number` | `1` | Outward velocity and acceleration. |
| `color` | `string` | `'#ffffff'` | Color of the star streaks. |
| `scale` | `number` | `1` | Uniform scale multiplier. |
