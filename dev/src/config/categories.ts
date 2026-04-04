export interface Category {
    readonly label: string;
    readonly ids: string[];
}

export const CATEGORIES: Category[] = [
    {
        label: 'Celebration',
        ids: ['balloons', 'confetti', 'fireworks', 'glitter', 'lanterns', 'popcorn', 'sparklers', 'streamers']
    },
    {
        label: 'Weather',
        ids: ['aurora', 'clouds', 'lightning', 'rain', 'sandstorm', 'smoke', 'snow', 'tornado', 'volcano']
    },
    {
        label: 'Nature',
        ids: ['boids', 'butterflies', 'coral-reef', 'crystallization', 'fireflies', 'leaves', 'murmuration', 'petals', 'pollen', 'roots']
    },
    {
        label: 'Space',
        ids: ['black-hole', 'hyper-space', 'nebula', 'orbits', 'portal', 'stars', 'wormhole']
    },
    {
        label: 'Fluid & Fire',
        ids: ['bubbles', 'caustics', 'firepit', 'fluid', 'lava', 'waves']
    },
    {
        label: 'Digital',
        ids: ['blueprint', 'digital-rain', 'glitch', 'hologram', 'matrix', 'neural-network', 'neon']
    },
    {
        label: 'Simulation',
        ids: ['interference', 'magnetic-sand', 'particles', 'primordial-soup', 'pulse-grid', 'sound-waves']
    },
    {
        label: 'Abstract',
        ids: ['donuts', 'gradient-flow', 'kaleidoscope', 'plasma', 'spirograph', 'topography', 'voronoi']
    }
];
