export interface MatrixConfig {
    readonly columns?: number;
    readonly speed?: number;
    readonly color?: string;
    readonly fontSize?: number;
    readonly trailLength?: number;
    readonly scale?: number;
}

export type MatrixColumn = {
    x: number;
    y: number;
    speed: number;
    baseSpeed: number;
    speedPhase: number;
    chars: string[];
    length: number;
    headBrightness: number;
};
