export type DigitalRainMode = 'binary' | 'hex' | 'mixed';

export type DigitalRainColumn = {
    x: number;
    y: number;
    speed: number;
    baseSpeed: number;
    speedPhase: number;
    chars: string[];
    length: number;
};
