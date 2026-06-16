# Matrix API

## `Matrix`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createMatrix(config?: MatrixConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `MatrixConfig`

```typescript
interface MatrixConfig {
    columns?: number;
    speed?: number;
    color?: string;
    fontSize?: number;
    trailLength?: number;
    scale?: number;
}
```

| Property     | Type     | Default     | Description                                                                       |
|--------------|----------|-------------|-----------------------------------------------------------------------------------|
| `columns`    | `number` | `40`        | Maximum number of active falling columns. Automatically halved on small screens.  |
| `speed`      | `number` | `1`         | Fall speed multiplier. Higher values make characters fall faster.                 |
| `color`      | `string` | `'#00ff41'` | Hex color string for the trailing characters. The head character is always white. |
| `fontSize`   | `number` | `14`        | Character size in pixels. Also determines column spacing. Scaled by `scale`.      |
| `trailLength`| `number` | `20`        | Base number of characters per column trail. Actual length varies randomly.        |
| `scale`      | `number` | `1`         | Scales font size proportionally.                                                  |
