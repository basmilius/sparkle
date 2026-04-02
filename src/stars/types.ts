export type StarMode = 'sky' | 'shooting' | 'both';

export type Star = {
    x: number;
    y: number;
    size: number;
    twinklePhase: number;
    twinkleSpeed: number;
    brightness: number;
};

export type ShootingStar = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    decay: number;
    trail: {x: number; y: number}[];
};
