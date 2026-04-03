export type ExplosionType = 'peony' | 'chrysanthemum' | 'willow' | 'ring' | 'palm' | 'crackle' | 'crossette' | 'dahlia' | 'brocade' | 'horsetail' | 'strobe' | 'heart' | 'spiral' | 'flower';

export type FireworkVariant = ExplosionType | 'saturn' | 'concentric';

export type ParticleShape = 'line' | 'circle' | 'star' | 'diamond';

export interface ExplosionConfig {
    readonly particleCount: [number, number];
    readonly speed: [number, number];
    readonly friction: number;
    readonly gravity: number;
    readonly decay: [number, number];
    readonly trailMemory: number;
    readonly hueVariation: number;
    readonly brightness: [number, number];
    readonly lineWidthScale: number;
    readonly shape: ParticleShape;
    readonly sparkle: boolean;
    readonly strobe: boolean;
    readonly spread3d: boolean;
    readonly glowSize: number;
}

export interface FireworkSimulationConfig {
    readonly scale?: number;
    readonly autoSpawn?: boolean;
    readonly variants?: FireworkVariant[];
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

export const FIREWORK_VARIANTS: FireworkVariant[] = [
    'peony', 'chrysanthemum', 'willow', 'ring', 'palm', 'crackle', 'crossette',
    'saturn', 'dahlia', 'brocade', 'horsetail', 'strobe', 'heart', 'spiral', 'flower', 'concentric'
];

export const EXPLOSION_CONFIGS: Record<ExplosionType, ExplosionConfig> = {
    peony: {
        particleCount: [50, 70],
        speed: [2, 10],
        friction: 0.96,
        gravity: 0.8,
        decay: [0.012, 0.025],
        trailMemory: 3,
        hueVariation: 30,
        brightness: [50, 80],
        lineWidthScale: 0.8,
        shape: 'circle',
        sparkle: false,
        strobe: false,
        spread3d: true,
        glowSize: 12
    },
    chrysanthemum: {
        particleCount: [80, 120],
        speed: [3, 12],
        friction: 0.975,
        gravity: 0.5,
        decay: [0.006, 0.012],
        trailMemory: 6,
        hueVariation: 20,
        brightness: [55, 85],
        lineWidthScale: 0.5,
        shape: 'line',
        sparkle: true,
        strobe: false,
        spread3d: true,
        glowSize: 15
    },
    willow: {
        particleCount: [50, 70],
        speed: [3, 10],
        friction: 0.988,
        gravity: 1.5,
        decay: [0.004, 0.008],
        trailMemory: 10,
        hueVariation: 15,
        brightness: [60, 90],
        lineWidthScale: 0.4,
        shape: 'line',
        sparkle: false,
        strobe: false,
        spread3d: false,
        glowSize: 10
    },
    ring: {
        particleCount: [40, 60],
        speed: [6, 8],
        friction: 0.96,
        gravity: 0.4,
        decay: [0.012, 0.022],
        trailMemory: 4,
        hueVariation: 10,
        brightness: [55, 80],
        lineWidthScale: 0.7,
        shape: 'diamond',
        sparkle: false,
        strobe: false,
        spread3d: false,
        glowSize: 14
    },
    palm: {
        particleCount: [20, 30],
        speed: [5, 12],
        friction: 0.97,
        gravity: 1.2,
        decay: [0.006, 0.014],
        trailMemory: 6,
        hueVariation: 20,
        brightness: [55, 85],
        lineWidthScale: 0.6,
        shape: 'line',
        sparkle: false,
        strobe: false,
        spread3d: false,
        glowSize: 12
    },
    crackle: {
        particleCount: [40, 55],
        speed: [2, 8],
        friction: 0.955,
        gravity: 0.8,
        decay: [0.012, 0.025],
        trailMemory: 2,
        hueVariation: 25,
        brightness: [60, 90],
        lineWidthScale: 0.6,
        shape: 'star',
        sparkle: false,
        strobe: false,
        spread3d: true,
        glowSize: 8
    },
    crossette: {
        particleCount: [16, 20],
        speed: [5, 9],
        friction: 0.965,
        gravity: 0.6,
        decay: [0.006, 0.014],
        trailMemory: 4,
        hueVariation: 15,
        brightness: [55, 85],
        lineWidthScale: 0.7,
        shape: 'circle',
        sparkle: false,
        strobe: false,
        spread3d: true,
        glowSize: 12
    },
    dahlia: {
        particleCount: [48, 80],
        speed: [3, 9],
        friction: 0.965,
        gravity: 0.7,
        decay: [0.010, 0.020],
        trailMemory: 4,
        hueVariation: 5,
        brightness: [55, 85],
        lineWidthScale: 0.7,
        shape: 'circle',
        sparkle: false,
        strobe: false,
        spread3d: true,
        glowSize: 12
    },
    brocade: {
        particleCount: [60, 80],
        speed: [3, 9],
        friction: 0.98,
        gravity: 1.3,
        decay: [0.004, 0.010],
        trailMemory: 10,
        hueVariation: 10,
        brightness: [60, 90],
        lineWidthScale: 0.4,
        shape: 'line',
        sparkle: true,
        strobe: false,
        spread3d: false,
        glowSize: 10
    },
    horsetail: {
        particleCount: [30, 40],
        speed: [8, 14],
        friction: 0.975,
        gravity: 2.0,
        decay: [0.004, 0.010],
        trailMemory: 12,
        hueVariation: 15,
        brightness: [60, 90],
        lineWidthScale: 0.5,
        shape: 'line',
        sparkle: false,
        strobe: false,
        spread3d: false,
        glowSize: 10
    },
    strobe: {
        particleCount: [40, 55],
        speed: [2, 8],
        friction: 0.96,
        gravity: 0.7,
        decay: [0.010, 0.020],
        trailMemory: 2,
        hueVariation: 10,
        brightness: [75, 95],
        lineWidthScale: 0.6,
        shape: 'circle',
        sparkle: false,
        strobe: true,
        spread3d: true,
        glowSize: 10
    },
    heart: {
        particleCount: [60, 80],
        speed: [3, 5],
        friction: 0.965,
        gravity: 0.3,
        decay: [0.008, 0.016],
        trailMemory: 4,
        hueVariation: 15,
        brightness: [55, 85],
        lineWidthScale: 0.7,
        shape: 'circle',
        sparkle: false,
        strobe: false,
        spread3d: false,
        glowSize: 12
    },
    spiral: {
        particleCount: [45, 60],
        speed: [2, 10],
        friction: 0.97,
        gravity: 0.4,
        decay: [0.008, 0.016],
        trailMemory: 5,
        hueVariation: 10,
        brightness: [55, 85],
        lineWidthScale: 0.6,
        shape: 'circle',
        sparkle: false,
        strobe: false,
        spread3d: false,
        glowSize: 12
    },
    flower: {
        particleCount: [70, 90],
        speed: [3, 7],
        friction: 0.965,
        gravity: 0.3,
        decay: [0.008, 0.016],
        trailMemory: 4,
        hueVariation: 20,
        brightness: [55, 85],
        lineWidthScale: 0.7,
        shape: 'circle',
        sparkle: false,
        strobe: false,
        spread3d: false,
        glowSize: 12
    }
};
