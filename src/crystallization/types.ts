export type CrystalBranch = {
    x: number;
    y: number;
    angle: number;
    length: number;
    targetLength: number;
    currentLength: number;
    depth: number;
    children: CrystalBranch[];
    width: number;
    growing: boolean;
    grown: boolean;
};

export type CrystalSeed = {
    x: number;
    y: number;
    branches: CrystalBranch[];
    sparklePhase: number;
    alpha: number;
    phase: number;
    holdTimer: number;
    delay: number;
    branchCount: number;
};
