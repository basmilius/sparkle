import type { Point } from '../point';

export type SparklerSpark = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: [number, number, number];
    size: number;
    decay: number;
    trail: Point[];
    trailHead: number;
    trailSize: number;
};
