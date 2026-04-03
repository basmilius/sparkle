export interface GlitchConfig {
    readonly intensity?: number;
    readonly speed?: number;
    readonly rgbSplit?: number;
    readonly scanlines?: boolean;
    readonly noiseBlocks?: boolean;
    readonly sliceDisplacement?: boolean;
    readonly color?: string;
    readonly scale?: number;
}

export type GlitchSlice = {
    y: number;
    height: number;
    offset: number;
    life: number;
    maxLife: number;
};

export type GlitchBlock = {
    x: number;
    y: number;
    width: number;
    height: number;
    life: number;
    maxLife: number;
    color: string;
};
