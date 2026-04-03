import { SimulationCanvas } from './simulation-canvas';
import type { EdgeFade, EdgeFadeSide, SimulationLayer } from './layer';

export type { EdgeFade, EdgeFadeSide };

/**
 * Base class for all visual effects. Implements the internal SimulationLayer interface
 * so that effects can be used both standalone (via mount()) and composed in a Scene.
 *
 * @example Standalone usage
 * const snow = new Snow({ particles: 200 });
 * snow.mount(canvas).start();
 *
 * @example Scene composition
 * const scene = new Scene()
 *     .mount(canvas)
 *     .layer(new Aurora())
 *     .layer(new Snow())
 *     .start();
 */
export abstract class Effect<TConfig = Record<string, unknown>> implements SimulationLayer {
    #canvas: SimulationCanvas | null = null;
    fade: EdgeFade | null = null;

    abstract tick(dt: number, width: number, height: number): void;

    abstract draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;

    configure(_config: Partial<TConfig>): void {
    }

    onResize(_width: number, _height: number): void {
    }

    onMount(_canvas: HTMLCanvasElement): void {
    }

    onUnmount(_canvas: HTMLCanvasElement): void {
    }

    /**
     * Apply an edge fade mask when rendering this effect standalone or in a Scene.
     */
    withFade(fade: EdgeFade): this {
        this.fade = fade;
        return this;
    }

    /**
     * Mount this effect to a canvas element or CSS selector, creating the render loop.
     * Must be called before start().
     */
    mount(canvas: HTMLCanvasElement | string, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}): this {
        if (typeof canvas === 'string') {
            const el = document.querySelector<HTMLCanvasElement>(canvas);

            if (!el) {
                throw new Error(`Effect.mount(): no element found for selector "${canvas}".`);
            }

            canvas = el;
        }

        this.#canvas = new SimulationCanvas(canvas, this as unknown as SimulationLayer, 60, options);
        return this;
    }

    /**
     * Remove this effect from its canvas and clean up the render loop.
     */
    unmount(): this {
        this.#canvas?.destroy();
        this.#canvas = null;
        return this;
    }

    /**
     * Start the render loop. Call mount() first.
     */
    start(): this {
        this.#canvas?.start();
        return this;
    }

    /**
     * Pause rendering without destroying state. Use resume() to continue.
     */
    pause(): this {
        this.#canvas?.pause();
        return this;
    }

    /**
     * Resume rendering after a pause().
     */
    resume(): this {
        this.#canvas?.resume();
        return this;
    }

    /**
     * Stop rendering and call onUnmount(). Safe to call multiple times.
     */
    destroy(): void {
        this.unmount();
    }
}
