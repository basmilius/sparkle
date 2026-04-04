# Sparkle (@basmilius/sparkle)

Canvas-based visual effects library for the web. Includes 54 visual effects ranging from nature simulations (rain, snow, leaves) to abstract visuals (plasma, voronoi, kaleidoscope) and playful animations (popcorn, balloons, confetti).

- **Docs:** https://sparkle.graphics
- **Repo:** https://github.com/basmilius/sparkle
- **License:** MIT

## Tech stack

- **Language:** TypeScript (strict: false, target: esnext, isolatedDeclarations: true)
- **Package manager:** Bun (`bun.lock`)
- **Build tool:** tsdown (single entry `src/index.ts` → `dist/index.mjs`)
- **Dev server:** Vite (root: `dev/`)
- **Docs:** VitePress with `vitepress-plugin-example` and `vitepress-plugin-render`
- **Deployment:** Cloudflare (docs), npm (package)
- **Node requirement:** >=23
- **Module format:** ESM only, no CommonJS

## Commands

| Command | Description |
|---------|-------------|
| `bun run build` | Build library with tsdown |
| `bun run dev` | Start Vite dev server (playground in `dev/`) |
| `bun run docs:dev` | Start VitePress docs dev server |
| `bun run docs:build` | Build VitePress documentation |

There is no test framework configured.

## Project structure

```
src/
  index.ts              # Barrel export for all modules
  canvas.ts             # LimitedFrameRateCanvas — internal render loop base
  effect.ts             # Effect<TConfig> — public abstract base class for all effects
  scene.ts              # Scene + createScene() — multi-layer compositor
  layer.ts              # SimulationLayer interface + EdgeFade types
  simulation-canvas.ts  # SimulationCanvas — internal single-effect canvas runner
  color.ts              # parseColor() utility
  trail.ts              # Trail utility
  fade.ts               # applyEdgeFade() utility
  point.ts              # Point type (x, y)
  distance.ts           # Euclidean distance utility
  aurora/               # Aurora — flowing northern lights bands
  balloons/             # Balloons — rising balloons with strings
  black-hole/           # BlackHole — gravitational vortex pulling particles inward
  boids/                # Boids — flocking simulation with separation/alignment/cohesion
  bubbles/              # Bubbles — rising soap bubbles with click-to-pop
  butterflies/          # Butterflies — fluttering butterflies with organic movement
  caustics/             # Caustics — underwater light refraction patterns
  clouds/               # Clouds — drifting cloud formations
  confetti/             # Confetti — on-demand particle bursts with .burst()
  constellation/        # Constellation — connected star network with twinkling
  coral-reef/           # CoralReef — underwater scene with anemones, jellyfish, bubbles
  crystallization/      # Crystallization — growing crystal branches from seed points
  digital-rain/         # DigitalRain — falling digital characters (Matrix-style variant)
  donuts/               # Donuts — floating rings with collision and mouse avoidance
  fireflies/            # Fireflies — glowing pulsing dots with organic drift
  firepit/              # Firepit — fire simulation with embers and flames
  fireworks/            # Fireworks — auto/manual firework launches (16+ variants)
  glitch/               # Glitch — digital glitch effect with RGB split and scanlines
  glitter/              # Glitter — sparkling particles that settle on a ground level
  gradient-flow/        # GradientFlow — flowing color gradient blobs
  hologram/             # Hologram — holographic display with scanlines and flicker
  hyper-space/          # HyperSpace — star streaks rushing past (hyperspace jump)
  interference/         # Interference — wave interference patterns
  kaleidoscope/         # Kaleidoscope — mirrored symmetrical rotating patterns
  lanterns/             # Lanterns — floating sky lanterns
  lava/                 # Lava — flowing lava blobs
  leaves/               # Leaves — falling autumn leaves with wind
  lightning/            # Lightning — lightning bolts with flash effect
  matrix/               # Matrix — falling code columns (Matrix-style)
  murmuration/          # Murmuration — starling flock murmuration with fluid motion
  nebula/               # Nebula — cosmic nebula with stars
  neon/                 # Neon — glowing neon light elements with flicker
  orbits/               # Orbits — particles orbiting center points with trails
  particles/            # Particles — network/plexus effect with mouse interaction
  petals/               # Petals — falling flower petals with wind
  plasma/               # Plasma — animated color plasma effect
  pollen/               # Pollen — drifting pollen particles with Brownian motion
  popcorn/              # Popcorn — popping and bouncing kernels
  portal/               # Portal — swirling portal vortex with particles
  pulse-grid/           # PulseGrid — dot grid with radiating pulse waves
  rain/                 # Rain — raindrops with splashes (drizzle/downpour/thunderstorm)
  roots/                # Roots — growing root/branch systems
  sandstorm/            # Sandstorm — blowing sand particles with haze
  shooting-stars/       # ShootingStarSystem — standalone shooting star utility (not Effect)
  smoke/                # Smoke — rising smoke plumes
  snow/                 # Snow — continuous snowfall
  sparklers/            # Sparklers — spark emitter with trails and hover mode
  stars/                # Stars — twinkling sky with optional shooting stars
  streamers/            # Streamers — party streamers floating down
  topography/           # Topography — animated contour map lines
  tornado/              # Tornado — spinning funnel with debris
  volcano/              # Volcano — erupting volcano with projectiles, embers, and smoke
  voronoi/              # Voronoi — animated Voronoi diagram with moving cells
  waves/                # Waves — layered animated ocean waves
  wormhole/             # Wormhole — particles rushing inward or outward from center
dev/                    # Vite playground with interactive demo
docs/                   # VitePress documentation site
  .vitepress/           # VitePress config and theme
  guide/                # Usage guides per effect
  api/                  # API reference per effect
  code/                 # Vue example components for docs
dist/                   # Build output (index.mjs + types)
```

## Architecture

### Effect<TConfig> base class

All effects extend **`Effect<TConfig>`** (`src/effect.ts`), which implements `SimulationLayer` and provides:

- `mount(canvas, options?)` — attach to a canvas element or CSS selector, starts standalone render loop
- `unmount()` — detach from canvas
- `start()` — start the render loop (call after `mount()`)
- `pause()` / `resume()` — pause and resume rendering
- `destroy()` — unmount and release all resources
- `configure(config)` — update config at runtime
- `withFade(fade)` — apply edge fade mask (`EdgeFade` with optional `top`, `right`, `bottom`, `left` values 0–1)
- Abstract: `tick(dt, width, height)` — physics update
- Abstract: `draw(ctx, width, height)` — rendering
- Optional overrides: `onResize()`, `onMount()`, `onUnmount()`

`LimitedFrameRateCanvas` (`src/canvas.ts`) is the internal canvas loop driver used by `SimulationCanvas` and `SceneCanvas`. It is **not** extended directly by effects.

### Scene compositor

`Scene` (`src/scene.ts`) composes multiple effects on one canvas:

```typescript
const scene = new Scene()
    .mount('#canvas')
    .layer(new Aurora())
    .layer(new Snow().withFade({ bottom: 0.3 }))
    .start();

scene.speed = 0.5;   // slow-motion all layers
scene.pause();
scene.resume();
scene.destroy();
```

Also exported: `createScene(canvas?, frameRate?, options?)` factory function.

### Effect module pattern

Each effect follows this file structure:

```
src/{effect}/
  index.ts        # Barrel: exports createXxx() factory + Config type
  layer.ts        # Main Effect class (e.g. class Snow extends Effect<SnowConfig>)
  consts.ts       # DEFAULT_CONFIG, constants, PRNG instance
  {entity}.ts     # Optional: particle/entity class (e.g. snowflake.ts)
```

The `index.ts` of each module exports:
- A `createXxx(config?)` factory function returning `Effect<XxxConfig>`
- The `XxxConfig` type (re-exported with `export type`)

The concrete class (e.g. `Snow`) is also importable from the barrel at `@basmilius/sparkle`.

### Key dependency

`@basmilius/utils` — provides `mulberry32` (seeded PRNG), `hexToRGB`, and other utilities. Each effect module creates its own PRNG instance via `mulberry32(seed)`.

## Public API

### Standalone usage

```typescript
import { Snow, Confetti, Fireworks } from '@basmilius/sparkle';

const snow = new Snow({ particles: 200, speed: 1.5 });
snow.mount('#canvas').start();

// Runtime config update
snow.configure({ speed: 2 });

// Pause/resume
snow.pause();
snow.resume();

// Cleanup
snow.destroy();
```

### Factory functions

Each effect also exports a `createXxx()` factory:

```typescript
import { createSnow, createConfetti } from '@basmilius/sparkle';

const snow = createSnow({ particles: 150 });
snow.mount(canvasEl).start();
```

### Scene composition

```typescript
import { Scene, Aurora, Stars, Snow } from '@basmilius/sparkle';

const scene = new Scene()
    .mount('#canvas')
    .layer(new Aurora({ bands: 4 }))
    .layer(new Stars({ mode: 'sky' }).withFade({ bottom: 0.4 }))
    .layer(new Snow())
    .start();
```

### EdgeFade

```typescript
import type { EdgeFade } from '@basmilius/sparkle';

effect.withFade({ top: 0.2, bottom: 0.3 }); // fade 20% from top, 30% from bottom
```

### Effect-specific methods

| Effect | Extra methods |
|--------|---------------|
| `Confetti` | `.burst(config?)` — trigger a one-off burst; `.hasParticles` getter |
| `Fireworks` | `.launch(variant, position?)` — launch a firework manually |
| `Sparklers` | `.moveTo(x, y)` — move spark emitter programmatically |

### ShootingStarSystem (standalone utility)

`ShootingStarSystem` is **not** an `Effect` — it is a standalone utility used inside the `Stars` effect. Export is available for advanced use.

### LimitedFrameRateCanvas (internal)

`LimitedFrameRateCanvas` is exported but intended for internal use. Use `Effect<T>` or `Scene` instead.

## All effects and their config

| Effect class | Config type | Notable config options |
|---|---|---|
| `Aurora` | `AuroraConfig` | `bands`, `speed`, `scale` |
| `Balloons` | `BalloonsConfig` | `count`, `colors`, `sizeRange`, `speed`, `driftAmount`, `stringLength`, `scale` |
| `BlackHole` | `BlackHoleConfig` | `count`, `speed`, `color`, `size`, `scale` |
| `Boids` | `BoidsConfig` | `count`, `speed`, `separation`, `alignment`, `cohesion`, `color`, `size`, `scale` |
| `Bubbles` | `BubblesConfig` | `count`, `sizeRange`, `speed`, `popOnClick`, `popRadius`, `colors`, `wobbleAmount`, `scale` |
| `Butterflies` | `ButterfliesConfig` | `colors`, `count`, `scale`, `size`, `speed` |
| `Caustics` | `CausticsConfig` | `speed`, `scale`, `resolution`, `intensity`, `color` |
| `Clouds` | `CloudsConfig` | `color`, `count`, `opacity`, `scale`, `speed` |
| `Confetti` | `ConfettiConfig` | `scale` |
| `Constellation` | `ConstellationConfig` | `stars`, `speed`, `connectionDistance`, `color`, `lineWidth`, `twinkleSpeed`, `scale` |
| `CoralReef` | `CoralReefConfig` | `anemones`, `jellyfish`, `bubbles`, `speed`, `colors`, `scale` |
| `Crystallization` | `CrystallizationConfig` | `seeds`, `speed`, `branchAngle`, `maxDepth`, `color`, `scale` |
| `DigitalRain` | `DigitalRainConfig` | `speed`, `fontSize`, `columns`, `mode`, `color`, `trailLength`, `scale` |
| `Donuts` | `DonutsConfig` | `count`, `colors`, `radiusRange`, `thickness`, `speedRange`, `rotationSpeedRange`, `repulsionStrength`, `mouseAvoidance`, `mouseAvoidanceRadius`, `mouseAvoidanceStrength`, `background`, `scale` |
| `Fireflies` | `FirefliesConfig` | `count`, `color`, `size`, `speed`, `glowSpeed`, `scale` |
| `Firepit` | `FirepitConfig` | `embers`, `flameWidth`, `flameHeight`, `intensity`, `scale` |
| `Fireworks` | `FireworksConfig` | `autoSpawn`, `variants`, `scale` |
| `Glitch` | `GlitchConfig` | `intensity`, `speed`, `rgbSplit`, `scanlines`, `noiseBlocks`, `sliceDisplacement`, `color`, `scale` |
| `Glitter` | `GlitterConfig` | `count`, `size`, `speed`, `groundLevel`, `maxSettled`, `colors`, `scale` |
| `GradientFlow` | `GradientFlowConfig` | `speed`, `scale`, `colors`, `blobs`, `resolution` |
| `Hologram` | `HologramConfig` | `speed`, `scanlineSpacing`, `flickerIntensity`, `dataFragments`, `color`, `scale` |
| `HyperSpace` | `HyperSpaceConfig` | `count`, `speed`, `color`, `scale` |
| `Interference` | `InterferenceConfig` | `speed`, `scale`, `resolution`, `layers`, `colors` |
| `Kaleidoscope` | `KaleidoscopeConfig` | `segments`, `speed`, `shapes`, `colors`, `scale` |
| `Lanterns` | `LanternsConfig` | `count`, `size`, `speed`, `colors`, `scale` |
| `Lava` | `LavaConfig` | `count`, `speed`, `colors`, `scale` |
| `Leaves` | `LeavesConfig` | `count`, `size`, `speed`, `wind`, `colors`, `scale` |
| `Lightning` | `LightningConfig` | `flash`, `color`, `frequency`, `branches`, `scale` |
| `Matrix` | `MatrixConfig` | `columns`, `speed`, `fontSize`, `trailLength`, `color`, `scale` |
| `Murmuration` | `MurmurationConfig` | `count`, `speed`, `cohesion`, `alignment`, `separation`, `turnRadius`, `color`, `scale` |
| `Nebula` | `NebulaConfig` | `starCount`, `speed`, `colors`, `scale` |
| `Neon` | `NeonConfig` | `count`, `speed`, `colors`, `flicker`, `scale` |
| `Orbits` | `OrbitsConfig` | `centers`, `orbitersPerCenter`, `speed`, `colors`, `trailLength`, `showCenters`, `scale` |
| `Particles` | `ParticlesConfig` | `count`, `color`, `lineColor`, `size`, `speed`, `connectionDistance`, `lineWidth`, `mouseMode` (`none`/`connect`/`attract`/`repel`), `mouseRadius`, `mouseStrength`, `particleForces`, `glow`, `background`, `scale` |
| `Petals` | `PetalsConfig` | `count`, `colors`, `size`, `speed`, `wind`, `scale` |
| `Plasma` | `PlasmaConfig` | `speed`, `resolution`, `palette`, `scale` |
| `Pollen` | `PollenConfig` | `count`, `speed`, `size`, `color`, `glowSize`, `wind`, `scale` |
| `Popcorn` | `PopcornConfig` | `count`, `speed`, `gravity`, `bounciness`, `color`, `popRate`, `scale` |
| `Portal` | `PortalConfig` | `speed`, `particles`, `size`, `color`, `secondaryColor`, `direction`, `scale` |
| `PulseGrid` | `PulseGridConfig` | `spacing`, `speed`, `color`, `dotSize`, `waveCount`, `waveSpeed`, `scale` |
| `Rain` | `RainConfig` | `variant` (`drizzle`/`downpour`/`thunderstorm`), `drops`, `wind`, `speed`, `splashes`, `color`, `groundLevel`, `scale` |
| `Roots` | `RootsConfig` | `count`, `speed`, `color`, `branchProbability`, `maxSegments`, `scale` |
| `Sandstorm` | `SandstormConfig` | `count`, `wind`, `turbulence`, `color`, `hazeOpacity`, `scale` |
| `Smoke` | `SmokeConfig` | `color`, `count`, `scale`, `speed`, `spread` |
| `Snow` | `SnowConfig` | `particles`, `size`, `speed`, `fillStyle`, `scale` |
| `Sparklers` | `SparklersConfig` | `emitRate`, `maxSparks`, `colors`, `speed`, `friction`, `gravity`, `decay`, `trailLength`, `hoverMode`, `scale` |
| `Stars` | `StarsConfig` | `mode` (`sky`/`shooting`/`both`), `starCount`, `shootingInterval`, `shootingSpeed`, `twinkleSpeed`, `color`, `shootingColor`, `trailLength`, `scale` |
| `Streamers` | `StreamersConfig` | `count`, `colors`, `speed`, `scale` |
| `Topography` | `TopographyConfig` | `speed`, `scale`, `resolution`, `contourSpacing`, `lineWidth`, `color` |
| `Tornado` | `TornadoConfig` | `speed`, `debris`, `width`, `intensity`, `color`, `scale` |
| `Volcano` | `VolcanoConfig` | `speed`, `projectiles`, `embers`, `intensity`, `color`, `smokeColor`, `scale` |
| `Voronoi` | `VoronoiConfig` | `cells`, `speed`, `colors`, `edgeColor`, `edgeWidth`, `scale` |
| `Waves` | `WavesConfig` | `layers`, `speed`, `colors`, `foamColor`, `foamAmount`, `scale` |
| `Wormhole` | `WormholeConfig` | `count`, `speed`, `color`, `direction` (`inward`/`outward`), `scale` |

## Code conventions

- **Private fields:** use `#` syntax (not `private` keyword)
- **Config objects:** always `readonly`, merged with `{ ...DEFAULT_CONFIG, ...config }`
- **Naming:** PascalCase classes, camelCase methods/properties, `Config` suffix for config types — no `Simulation` suffix on class names
- **Module main file:** `layer.ts` (not `simulation.ts`)
- **Factory exports:** each `index.ts` exports a `createXxx()` factory + re-exports the `XxxConfig` type
- **Array compaction:** in-place during tick loop (avoids `filter()` allocations)
- **Canvas rendering:** `setTransform()` over save/translate/rotate/restore pattern
- **Color space:** display-p3 by default
- **Pixel-based effects:** create entities in `onResize()` or after `start()`, not in the constructor — `this.width`/`this.height` are only correct after the first resize
- **Velocity-based rendering:** for moving particles, draw visual trails/lines along the actual velocity vector rather than using cosmetic offsets — keeps visual direction and movement in sync
- **Mouse interaction:** store bound listeners as `readonly` fields, add in `onMount()`, remove in `onUnmount()`
- **Exports:** barrel pattern per module, types exported with `export type`
- **No CommonJS:** ESM throughout (`"type": "module"`)

## CI/CD

- **publish.yml** — Publishes to npm on GitHub release (uses Bun + Node.js 24)
- **docs-pull-request.yml** — Deploys docs preview to Cloudflare on PR
- **docs-released.yml** — Deploys docs to Cloudflare on release

## Path alias

`@/*` maps to `src/*` in tsconfig. Vite and VitePress configs also alias `@basmilius/sparkle` to `src/index.ts` for local development.
