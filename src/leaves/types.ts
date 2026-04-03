export interface LeavesConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly wind?: number;
    readonly scale?: number;
}

export type Leaf = {
    x: number;
    y: number;
    size: number;
    depth: number;
    rotation: number;
    rotationSpeed: number;
    flipAngle: number;
    flipSpeed: number;
    swingAmplitude: number;
    swingFrequency: number;
    swingOffset: number;
    fallSpeed: number;
    shape: number;
    colorIndex: number;
};
