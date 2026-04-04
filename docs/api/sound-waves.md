# Sound Waves API

## `SoundWaves`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createSoundWaves(config?: SoundWavesConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

Clicking the canvas adds a temporary burst wave source at the click position.

---

## `SoundWavesConfig`

```typescript
interface SoundWavesConfig {
    speed?: number;
    sources?: number;
    frequency?: number;
    amplitude?: number;
    colors?: string[];
    resolution?: number;
    damping?: number;
    scale?: number;
}
```

| Property     | Type       | Default                                                        | Description                                                           |
|--------------|------------|----------------------------------------------------------------|-----------------------------------------------------------------------|
| `speed`      | `number`   | `1`                                                            | Animation speed multiplier.                                           |
| `sources`    | `number`   | `3`                                                            | Number of autonomous wave sources.                                    |
| `frequency`  | `number`   | `1`                                                            | Wave frequency multiplier — higher values produce tighter ripples.    |
| `amplitude`  | `number`   | `1`                                                            | Wave amplitude multiplier — higher values produce stronger contrast.  |
| `colors`     | `string[]` | `['#1e40af', '#0891b2', '#0d9488', '#2563eb', '#06b6d4']`      | Colors assigned to each wave source, cycling if fewer than sources.   |
| `resolution` | `number`   | `4`                                                            | Pixel size of each rendered cell (higher = faster but blockier).      |
| `damping`    | `number`   | `0.98`                                                         | Wave attenuation per distance unit — lower values damp waves faster.  |
| `scale`      | `number`   | `1`                                                            | Global scale factor.                                                  |
