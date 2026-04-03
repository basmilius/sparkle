export type NeonTubeShape = 'circle' | 'wave' | 'zigzag' | 'curve';

export type NeonTube = {
    shape: NeonTubeShape;
    color: string;
    x: number;
    y: number;
    size: number;
    angle: number;
    rotationSpeed: number;
    phaseOffset: number;
    flickerAlpha: number;
    flickering: boolean;
    flickerTarget: number;
    flickerProgress: number;
    amplitude: number;
    frequency: number;
};
