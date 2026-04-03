# Fireworks API

## `FireworkSimulation`

### Constructor

```typescript
new FireworkSimulation(canvas: HTMLCanvasElement, config?: FireworkSimulationConfig)
```

### Methods

#### `start()`

Starts the simulation loop.

#### `stop()`

Stops the simulation loop.

#### `destroy()`

Stops the simulation and removes all event listeners.

#### `fireExplosion(variant, position?)`

Fires a single explosion of the given variant.

```typescript
fireExplosion(variant: FireworkVariant, position?: Point): void
```

| Parameter  | Type                       | Description                                        |
|------------|----------------------------|----------------------------------------------------|
| `variant`  | `FireworkVariant`          | The explosion variant to fire.                     |
| `position` | `{ x: number; y: number }` | Screen position. Defaults to center at 40% height. |

## `FireworkSimulationConfig`

```typescript
interface FireworkSimulationConfig {
    scale?: number;
    autoSpawn?: boolean;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

## `FireworkVariant`

```typescript
type FireworkVariant =
    | 'peony' | 'chrysanthemum' | 'willow' | 'ring'
    | 'palm' | 'crackle' | 'crossette' | 'dahlia'
    | 'brocade' | 'horsetail' | 'strobe' | 'heart'
    | 'spiral' | 'flower' | 'saturn' | 'concentric';
```

## `FIREWORK_VARIANTS`

```typescript
const FIREWORK_VARIANTS: FireworkVariant[]
```

Array containing all variant names. Useful for building UIs.
