export interface NebulaBlob {
    x: number;
    y: number;
    radius: number;
    driftSpeedX: number;
    driftSpeedY: number;
    driftOffsetX: number;
    driftOffsetY: number;
    colorIndex: number;
    opacity: number;
}

export interface NebulaStar {
    x: number;
    y: number;
    size: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    brightness: number;
}
