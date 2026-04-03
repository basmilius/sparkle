# Crystallization API

## `Crystallization`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createCrystallization(config?: CrystallizationConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `CrystallizationConfig`

```typescript
interface CrystallizationConfig {
    branchAngle?: number;
    color?: string;
    maxDepth?: number;
    scale?: number;
    seeds?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `branchAngle` | `number` | `60` | Angle in degrees at which branches split. |
| `color` | `string` | `'#88ccff'` | Base color of the crystal branches. |
| `maxDepth` | `number` | `5` | Maximum recursion depth for branching. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `seeds` | `number` | `5` | Number of seed points. |
| `speed` | `number` | `1` | Growth speed multiplier. |

---

## `CrystalBranch`

```typescript
interface CrystalBranch {
    angle: number;
    depth: number;
    length: number;
    progress: number;
    x: number;
    y: number;
}
```

---

## `CrystalSeed`

```typescript
interface CrystalSeed {
    branches: CrystalBranch[];
    x: number;
    y: number;
}
```
