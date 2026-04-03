export type EdgeFadeSide = number | [number, number];

export type EdgeFade = {
    readonly top?: EdgeFadeSide;
    readonly bottom?: EdgeFadeSide;
    readonly left?: EdgeFadeSide;
    readonly right?: EdgeFadeSide;
};

/**
 * Internal interface implemented by all Effect subclasses. Used by SimulationCanvas
 * and Scene to drive rendering without depending on the generic Effect<TConfig> type.
 */
export interface SimulationLayer {
    fade: EdgeFade | null;

    tick(dt: number, width: number, height: number): void;

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;

    onResize(width: number, height: number): void;

    onMount(canvas: HTMLCanvasElement): void;

    onUnmount(canvas: HTMLCanvasElement): void;
}
