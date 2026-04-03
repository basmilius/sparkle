# Digital Rain API

## `DigitalRain`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createDigitalRain(config?: DigitalRainConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `DigitalRainConfig`

```typescript
interface DigitalRainConfig {
    color?: string;
    columns?: number;
    fontSize?: number;
    mode?: DigitalRainMode;
    scale?: number;
    speed?: number;
    trailLength?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#00ffaa'` | Color of the falling characters. |
| `columns` | `number` | `0` | Number of columns (0 = auto based on canvas width). |
| `fontSize` | `number` | `14` | Font size in pixels. |
| `mode` | `DigitalRainMode` | `'hex'` | Character set used for falling data. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `1` | Fall speed multiplier. |
| `trailLength` | `number` | `20` | Number of characters in each column's fading trail. |

---

## `DigitalRainMode`

```typescript
type DigitalRainMode = 'binary' | 'hex' | 'mixed';
```

| Value | Description |
|-------|-------------|
| `'binary'` | Only 0 and 1 characters. |
| `'hex'` | Hexadecimal characters (0–9, A–F). |
| `'mixed'` | Combination of binary and hexadecimal characters. |

---

## `DigitalRainColumn`

```typescript
interface DigitalRainColumn {
    chars: string[];
    speed: number;
    x: number;
    y: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `chars` | `string[]` | Current characters in the column. |
| `speed` | `number` | Individual fall speed modifier. |
| `x` | `number` | Horizontal position of the column. |
| `y` | `number` | Current vertical head position. |
