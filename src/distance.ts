import type { Point } from './point';

export function distance(a: Point, b: Point): number {
    const x = a.x - b.x;
    const y = a.y - b.y;

    return Math.sqrt(x * x + y * y);
}

export function distanceBetween(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}
