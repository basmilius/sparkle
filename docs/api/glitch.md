# Glitch API

## `Glitch`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createGlitch(config?: GlitchConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `GlitchConfig`

```typescript
interface GlitchConfig {
    color?: string;
    intensity?: number;
    noiseBlocks?: boolean;
    rgbSplit?: number;
    scale?: number;
    scanlines?: boolean;
    sliceDisplacement?: boolean;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#00ff41'` | Primary color for glitch artifacts and scanlines. |
| `intensity` | `number` | `0.5` | Overall strength of glitch artifacts (0–1). |
| `noiseBlocks` | `boolean` | `true` | Enable random rectangular noise blocks. |
| `rgbSplit` | `number` | `3` | Maximum pixel offset for RGB channel separation. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `scanlines` | `boolean` | `true` | Enable horizontal scanline overlay. |
| `sliceDisplacement` | `boolean` | `true` | Enable horizontal slice displacement bands. |
| `speed` | `number` | `1` | Animation speed multiplier. |
