# Portal API

## `Portal`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createPortal(config?: PortalConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `PortalConfig`

```typescript
interface PortalConfig {
    color?: string;
    direction?: PortalDirection;
    particles?: number;
    scale?: number;
    secondaryColor?: string;
    size?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#8844ff'` | Primary color of the portal rings and inner glow. |
| `direction` | `PortalDirection` | `'inward'` | Direction of the particle spiral. |
| `particles` | `number` | `100` | Number of spiraling particles. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `secondaryColor` | `string` | `'#44aaff'` | Secondary color for the outer ring and particle trails. |
| `size` | `number` | `0.3` | Relative portal size (0–1) based on the smallest canvas dimension. |
| `speed` | `number` | `1` | Rotation and particle speed multiplier. |

---

## `PortalDirection`

```typescript
type PortalDirection = 'inward' | 'outward';
```

---

## `PortalParticle`

```typescript
interface PortalParticle {
    angle: number;
    radius: number;
    size: number;
    speed: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `angle` | `number` | Current angle on the spiral path (radians). |
| `radius` | `number` | Distance from the portal center. |
| `size` | `number` | Particle size. |
| `speed` | `number` | Individual speed modifier. |
