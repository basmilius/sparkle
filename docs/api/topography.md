# Topography API

## `Topography`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createTopography(config?: TopographyConfig): Effect<TopographyConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `TopographyConfig`

```typescript
interface TopographyConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly contourSpacing?: number;
    readonly lineWidth?: number;
    readonly color?: string;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `number` | `0.5` | Speed of height field evolution. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `resolution` | `number` | `4` | Pixel step size for the height field grid. |
| `contourSpacing` | `number` | `0.1` | Spacing between contour levels (0–1). |
| `lineWidth` | `number` | `1.5` | Width of contour lines in pixels. |
| `color` | `string` | `'#2d5016'` | Color of the contour lines. |
