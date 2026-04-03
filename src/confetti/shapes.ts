import type { Shape } from './types';

const TWO_PI = Math.PI * 2;

export const SHAPE_PATHS: Record<Shape, Path2D> = {
    bowtie: (() => {
        const path = new Path2D();
        path.moveTo(-1, -0.7);
        path.lineTo(0, 0);
        path.lineTo(-1, 0.7);
        path.closePath();
        path.moveTo(1, -0.7);
        path.lineTo(0, 0);
        path.lineTo(1, 0.7);
        path.closePath();
        return path;
    })(),
    circle: (() => {
        const path = new Path2D();
        path.ellipse(0, 0, 0.6, 1, 0, 0, TWO_PI);
        return path;
    })(),
    crescent: (() => {
        const path = new Path2D();
        path.arc(0, 0, 1, 0, TWO_PI, false);
        path.arc(0.45, 0, 0.9, 0, TWO_PI, true);
        return path;
    })(),
    diamond: (() => {
        const path = new Path2D();
        path.moveTo(0, -1);
        path.lineTo(0.6, 0);
        path.lineTo(0, 1);
        path.lineTo(-0.6, 0);
        path.closePath();
        return path;
    })(),
    heart: (() => {
        const path = new Path2D();
        path.moveTo(0, 1);
        path.bezierCurveTo(-0.4, 0.55, -1, 0.1, -1, -0.35);
        path.bezierCurveTo(-1, -0.8, -0.5, -1, 0, -0.6);
        path.bezierCurveTo(0.5, -1, 1, -0.8, 1, -0.35);
        path.bezierCurveTo(1, 0.1, 0.4, 0.55, 0, 1);
        path.closePath();
        return path;
    })(),
    hexagon: (() => {
        const path = new Path2D();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI / 3) - Math.PI / 2;
            if (i === 0) {
                path.moveTo(Math.cos(angle), Math.sin(angle));
            } else {
                path.lineTo(Math.cos(angle), Math.sin(angle));
            }
        }
        path.closePath();
        return path;
    })(),
    ribbon: (() => {
        const path = new Path2D();
        path.rect(-0.2, -1, 0.4, 2);
        return path;
    })(),
    ring: (() => {
        const path = new Path2D();
        path.arc(0, 0, 1, 0, TWO_PI, false);
        path.arc(0, 0, 0.55, 0, TWO_PI, true);
        return path;
    })(),
    square: (() => {
        const path = new Path2D();
        path.rect(-0.7, -0.7, 1.4, 1.4);
        return path;
    })(),
    star: (() => {
        const path = new Path2D();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? 1 : 0.42;
            const angle = (i * Math.PI / 5) - Math.PI / 2;
            if (i === 0) {
                path.moveTo(r * Math.cos(angle), r * Math.sin(angle));
            } else {
                path.lineTo(r * Math.cos(angle), r * Math.sin(angle));
            }
        }
        path.closePath();
        return path;
    })(),
    triangle: (() => {
        const path = new Path2D();
        for (let i = 0; i < 3; i++) {
            const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
            if (i === 0) {
                path.moveTo(Math.cos(angle), Math.sin(angle));
            } else {
                path.lineTo(Math.cos(angle), Math.sin(angle));
            }
        }
        path.closePath();
        return path;
    })()
};
