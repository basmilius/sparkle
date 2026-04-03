export type Streamer = {
    x: number;
    y: number;
    length: number;
    width: number;
    segments: { x: number; y: number }[];
    fallSpeed: number;
    swayPhase: number;
    swaySpeed: number;
    swayAmplitude: number;
    color: string;
    curl: number;
    depth: number;
};
