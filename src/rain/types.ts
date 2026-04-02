export type RainVariant = 'drizzle' | 'downpour' | 'thunderstorm';

export type Raindrop = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    length: number;
    speed: number;
    depth: number;
    opacity: number;
};

export type Splash = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    gravity: number;
};

export type Lightning = {
    segments: {x: number; y: number}[];
    alpha: number;
    lifetime: number;
    ticksAlive: number;
};
