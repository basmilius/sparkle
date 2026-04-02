export type FallingGlitter = {
    x: number;
    y: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    flipAngle: number;
    flipSpeed: number;
    sparkle: number;
    colorIndex: number;
    settled: boolean;
};

export type SettledGlitter = {
    x: number;
    y: number;
    size: number;
    rotation: number;
    sparklePhase: number;
    sparkleSpeed: number;
    colorIndex: number;
};
