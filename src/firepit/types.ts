export type Ember = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    brightness: number;
    flicker: number;
    sprite: HTMLCanvasElement;
};

export type FlameLayer = {
    x: number;
    phase: number;
    speed: number;
    amplitude: number;
    width: number;
    height: number;
};
