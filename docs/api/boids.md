# Boids API

## `Boids`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createBoids(config?: BoidsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `BoidsConfig`

```typescript
interface BoidsConfig {
    count?: number;
    speed?: number;
    separation?: number;
    alignment?: number;
    cohesion?: number;
    color?: string;
    size?: number;
    scale?: number;
}
```

| Property     | Type     | Default      | Description                                                     |
|--------------|----------|--------------|-----------------------------------------------------------------|
| `count`      | `number` | `80`         | Number of boids in the flock. Halved on small screens.          |
| `speed`      | `number` | `1`          | Overall movement speed multiplier.                              |
| `separation` | `number` | `1`          | Strength of the separation steering rule (avoid crowding).      |
| `alignment`  | `number` | `1`          | Strength of the alignment steering rule (match neighbors).      |
| `cohesion`   | `number` | `1`          | Strength of the cohesion steering rule (move toward group).     |
| `color`      | `string` | `'#44aaff'`  | CSS color string for boid shapes.                               |
| `size`       | `number` | `6`          | Boid triangle size in pixels.                                   |
| `scale`      | `number` | `1`          | Scales boid sizes proportionally.                               |
