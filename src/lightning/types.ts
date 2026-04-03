export type LightningBranch = {
    segments: {x: number; y: number}[];
    alpha: number;
};

export type LightningBolt = {
    segments: {x: number; y: number}[];
    branches: LightningBranch[];
    alpha: number;
    lifetime: number;
    ticksAlive: number;
};
