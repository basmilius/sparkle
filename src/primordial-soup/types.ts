export type Cell = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: [number, number, number];
    energy: number;
    divideTimer: number;
};

export type FoodParticle = {
    x: number;
    y: number;
    radius: number;
    color: [number, number, number];
    opacity: number;
};

export type DividingCell = {
    x: number;
    y: number;
    radius: number;
    color: [number, number, number];
    angle: number;
    progress: number;
    energy: number;
};
