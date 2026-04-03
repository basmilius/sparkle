export type EdgeFadeSide = number | [number, number];

export type EdgeFade = {
    readonly top?: EdgeFadeSide;
    readonly bottom?: EdgeFadeSide;
    readonly left?: EdgeFadeSide;
    readonly right?: EdgeFadeSide;
};

export abstract class SimulationLayer {
    fade: EdgeFade | null = null;

    abstract tick(dt: number, width: number, height: number): void;

    abstract draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;

    configure(_config: Record<string, unknown>): void {
    }

    onResize(_width: number, _height: number): void {
    }

    onMount(_canvas: HTMLCanvasElement): void {
    }

    onUnmount(_canvas: HTMLCanvasElement): void {
    }

    withFade(fade: EdgeFade): this {
        this.fade = fade;
        return this;
    }
}
