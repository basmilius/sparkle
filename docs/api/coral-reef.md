# Coral Reef API

## `CoralReef`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createCoralReef(config?: CoralReefConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `CoralReefConfig`

```typescript
interface CoralReefConfig {
    anemones?: number;
    bubbles?: number;
    colors?: string[];
    jellyfish?: number;
    scale?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `anemones` | `number` | `8` | Number of sea anemones. |
| `bubbles` | `number` | `20` | Number of rising bubbles. |
| `colors` | `string[]` | `['#ff6b9d', '#c44dff', '#4dc9f6', '#f67019', '#acc236']` | Colors for coral, anemones, and jellyfish. |
| `jellyfish` | `number` | `5` | Number of jellyfish. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `1` | Animation speed multiplier. |

---

## `CoralAnemone`

```typescript
interface CoralAnemone {
    color: string;
    tentacles: number;
    x: number;
    y: number;
    size: number;
    swayOffset: number;
}
```

---

## `CoralJellyfish`

```typescript
interface CoralJellyfish {
    color: string;
    phase: number;
    pulseSpeed: number;
    size: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}
```

---

## `CoralBubble`

```typescript
interface CoralBubble {
    opacity: number;
    size: number;
    speed: number;
    wobble: number;
    x: number;
    y: number;
}
```
