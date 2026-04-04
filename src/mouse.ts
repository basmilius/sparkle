/**
 * Lightweight helper that tracks the mouse position over a canvas
 * element. Shared by effects that respond to hover/movement.
 */
export class MouseTracker {
    x: number = -1;
    y: number = -1;
    onCanvas: boolean = false;

    readonly #onMove: (evt: MouseEvent) => void;
    readonly #onLeave: () => void;

    constructor() {
        this.#onMove = (evt: MouseEvent) => {
            const rect = (evt.currentTarget as HTMLCanvasElement).getBoundingClientRect();
            this.x = evt.clientX - rect.left;
            this.y = evt.clientY - rect.top;
            this.onCanvas = true;
        };
        this.#onLeave = () => {
            this.onCanvas = false;
        };
    }

    attach(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('mousemove', this.#onMove, {passive: true});
        canvas.addEventListener('mouseleave', this.#onLeave, {passive: true});
    }

    detach(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.#onMove);
        canvas.removeEventListener('mouseleave', this.#onLeave);
    }
}
