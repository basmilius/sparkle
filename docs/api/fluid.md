# Fluid API

## `Fluid`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createFluid(config?: FluidConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

The fluid effect responds to mouse movement: moving the mouse over the canvas stirs the velocity field and injects colored dye.

---

## `FluidConfig`

```typescript
interface FluidConfig {
    speed?: number;
    resolution?: number;
    colors?: string[];
    viscosity?: number;
    diffusion?: number;
    mouseForce?: number;
    scale?: number;
}
```

| Property     | Type       | Default                                                    | Description                                                  |
|--------------|------------|------------------------------------------------------------|------------------------------------------------------------- |
| `speed`      | `number`   | `1`                                                        | Animation speed multiplier.                                  |
| `resolution` | `number`   | `128`                                                      | Grid resolution for the fluid simulation (higher = smoother but slower). |
| `colors`     | `string[]` | `['#ff3366', '#33ccff', '#66ff33', '#ff9933', '#cc33ff']`  | Dye colors injected into the simulation.                     |
| `viscosity`  | `number`   | `0.5`                                                      | Velocity damping — higher values make the fluid thicker.     |
| `diffusion`  | `number`   | `0.5`                                                      | Dye spreading rate — higher values make colors spread faster.|
| `mouseForce` | `number`   | `1`                                                        | Strength of the mouse stir force.                            |
| `scale`      | `number`   | `1`                                                        | Global scale factor.                                         |

---

## `FluidCell`

Internal representation of a single grid cell in the simulation.

```typescript
type FluidCell = {
    vx: number;
    vy: number;
    dyeR: number;
    dyeG: number;
    dyeB: number;
};
```
