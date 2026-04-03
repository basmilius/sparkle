# Primitives API

Low-level particle and trail classes used internally by the simulations. Import them directly to build fully custom effects.

---

## `Trail`

A glowing line that travels from a start point to an end point. Sets `isDone` on arrival — no event system, no spark emission.

### Constructor

```typescript
new Trail(start
:
Point, end
:
Point, config ? : TrailConfig
)
```

| Parameter | Type                          | Description                               |
|-----------|-------------------------------|-------------------------------------------|
| `start`   | `Point`                       | Launch position in pixels.                |
| `end`     | `Point`                       | Target position in pixels.                |
| `config`  | [`TrailConfig`](#trailconfig) | Optional appearance and physics settings. |

### Properties

| Property   | Type      | Description                                 |
|------------|-----------|---------------------------------------------|
| `hue`      | `number`  | Color hue 0–360.                            |
| `isDone`   | `boolean` | `true` when the end point has been reached. |
| `position` | `Point`   | Current pixel position (read-only copy).    |

### Methods

#### `tick(): void`

Advances the trail by one frame. Sets `isDone` when the target is reached.

#### `draw(ctx): void`

Renders the glowing trail and head. Does nothing when `isDone`.

---

## `TrailConfig`

```typescript
interface TrailConfig {
    acceleration?: number;
    brightness?: number;
    glow?: number;
    hue?: number;
    length?: number;
    speed?: number;
    width?: number;
}
```

| Property       | Type     | Default | Description                                                           |
|----------------|----------|---------|-----------------------------------------------------------------------|
| `acceleration` | `number` | `1.05`  | Speed multiplier per tick. `1` = constant speed, `> 1` = accelerates. |
| `brightness`   | `number` | `65`    | HSL lightness % for the trail color.                                  |
| `glow`         | `number` | `10`    | Shadow blur for the glow effect.                                      |
| `hue`          | `number` | random  | Color hue 0–360.                                                      |
| `length`       | `number` | `6`     | Number of trail history positions. Longer = more visible tail.        |
| `speed`        | `number` | `1`     | Starting speed in pixels/tick.                                        |
| `width`        | `number` | `2`     | Stroke width at the head in pixels.                                   |

---

## `SparklerParticle`

A glowing spark with a circular trail. The individual particle used by `Sparklers`.

### Constructor

```typescript
new SparklerParticle(
    position
:
Point,
    velocity
:
Point,
    color
:
[number, number, number],
    config ? : SparklerParticleConfig
)
```

| Parameter  | Type                                                | Description                                         |
|------------|-----------------------------------------------------|-----------------------------------------------------|
| `position` | `Point`                                             | Starting position in pixels.                        |
| `velocity` | `Point`                                             | Initial velocity `{ x: vx, y: vy }` in pixels/tick. |
| `color`    | `[number, number, number]`                          | RGB color tuple, values 0–255.                      |
| `config`   | [`SparklerParticleConfig`](#sparklerparticleconfig) | Optional physics settings.                          |

### Properties

| Property   | Type      | Description                  |
|------------|-----------|------------------------------|
| `isDead`   | `boolean` | `true` when fully faded out. |
| `position` | `Point`   | Current pixel position.      |

### Methods

#### `tick(dt?: number): void`

Advances physics by `dt` frames (default `1`). Applies friction, gravity, and trail.

#### `draw(ctx): void`

Renders the trail circles and main spark circle. Use `ctx.globalCompositeOperation = 'lighter'` for additive glow.

---

## `SparklerParticleConfig`

```typescript
interface SparklerParticleConfig {
    decay?: number;
    friction?: number;
    gravity?: number;
    scale?: number;
    size?: number;
    trailLength?: number;
}
```

| Property      | Type     | Default          | Description                          |
|---------------|----------|------------------|--------------------------------------|
| `decay`       | `number` | random 0.02–0.05 | Alpha decrease per tick.             |
| `friction`    | `number` | `0.96`           | Velocity multiplier per tick.        |
| `gravity`     | `number` | `0.8`            | Pixels added to Y velocity per tick. |
| `scale`       | `number` | `1`              | Size and gravity multiplier.         |
| `size`        | `number` | random 1–3       | Base radius in pixels.               |
| `trailLength` | `number` | `3`              | Number of trail positions.           |

---

## `ConfettiParticle`

A single confetti piece with physics (velocity, gravity, swing, rotation, flip) and one of 11 shapes.

### Constructor

```typescript
new ConfettiParticle(
    position
:
Point,
    direction
:
number,
    shape
:
ConfettiShape,
    color
:
string,
    config ? : ConfettiParticleConfig
)
```

| Parameter   | Type                                                | Description                                                 |
|-------------|-----------------------------------------------------|-------------------------------------------------------------|
| `position`  | `Point`                                             | Starting position in pixels.                                |
| `direction` | `number`                                            | Launch angle in degrees. `90` = straight up, `0` = right.   |
| `shape`     | [`ConfettiShape`](#confettishape)                   | Visual shape to render.                                     |
| `color`     | `string`                                            | Any CSS color string (`'#ff4466'`, `'rgb(255,0,0)'`, etc.). |
| `config`    | [`ConfettiParticleConfig`](#confettiparticleconfig) | Optional physics settings.                                  |

### Properties

| Property   | Type      | Description                                                   |
|------------|-----------|---------------------------------------------------------------|
| `isDead`   | `boolean` | `true` when the particle has lived its full `ticks` lifetime. |
| `position` | `Point`   | Current pixel position.                                       |

### Methods

#### `tick(dt?: number): void`

Advances all physics by `dt` frames (default `1`). Updates velocity, swing, rotation, and flip.

#### `draw(ctx): void`

Renders the shape at the current position with transform and alpha. Saves and restores context state.

---

## `ConfettiParticleConfig`

```typescript
interface ConfettiParticleConfig {
    decay?: number;
    gravity?: number;
    scale?: number;
    spread?: number;
    startVelocity?: number;
    ticks?: number;
}
```

| Property        | Type     | Default | Description                                                   |
|-----------------|----------|---------|---------------------------------------------------------------|
| `decay`         | `number` | `0.9`   | Velocity multiplier per tick. Lower = faster deceleration.    |
| `gravity`       | `number` | `1`     | Downward acceleration.                                        |
| `scale`         | `number` | `1`     | Multiplies `startVelocity`, `gravity`, and particle size.     |
| `spread`        | `number` | `45`    | Random angular spread in degrees around the launch direction. |
| `startVelocity` | `number` | `45`    | Initial speed in pixels/tick.                                 |
| `ticks`         | `number` | `200`   | Lifetime in frames before `isDead` becomes `true`.            |

---

## `ConfettiShape`

```typescript
type ConfettiShape =
    | 'bowtie' | 'circle' | 'crescent' | 'diamond' | 'heart'
    | 'hexagon' | 'ribbon' | 'ring' | 'square' | 'star' | 'triangle';
```

---

## `SHAPE_PATHS`

All 11 confetti shapes as normalized `Path2D` objects. Coordinates span roughly `[-1, 1]` — apply `setTransform` to scale, rotate, and position them.

```typescript
const SHAPE_PATHS: Record<ConfettiShape, Path2D>
```

```typescript
import { SHAPE_PATHS } from '@basmilius/sparkle';

ctx.save();
ctx.setTransform(size, 0, 0, size, x, y);
ctx.fillStyle = color;
ctx.fill(SHAPE_PATHS['star']);
ctx.restore();
```

---

## `BalloonParticle`

A floating balloon with gradient body, gloss highlight, knot, and swaying string. Rises upward until `isDone`.

### Constructor

```typescript
new BalloonParticle(position
:
Point, color
:
[number, number, number], config ? : BalloonParticleConfig
)
```

| Parameter  | Type                                              | Description                               |
|------------|---------------------------------------------------|-------------------------------------------|
| `position` | `Point`                                           | Starting position in pixels.              |
| `color`    | `[number, number, number]`                        | RGB color tuple, values 0–255.            |
| `config`   | [`BalloonParticleConfig`](#balloonparticleconfig) | Optional appearance and physics settings. |

### Properties

| Property   | Type      | Description                                         |
|------------|-----------|-----------------------------------------------------|
| `isDone`   | `boolean` | `true` when the balloon has risen above the canvas. |
| `position` | `Point`   | Current pixel position.                             |

### Methods

#### `tick(dt?: number): void`

Advances physics: rises, drifts, and rotates.

#### `draw(ctx): void`

Renders the full balloon — gradient body, gloss, knot, and animated string.

---

## `BalloonParticleConfig`

```typescript
interface BalloonParticleConfig {
    driftAmp?: number;
    driftFreq?: number;
    driftPhase?: number;
    radiusX?: number;
    radiusY?: number;
    riseSpeed?: number;
    rotationSpeed?: number;
    scale?: number;
    stringLength?: number;
}
```

| Property        | Type     | Default              | Description                          |
|-----------------|----------|----------------------|--------------------------------------|
| `driftAmp`      | `number` | random 0.3–1         | Max horizontal drift in pixels/tick. |
| `driftFreq`     | `number` | random 0.5–1.5       | Drift oscillation frequency.         |
| `driftPhase`    | `number` | random               | Starting phase of the drift sine.    |
| `radiusX`       | `number` | random 25–45 × scale | Horizontal radius in pixels.         |
| `radiusY`       | `number` | radiusX / 0.85       | Vertical radius in pixels.           |
| `riseSpeed`     | `number` | random 0.5–1.3       | Pixels per tick upward.              |
| `rotationSpeed` | `number` | random 0.5–2         | Rotation oscillation speed.          |
| `scale`         | `number` | `1`                  | Multiplies all size values.          |
| `stringLength`  | `number` | random 30–70 × scale | String length in pixels.             |

---

## `RaindropParticle`

A line-rendered raindrop that moves along its velocity vector. `isDead` when it reaches `groundY`.

### Constructor

```typescript
new RaindropParticle(position
:
Point, velocity
:
Point, color
:
[number, number, number], config ? : RaindropParticleConfig
)
```

| Parameter  | Type                                                | Description                                 |
|------------|-----------------------------------------------------|---------------------------------------------|
| `position` | `Point`                                             | Starting position in pixels.                |
| `velocity` | `Point`                                             | Velocity `{ x: vx, y: vy }` in pixels/tick. |
| `color`    | `[number, number, number]`                          | RGB color tuple, values 0–255.              |
| `config`   | [`RaindropParticleConfig`](#raindropparticleconfig) | Optional physics settings.                  |

### Properties

| Property   | Type      | Description                          |
|------------|-----------|--------------------------------------|
| `isDead`   | `boolean` | `true` when `position.y >= groundY`. |
| `position` | `Point`   | Current pixel position.              |

### Methods

#### `tick(dt?: number): void`

Moves the drop along its velocity.

#### `draw(ctx): void`

Renders a short line along the velocity direction with depth-based opacity and width.

---

## `RaindropParticleConfig`

```typescript
interface RaindropParticleConfig {
    depth?: number;
    groundY?: number;
    length?: number;
    scale?: number;
}
```

| Property  | Type     | Default             | Description                                                   |
|-----------|----------|---------------------|---------------------------------------------------------------|
| `depth`   | `number` | random 0.3–1        | Affects opacity and line width. `1` = full, `0.3` = dim/thin. |
| `groundY` | `number` | `Infinity`          | Y position (pixels) at which `isDead` becomes `true`.         |
| `length`  | `number` | random 8–23 × scale | Tail length in pixels.                                        |
| `scale`   | `number` | `1`                 | Size multiplier.                                              |

---

## `SplashParticle`

A small circular particle that arcs upward and fades out. Spawned when a raindrop lands.

### Constructor

```typescript
new SplashParticle(position
:
Point, velocity
:
Point, color
:
[number, number, number], config ? : SplashParticleConfig
)
```

### Static methods

#### `SplashParticle.burst(position, color, config?): SplashParticle[]`

Creates 2–4 splash particles at the given position with randomized upward velocities.

### Properties

| Property   | Type      | Description                  |
|------------|-----------|------------------------------|
| `isDead`   | `boolean` | `true` when fully faded out. |
| `position` | `Point`   | Current pixel position.      |

### Methods

#### `tick(dt?: number): void`

Applies gravity and moves the particle. Decrements alpha.

#### `draw(ctx): void`

Renders a small circle.

---

## `SplashParticleConfig`

```typescript
interface SplashParticleConfig {
    gravity?: number;
    scale?: number;
    size?: number;
}
```

| Property  | Type     | Default    | Description                     |
|-----------|----------|------------|---------------------------------|
| `gravity` | `number` | `0.15`     | Downward acceleration per tick. |
| `scale`   | `number` | `1`        | Size multiplier.                |
| `size`    | `number` | random 1–3 | Radius in pixels.               |

---

## `FireflyParticle`

A softly pulsing glow dot with organic Lissajous-pattern drift. Wraps around canvas edges. Requires a pre-created sprite from `createFireflySprite()`.

### Constructor

```typescript
new FireflyParticle(x
:
number, y
:
number, bounds
:
{
    width: number;
    height: number
}
,
sprite: HTMLCanvasElement, config ? : FireflyParticleConfig
)
```

| Parameter | Type                                              | Description                               |
|-----------|---------------------------------------------------|-------------------------------------------|
| `x`       | `number`                                          | Starting X position in pixels.            |
| `y`       | `number`                                          | Starting Y position in pixels.            |
| `bounds`  | `{ width, height }`                               | Canvas dimensions for wrap-around.        |
| `sprite`  | `HTMLCanvasElement`                               | Glow sprite from `createFireflySprite()`. |
| `config`  | [`FireflyParticleConfig`](#fireflyparticleconfig) | Optional settings.                        |

### Properties

| Property   | Type       | Description             |
|------------|------------|-------------------------|
| `position` | `{ x, y }` | Current pixel position. |

### Methods

#### `tick(dt?: number): void`

Advances the Lissajous drift and wraps around bounds.

#### `draw(ctx): void`

Draws the pulsing glow sprite. Does not set composite operation — set `ctx.globalCompositeOperation = 'lighter'` before calling.

---

## `FireflyParticleConfig`

```typescript
interface FireflyParticleConfig {
    glowSpeed?: number;
    scale?: number;
    size?: number;
    speed?: number;
}
```

| Property    | Type     | Default      | Description                |
|-------------|----------|--------------|----------------------------|
| `glowSpeed` | `number` | random 0.5–2 | Pulsing speed multiplier.  |
| `scale`     | `number` | `1`          | Multiplied into `size`.    |
| `size`      | `number` | `6` × scale  | Display radius in pixels.  |
| `speed`     | `number` | `1`          | Movement speed multiplier. |

---

## `createFireflySprite`

Creates a radial-gradient glow canvas for use with `FireflyParticle`. Create once per color and reuse across many particles.

```typescript
function createFireflySprite(color: string, size?: number): HTMLCanvasElement
```

| Parameter | Type     | Default | Description                                             |
|-----------|----------|---------|---------------------------------------------------------|
| `color`   | `string` | —       | Any CSS color string (`'#b4ff6a'`, `'rgb(...)'`, etc.). |
| `size`    | `number` | `64`    | Canvas size in pixels.                                  |

---

## `ShootingStarSystem`

A self-contained system that spawns and animates shooting stars at random intervals. Already standalone — no extraction needed.

```typescript
import { ShootingStarSystem } from '@basmilius/sparkle';

const system = new ShootingStarSystem(
    {interval: [60, 180], color: [200, 230, 255]},
    Math.random  // or any () => number RNG
);

// In your loop:
system.tick(dt, canvas.width, canvas.height);
system.draw(ctx);
```

See `ShootingStarSystemConfig` for the full list of options.

---

## `Explosion`

A single firework burst particle. See [Fireworks API](/api/fireworks) for `FireworkVariant` details.

### Constructor

```typescript
new Explosion(
    position
:
Point,
    hue
:
number,
    lineWidth
:
number,
    type
:
ExplosionType,
    scale ? : number,
    angle ? : number,
    speed ? : number,
    vz ? : number
)
```

| Parameter   | Type                              | Default              | Description                                           |
|-------------|-----------------------------------|----------------------|-------------------------------------------------------|
| `position`  | `Point`                           | —                    | Starting position in pixels.                          |
| `hue`       | `number`                          | —                    | Base hue 0–360. Varied by `hueVariation` from config. |
| `lineWidth` | `number`                          | —                    | Stroke width before config scale is applied.          |
| `type`      | [`ExplosionType`](#explosiontype) | —                    | Determines physics and visual config.                 |
| `scale`     | `number`                          | `1`                  | Multiplies speed and vz.                              |
| `angle`     | `number`                          | random               | Launch angle in radians.                              |
| `speed`     | `number`                          | random               | Initial speed in pixels/tick.                         |
| `vz`        | `number`                          | random if `spread3d` | Depth velocity for 3D perspective.                    |

### Properties

| Property   | Type            | Description                                    |
|------------|-----------------|------------------------------------------------|
| `angle`    | `number`        | Launch angle in radians.                       |
| `hue`      | `number`        | Actual hue after variation.                    |
| `isDead`   | `boolean`       | `true` when fully faded out.                   |
| `position` | `Point`         | Current position (mutable, updated each tick). |
| `type`     | `ExplosionType` | The type this particle was created with.       |

### Methods

#### `tick(): void`

Advances physics by one frame.

#### `draw(ctx): void`

Renders the trail and head shape.

#### `checkSplit(): boolean`

Returns `true` once when a `crossette` particle's alpha drops below `0.5`.

#### `checkCrackle(): boolean`

Returns `true` once when a `crackle` particle is nearly dead.

---

## `Firework`

A rising projectile. Travels from start to target, dispatches `'remove'` on arrival.

### Constructor

```typescript
new Firework(start
:
Point, target
:
Point, hue
:
number, tailWidth
:
number, baseSize
:
number
)
```

### Properties

| Property   | Type     | Description             |
|------------|----------|-------------------------|
| `hue`      | `number` | Trail hue.              |
| `position` | `Point`  | Current pixel position. |

### Methods

#### `tick(): void`

Advances movement. Dispatches `'remove'` at target.

#### `draw(ctx): void`

Renders trail and glowing head.

#### `collectSparks(): Spark[]`

Returns and clears sparks emitted this frame.

### Events

| Event      | When            |
|------------|-----------------|
| `'remove'` | Target reached. |

---

## `Spark`

A tiny physics particle used for trail sparks and crackle effects.

### Constructor

```typescript
new Spark(position
:
Point, hue
:
number, velocityX ? : number, velocityY ? : number
)
```

### Properties

| Property   | Type      | Description                  |
|------------|-----------|------------------------------|
| `isDead`   | `boolean` | `true` when fully faded out. |
| `position` | `Point`   | Current pixel position.      |

### Methods

#### `tick(): void`

Applies friction, gravity, moves spark, decrements alpha.

#### `draw(ctx): void`

Renders a small circle.

---

## `EXPLOSION_CONFIGS`

```typescript
const EXPLOSION_CONFIGS: Record<ExplosionType, ExplosionConfig>
```

Config map for all 14 base explosion types. Use to read particle counts and speed ranges when spawning manually.

---

## `ExplosionType`

```typescript
type ExplosionType =
    | 'peony' | 'chrysanthemum' | 'willow' | 'ring'
    | 'palm' | 'crackle' | 'crossette' | 'dahlia'
    | 'brocade' | 'horsetail' | 'strobe' | 'heart'
    | 'spiral' | 'flower';
```
