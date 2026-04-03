export interface KaleidoscopeConfig {
    readonly segments?: number;
    readonly speed?: number;
    readonly shapes?: number;
    readonly colors?: string[];
    readonly scale?: number;
}

export type KaleidoscopeShape = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    type: number;
    rotation: number;
    rotationSpeed: number;
};
