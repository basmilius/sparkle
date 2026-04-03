export interface OrbitsConfig {
    readonly centers?: number;
    readonly orbitersPerCenter?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly trailLength?: number;
    readonly showCenters?: boolean;
    readonly scale?: number;
}

export type OrbitalCenter = {
    x: number;
    y: number;
};

export type Orbiter = {
    centerIndex: number;
    angle: number;
    angularSpeed: number;
    radiusX: number;
    radiusY: number;
    tilt: number;
    size: number;
    color: string;
    trail: { x: number; y: number }[];
};
