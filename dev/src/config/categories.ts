export interface Category {
    readonly label: string;
    readonly ids: string[];
}

export const CATEGORIES: Category[] = [
    {
        label: 'Celebration',
        ids: ['fireworks', 'confetti', 'balloons', 'streamers', 'glitter', 'lanterns', 'sparklers', 'popcorn']
    },
    {
        label: 'Nature',
        ids: ['snow', 'rain', 'aurora', 'leaves', 'petals', 'fireflies', 'bubbles', 'waves', 'lightning', 'sandstorm', 'smoke', 'butterflies', 'clouds', 'tornado', 'volcano', 'coral-reef', 'pollen', 'crystallization']
    },
    {
        label: 'Space',
        ids: ['nebula', 'black-hole', 'hyper-space', 'portal']
    },
    {
        label: 'Ambient',
        ids: ['stars', 'particles', 'firepit', 'plasma', 'orbits', 'lava', 'neon', 'pulse-grid', 'caustics', 'gradient-flow', 'interference', 'topography', 'voronoi', 'neural-network']
    },
    {
        label: 'Organic',
        ids: ['boids', 'roots', 'murmuration', 'primordial-soup']
    },
    {
        label: 'Stylized',
        ids: ['matrix', 'wormhole', 'donuts', 'glitch', 'hologram', 'digital-rain', 'kaleidoscope', 'blueprint']
    },
    {
        label: 'Abstract',
        ids: ['fluid', 'spirograph', 'sound-waves', 'magnetic-sand']
    }
];
