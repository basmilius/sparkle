# Sparkle (@basmilius/sparkle)

Canvas-based visual effects library for the web. Includes fireworks, confetti, snow, donuts, fireflies, rain, aurora, bubbles, sparklers, balloons, stars, and particles simulations.

- **Docs:** https://sparkle.graphics
- **Repo:** https://github.com/basmilius/sparkle
- **License:** MIT

## Tech stack

- **Language:** TypeScript (strict: false, target: esnext)
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
  canvas.ts             # LimitedFrameRateCanvas base class
  point.ts              # Point type (x, y)
  distance.ts           # Euclidean distance utility
  aurora/               # AuroraSimulation — flowing northern lights bands
  balloons/             # BalloonSimulation — rising balloons with strings
  bubbles/              # BubbleSimulation — rising soap bubbles with click-to-pop
  confetti/             # ConfettiSimulation — on-demand particle bursts
  donuts/               # DonutSimulation — floating rings with collision
  fireflies/            # FireflySimulation — glowing pulsing dots with organic drift
  fireworks/            # FireworkSimulation — auto-playing fireworks (16 variants)
  particles/            # ParticleSimulation — network/plexus effect with connections
  rain/                 # RainSimulation — raindrops with splashes and lightning
  snow/                 # SnowSimulation — continuous snowfall
  sparklers/            # SparklerSimulation — spark emitter with trails and hover mode
  stars/                # StarSimulation — twinkling sky with shooting stars
dev/                    # Vite playground with interactive demo
docs/                   # VitePress documentation site
  .vitepress/           # VitePress config and theme
  guide/                # Usage guides per effect
  api/                  # API reference per effect
  code/                 # Vue example components for docs
dist/                   # Build output (index.mjs + types)
```

## Architecture

All simulations extend **`LimitedFrameRateCanvas`** (`src/canvas.ts`), which provides:
- Canvas management and 2D rendering context
- Frame-rate limiting (60 FPS default)
- Tab visibility detection (auto-pause/resume)
- Window resize handling
- Delta time calculation for frame-independent physics
- Lifecycle: `start()`, `stop()`, `destroy()`
- Abstract methods: `draw()`, `tick()`

### Effect module pattern

Each effect follows a consistent structure:

```
src/{effect}/
  index.ts          # Barrel exports
  simulation.ts     # Main class extending LimitedFrameRateCanvas
  types.ts          # Type definitions and config interfaces
  consts.ts         # Constants, default config, RNG instance
  {helpers}.ts      # Optional: particle/entity classes
```

### Key dependency

`@basmilius/utils` — provides `mulberry32` (seeded PRNG), `hexToRGB`, and other utilities. Each effect module creates its own PRNG instance via `mulberry32(seed)`.

## Code conventions

- **Private fields:** use `#` syntax (not `private` keyword)
- **Config objects:** always `readonly`, merged with `{ ...DEFAULT_CONFIG, ...config }`
- **Naming:** PascalCase classes, camelCase methods/properties, `Config` suffix for config types, `Simulation` suffix for main classes
- **Array compaction:** in-place during tick loop (avoids `filter()` allocations)
- **Canvas rendering:** `setTransform()` over save/translate/rotate/restore pattern
- **Color space:** display-p3 by default
- **Pixel-based effects:** effects that use pixel coordinates (not normalized 0-1) must create entities in `start()` (after `super.start()` calls `onResize()`), not in the constructor — otherwise `this.width`/`this.height` are still the defaults
- **Velocity-based rendering:** for moving particles, draw visual trails/lines along the actual velocity vector rather than using cosmetic offsets — keeps visual direction and movement in sync
- **Mouse interaction:** follow donuts pattern — store bound listeners as readonly fields, add in constructor, remove in `destroy()` override before `super.destroy()`
- **Exports:** barrel pattern per module, types exported with `export type`
- **No CommonJS:** ESM throughout (`"type": "module"`)

## CI/CD

- **publish.yml** — Publishes to npm on GitHub release (uses Bun + Node.js 24)
- **docs-pull-request.yml** — Deploys docs preview to Cloudflare on PR
- **docs-released.yml** — Deploys docs to Cloudflare on release

## Path alias

`@/*` maps to `src/*` in tsconfig. Vite and VitePress configs also alias `@basmilius/sparkle` to `src/index.ts` for local development.
