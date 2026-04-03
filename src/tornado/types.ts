export type TornadoParticle = {
    angle: number;
    height: number;
    radiusOffset: number;
    speed: number;
    size: number;
    opacity: number;
    layer: number;
};

export type TornadoDebris = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    life: number;
    maxLife: number;
};
