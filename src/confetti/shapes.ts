import type { Shape } from './types';

const TWO_PI = Math.PI * 2;

function buildShapePaths(): Record<Shape, Path2D> {
    const bowtie = new Path2D();
    bowtie.moveTo(-1, -0.7);
    bowtie.lineTo(0, 0);
    bowtie.lineTo(-1, 0.7);
    bowtie.closePath();
    bowtie.moveTo(1, -0.7);
    bowtie.lineTo(0, 0);
    bowtie.lineTo(1, 0.7);
    bowtie.closePath();

    const circle = new Path2D();
    circle.ellipse(0, 0, 0.6, 1, 0, 0, TWO_PI);

    const crescent = new Path2D();
    crescent.arc(0, 0, 1, 0, TWO_PI, false);
    crescent.arc(0.45, 0, 0.9, 0, TWO_PI, true);

    const diamond = new Path2D();
    diamond.moveTo(0, -1);
    diamond.lineTo(0.6, 0);
    diamond.lineTo(0, 1);
    diamond.lineTo(-0.6, 0);
    diamond.closePath();

    const heart = new Path2D();
    heart.moveTo(0, 1);
    heart.bezierCurveTo(-0.4, 0.55, -1, 0.1, -1, -0.35);
    heart.bezierCurveTo(-1, -0.8, -0.5, -1, 0, -0.6);
    heart.bezierCurveTo(0.5, -1, 1, -0.8, 1, -0.35);
    heart.bezierCurveTo(1, 0.1, 0.4, 0.55, 0, 1);
    heart.closePath();

    const hexagon = new Path2D();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 2;
        if (i === 0) {
            hexagon.moveTo(Math.cos(angle), Math.sin(angle));
        } else {
            hexagon.lineTo(Math.cos(angle), Math.sin(angle));
        }
    }
    hexagon.closePath();

    const ribbon = new Path2D();
    ribbon.rect(-0.2, -1, 0.4, 2);

    const ring = new Path2D();
    ring.arc(0, 0, 1, 0, TWO_PI, false);
    ring.arc(0, 0, 0.55, 0, TWO_PI, true);

    const square = new Path2D();
    square.rect(-0.7, -0.7, 1.4, 1.4);

    const star = new Path2D();
    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 1 : 0.42;
        const angle = (i * Math.PI / 5) - Math.PI / 2;
        if (i === 0) {
            star.moveTo(r * Math.cos(angle), r * Math.sin(angle));
        } else {
            star.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
    }
    star.closePath();

    const triangle = new Path2D();
    for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
        if (i === 0) {
            triangle.moveTo(Math.cos(angle), Math.sin(angle));
        } else {
            triangle.lineTo(Math.cos(angle), Math.sin(angle));
        }
    }
    triangle.closePath();

    return {bowtie, circle, crescent, diamond, heart, hexagon, ribbon, ring, square, star, triangle};
}

let _shapePaths: Record<Shape, Path2D> | null = null;

export const SHAPE_PATHS: Record<Shape, Path2D> = new Proxy({} as Record<Shape, Path2D>, {
    get(_, key: string) {
        return (_shapePaths ??= buildShapePaths())[key as Shape];
    }
});
