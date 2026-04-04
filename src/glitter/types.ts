export interface GlitterConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly groundLevel?: number;
    readonly maxSettled?: number;
    readonly scale?: number;
}

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
