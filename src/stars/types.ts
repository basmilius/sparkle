export type { ShootingStar } from '../shooting-stars/types';

export type StarMode = 'sky' | 'shooting' | 'both';

export type Star = {
    x: number;
    y: number;
    size: number;
    twinklePhase: number;
    twinkleSpeed: number;
    brightness: number;
};
