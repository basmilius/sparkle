# Fireworks API

## `FireworkSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new FireworkSimulation(canvas: HTMLCanvasElement, config?: FireworkSimulationConfig)
```

### Methods

#### `start(): void`
Starts the simulation loop.

#### `stop(): void`
Stops the simulation loop.

#### `destroy(): void`
Stops the simulation and removes all event listeners.

#### `fireExplosion(variant, position?): void`
Fires a single explosion of the given variant.

```typescript
sim.fireExplosion(variant: FireworkVariant, position?: Point): void
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `variant` | [`FireworkVariant`](#fireworkvariant) | Yes | The explosion type to fire. |
| `position` | [`Point`](#point) | No | Screen position in pixels. Defaults to center at 40% height. |

---

## `FireworkSimulationConfig`

```typescript
interface FireworkSimulationConfig {
    scale?: number;
    autoSpawn?: boolean;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `scale` | `number` | `1` | Scales all particle sizes, trail widths, and glow proportionally. |
| `autoSpawn` | `boolean` | `true` | When `false`, no fireworks are launched automatically. Use `fireExplosion()` for manual control. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `FireworkVariant`

Union type of all available explosion variants.

```typescript
type FireworkVariant =
    | 'peony' | 'chrysanthemum' | 'willow' | 'ring'
    | 'palm' | 'crackle' | 'crossette' | 'dahlia'
    | 'brocade' | 'horsetail' | 'strobe' | 'heart'
    | 'spiral' | 'flower' | 'saturn' | 'concentric';
```

### Variant Details

#### Classic

| Variant | Particles | Shape | 3D | Gravity | Notes |
|---------|-----------|-------|----|---------|-------|
| `peony` | 50-70 | Circle | Yes | 0.8 | Standard spherical burst. |
| `chrysanthemum` | 80-120 | Line | Yes | 0.5 | Dense, long trails, sparkle. |
| `willow` | 50-70 | Line | No | 1.5 | Long drooping trails. |
| `palm` | 20-30 | Line | No | 1.2 | Narrow upward cone. |
| `brocade` | 60-80 | Line | No | 1.3 | Golden shimmer, sparkle. Forced hue 35-50. |
| `horsetail` | 30-40 | Line | No | 2.0 | Extreme gravity fountain cascade. |

#### Geometric

| Variant | Particles | Shape | Notes |
|---------|-----------|-------|-------|
| `ring` | 40-60 | Diamond | Evenly distributed angles forming a circle. |
| `concentric` | 60-85 | Diamond | Composite: outer ring (speed 7-10) + inner ring (speed 3-5), hue +120. |
| `saturn` | 90-150 | Mixed | Composite: outer shell + filled sphere + rotated elliptical ring (hue +60) with z-depth. |

#### Shapes

| Variant | Particles | Shape | Gravity | Notes |
|---------|-----------|-------|---------|-------|
| `heart` | 60-80 | Circle | 0.3 | Parametric heart curve with slight random tilt. |
| `flower` | 70-90 | Circle | 0.3 | Rose curve `r = \|cos(nθ)\|` with 2-4 petals. |
| `spiral` | 45-60 | Circle | 0.4 | 3-5 arms with increasing angle/speed offset. |
| `dahlia` | 48-108 | Circle | 0.7 | 6-9 petal groups with alternating hue (±25). |

#### Effects

| Variant | Particles | Shape | Notes |
|---------|-----------|-------|-------|
| `crackle` | 40-55 | Star | 8 sparks emitted when each particle dies. |
| `crossette` | 16-20 | Circle | Splits into 4 peony sub-bursts at alpha 0.5. |
| `strobe` | 40-55 | Circle | Blinks on/off (3 frames each) at ~10Hz. |

---

## `ExplosionType`

A subset of `FireworkVariant` — all variants except composites.

```typescript
type ExplosionType =
    | 'peony' | 'chrysanthemum' | 'willow' | 'ring'
    | 'palm' | 'crackle' | 'crossette' | 'dahlia'
    | 'brocade' | 'horsetail' | 'strobe' | 'heart'
    | 'spiral' | 'flower';
```

---

## `ParticleShape`

The visual shape drawn at the head of a particle.

```typescript
type ParticleShape = 'line' | 'circle' | 'star' | 'diamond';
```

---

## `FIREWORK_VARIANTS`

```typescript
const FIREWORK_VARIANTS: FireworkVariant[]
```

Array containing all 16 variant names. Useful for building UIs.

---

## `Point`

```typescript
type Point = {
    x: number;
    y: number;
};
```
