export type RootPoint = {
    x: number;
    y: number;
};

export type RootTip = {
    x: number;
    y: number;
    angle: number;
    depth: number;
    points: RootPoint[];
    alive: boolean;
    lineWidth: number;
    colorVariant: number;
};

export type RootSystem = {
    tips: RootTip[];
    allTips: RootTip[];
    segmentCount: number;
    phase: 'growing' | 'fading';
    opacity: number;
};
