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
| `color` | `string` | `'#00ff00'` | Primary color for glitch artifacts and scanlines. |
| `intensity` | `number` | `0.5` | Overall strength of glitch artifacts (0–1). |
| `noiseBlocks` | `boolean` | `true` | Enable random rectangular noise blocks. |
| `rgbSplit` | `number` | `3` | Maximum pixel offset for RGB channel separation. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `scanlines` | `boolean` | `true` | Enable horizontal scanline overlay. |
| `sliceDisplacement` | `boolean` | `true` | Enable horizontal slice displacement bands. |
| `speed` | `number` | `1` | Animation speed multiplier. |

---

## `GlitchSlice`

```typescript
interface GlitchSlice {
    height: number;
    offset: number;
    y: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `height` | `number` | Height of the displaced slice in pixels. |
| `offset` | `number` | Horizontal displacement offset in pixels. |
| `y` | `number` | Vertical position of the slice. |

---

## `GlitchBlock`

```typescript
interface GlitchBlock {
    height: number;
    opacity: number;
    width: number;
    x: number;
    y: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `height` | `number` | Height of the noise block. |
| `opacity` | `number` | Opacity of the noise block. |
| `width` | `number` | Width of the noise block. |
| `x` | `number` | Horizontal position. |
| `y` | `number` | Vertical position. |
