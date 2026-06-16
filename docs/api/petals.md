# Petals API

## `Petals`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createPetals(config?: PetalsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `PetalsConfig`

```typescript
interface PetalsConfig {
    count?: number;
    colors?: string[];
    size?: number;
    speed?: number;
    wind?: number;
    scale?: number;
}
```

| Property | Type       | Default                  | Description                                                  |
|----------|------------|--------------------------|--------------------------------------------------------------|
| `count`  | `number`   | `100`                    | Number of petals. Automatically halved on small screens.     |
| `colors` | `string[]` | Sakura palette (7 pinks) | Array of CSS color strings for petal colors.                 |
| `size`   | `number`   | `30`                     | Maximum petal size in pixels (before scale).                 |
| `speed`  | `number`   | `0.7`                    | Fall speed multiplier.                                       |
| `wind`   | `number`   | `0.15`                   | Horizontal wind strength. Positive = right, negative = left. |
| `scale`  | `number`   | `1`                      | Scales all petal sizes proportionally.                       |
