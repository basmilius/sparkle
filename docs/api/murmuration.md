# Murmuration API

## `Murmuration`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createMurmuration(config?: MurmurationConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `MurmurationConfig`

```typescript
interface MurmurationConfig {
    alignment?: number;
    cohesion?: number;
    color?: string;
    count?: number;
    scale?: number;
    separation?: number;
    speed?: number;
    turnRadius?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `alignment` | `number` | `0.8` | How strongly birds align direction with nearby flock mates. |
| `cohesion` | `number` | `0.5` | How strongly birds are attracted to the flock center. |
| `color` | `string` | `'#1a1a2e'` | Color of the birds. |
| `count` | `number` | `300` | Number of birds in the swarm. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `separation` | `number` | `0.4` | How strongly birds avoid crowding nearby flock mates. |
| `speed` | `number` | `1` | Overall speed multiplier. |
| `turnRadius` | `number` | `0.7` | How sharply birds can change direction. |

---

## `MurmurationBird`

Represents a single bird in the swarm. Used internally by the effect.
