export interface HologramConfig {
    readonly speed?: number;
    readonly scanlineSpacing?: number;
    readonly flickerIntensity?: number;
    readonly dataFragments?: number;
    readonly color?: string;
    readonly scale?: number;
}

export type HologramFragment = {
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
    speed: number;
    text: string;
    life: number;
    maxLife: number;
};
