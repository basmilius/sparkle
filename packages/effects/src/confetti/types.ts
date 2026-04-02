export type Config = {
    readonly angle: number;
    readonly colors: string[];
    readonly decay: number;
    readonly gravity: number;
    readonly particles: number;
    readonly shapes: Shape[];
    readonly spread: number;
    readonly ticks: number;
    readonly startVelocity: number;
    readonly x: number;
    readonly y: number;
};

export type Particle = {
    colorStr: string;
    decay: number;
    flipAngle: number;
    flipSpeed: number;
    gravity: number;
    rotAngle: number;
    rotCos: number;
    rotSin: number;
    rotSpeed: number;
    shape: Shape;
    size: number;
    swing: number;
    swingAmp: number;
    swingSpeed: number;
    tick: number;
    totalTicks: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
};

export type ParticleConfig = {
    readonly angle: number;
    readonly color: RGB;
    readonly decay: number;
    readonly gravity: number;
    readonly shape: Shape;
    readonly spread: number;
    readonly startVelocity: number;
    readonly ticks: number;
    readonly x: number;
    readonly y: number;
};

export type RGB = [r: number, g: number, b: number];

export type Shape = 'circle' | 'diamond' | 'ribbon' | 'square' | 'star' | 'triangle';
