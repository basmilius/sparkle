/**
 * Applies a rotate-and-translate transform that is composed with the
 * current {@link base} matrix. Optionally scales the x and y axes
 * independently (e.g. for flip animations).
 *
 * This replaces the repeated manual 2×2 matrix multiplication that
 * appeared in many draw() methods.
 */
export function setRotatedTransform(
    ctx: CanvasRenderingContext2D,
    base: DOMMatrix,
    x: number,
    y: number,
    angle: number,
    scaleX: number = 1,
    scaleY: number = 1
): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const a = cos * scaleX;
    const b = sin * scaleX;
    const c = -sin * scaleY;
    const d = cos * scaleY;

    ctx.setTransform(
        base.a * a + base.c * b,
        base.b * a + base.d * b,
        base.a * c + base.c * d,
        base.b * c + base.d * d,
        base.a * x + base.c * y + base.e,
        base.b * x + base.d * y + base.f
    );
}
