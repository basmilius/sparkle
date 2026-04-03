export type AuroraBand = {
    x: number;
    baseY: number;
    height: number;
    sigma: number;
    phase1: number;
    phase2: number;
    amplitude1: number;
    frequency1: number;
    speed: number;
    hue: number;
    opacity: number;
};

export type AuroraStar = {
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
    twinklePhase: number;
};

export type AuroraShootingStar = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    decay: number;
    trail: {x: number; y: number}[];
};
