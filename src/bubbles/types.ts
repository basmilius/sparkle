export type Bubble = {
    x: number;
    y: number;
    radius: number;
    speed: number;
    hue: number;
    wobblePhase: number;
    wobbleFreq: number;
    wobbleAmp: number;
    opacity: number;
};

export type PopParticle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    decay: number;
};
