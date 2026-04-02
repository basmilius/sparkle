export type ParticleMouseMode = 'attract' | 'repel' | 'connect' | 'none';

export type NetworkParticle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    baseSpeed: number;
};
