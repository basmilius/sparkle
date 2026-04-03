export type VolcanoProjectile = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    type: 'lava' | 'ember' | 'smoke';
};
