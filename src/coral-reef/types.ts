export type CoralAnemone = {
    x: number;
    baseY: number;
    segments: number;
    segmentLength: number;
    phase: number;
    speed: number;
    color: string;
    width: number;
};

export type CoralJellyfish = {
    x: number;
    y: number;
    size: number;
    phase: number;
    speed: number;
    tentacles: number;
    color: string;
    pulsePhase: number;
    drift: number;
};

export type CoralBubble = {
    x: number;
    y: number;
    size: number;
    speed: number;
    wobblePhase: number;
    opacity: number;
};
