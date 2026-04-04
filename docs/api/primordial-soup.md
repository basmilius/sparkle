# Primordial Soup API

## `PrimordialSoup`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createPrimordialSoup(config?: PrimordialSoupConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `PrimordialSoupConfig`

```typescript
interface PrimordialSoupConfig {
    speed?: number;
    maxCells?: number;
    foodRate?: number;
    colors?: string[];
    scale?: number;
}
```

| Property   | Type       | Default                                                          | Description                                                      |
|------------|------------|------------------------------------------------------------------|------------------------------------------------------------------|
| `speed`    | `number`   | `1`                                                              | Animation speed multiplier.                                      |
| `maxCells` | `number`   | `40`                                                             | Maximum number of living cells. Halved on small screens.         |
| `foodRate` | `number`   | `3`                                                              | Rate at which food particles spawn per second.                   |
| `colors`   | `string[]` | `['#66bb6a', '#42a5f5', '#ab47bc', '#ef5350', '#ffa726']`        | Colors assigned to cell lineages.                                |
| `scale`    | `number`   | `1`                                                              | Global scale factor for cell radii.                              |

---

## Internal Types

### `Cell`

```typescript
type Cell = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: [number, number, number];
    energy: number;
    divideTimer: number;
};
```

### `FoodParticle`

```typescript
type FoodParticle = {
    x: number;
    y: number;
    radius: number;
    color: [number, number, number];
    opacity: number;
};
```

### `DividingCell`

```typescript
type DividingCell = {
    x: number;
    y: number;
    radius: number;
    color: [number, number, number];
    angle: number;
    progress: number;
    energy: number;
};
```
