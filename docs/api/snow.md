# Snow API

## `Snow`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createSnow(config?: SnowConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `SnowConfig`

```typescript
interface SnowConfig {
    fillStyle?: string;
    particles?: number;
    scale?: number;
    size?: number;
    speed?: number;
}
```

| Property    | Type     | Default                    | Description                                                  |
|-------------|----------|----------------------------|--------------------------------------------------------------|
| `fillStyle` | `string` | `'rgb(255 255 255 / .75)'` | CSS color string for the snowflake fill.                     |
| `particles` | `number` | `200`                      | Number of snowflakes. Automatically halved on small screens. |
| `scale`     | `number` | `1`                        | Scales all snowflake sizes proportionally.                   |
| `size`      | `number` | `9`                        | Maximum snowflake radius in pixels (before scale).           |
| `speed`     | `number` | `1`                        | Fall speed multiplier.                                       |
