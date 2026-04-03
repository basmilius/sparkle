# Murmuration

Starling-like swarm forming organic flowing shapes using boid rules with a characteristic ripple wave effect. Hundreds of birds move together in mesmerizing synchronized patterns.

::: render
render=../code/murmuration/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/murmuration/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createMurmuration } from '@basmilius/sparkle';

const murmuration = createMurmuration({
    count: 300,
    speed: 1,
    cohesion: 0.5,
    alignment: 0.8,
    separation: 0.4,
    turnRadius: 0.7,
    color: '#1a1a2e',
    scale: 1
});
murmuration.mount(canvas).start();
```

### `count`

The number of birds in the swarm. Higher values produce denser, more dramatic formations.

```typescript
createMurmuration({ count: 500 });
```

### `speed`

Overall speed multiplier for the flock movement.

```typescript
createMurmuration({ speed: 1.5 });
```

### `cohesion`

How strongly birds are attracted towards the center of their nearby flock mates. Higher values produce tighter groups.

```typescript
createMurmuration({ cohesion: 0.8 });
```

### `alignment`

How strongly birds align their direction with nearby flock mates. Higher values make the flock move more uniformly.

```typescript
createMurmuration({ alignment: 1 });
```

### `separation`

How strongly birds avoid crowding nearby flock mates. Higher values keep birds further apart.

```typescript
createMurmuration({ separation: 0.6 });
```

### `turnRadius`

Controls how sharply birds can change direction. Lower values allow tighter turns.

```typescript
createMurmuration({ turnRadius: 0.5 });
```

### `color`

The color of the birds.

```typescript
createMurmuration({ color: '#2d2d44' });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createMurmuration({ scale: 1.5 });
```
