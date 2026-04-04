import type { Point } from '../point';

export type SpirographCurve = {
    outerRadius: number;
    innerRadius: number;
    penOffset: number;
    phase: number;
    color: string;
    colorRGB: [number, number, number];
    points: Point[];
    pointHead: number;
    maxPoints: number;
    age: number;
    maxAge: number;
};
