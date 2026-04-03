export interface LanternsConfig {
    readonly count?: number;
    readonly colors?: string[];
    readonly size?: number;
    readonly speed?: number;
    readonly scale?: number;
}

export type Lantern = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    glowPhase: number;
    glowSpeed: number;
    swayPhase: number;
    swaySpeed: number;
    swayAmplitude: number;
    colorIndex: number;
    opacity: number;
};
