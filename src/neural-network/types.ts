export type ArmSegment = {
    toX: number;
    toY: number;
    cpX: number;
    cpY: number;
    thickness: number;
    children: ArmSegment[];
};

export type NeuronCell = {
    x: number;
    y: number;
    somaRadius: number;
    brightness: number;
    glowTimer: number;
    fireTimer: number;
    fireInterval: number;
    arms: ArmSegment[];
    connections: number[];
};

export type SynapticPulse = {
    toCell: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    cpX: number;
    cpY: number;
    t: number;
};
