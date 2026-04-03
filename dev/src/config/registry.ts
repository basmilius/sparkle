import { createAurora, createBalloons, createBlackHole, createBoids, createBubbles, createButterflies, createCaustics, createClouds, createConfetti, createConstellation, createCoralReef, createCrystallization, createDigitalRain, createDonuts, createFireflies, createFirepit, FIREWORK_VARIANTS, createFireworks, createGlitch, createGlitter, createGradientFlow, createHologram, createHyperSpace, createInterference, createKaleidoscope, createLanterns, createLava, createLeaves, createLightning, createMatrix, createMurmuration, createNebula, createNeon, createOrbits, createParticles, createPetals, createPlasma, createPollen, createPopcorn, createPortal, createPulseGrid, createRain, createRoots, createSandstorm, createSmoke, createSnow, createSparklers, createStars, createStreamers, createTopography, createTornado, createVoronoi, createVolcano, createWaves, createWormhole } from '@basmilius/sparkle';

import type { SimulatorDef } from './types';

export const SIMULATORS: SimulatorDef[] = [
    {
        id: 'aurora',
        name: 'Aurora',
        description: 'Northern lights bands flowing across the sky.',
        defaultConfig: {
            bands: 5,
            speed: 1,
            intensity: 0.8,
            waveAmplitude: 1,
            verticalPosition: 0.68
        },
        liveKeys: ['speed', 'intensity', 'waveAmplitude', 'verticalPosition'],
        schema: [
            {type: 'slider', key: 'bands', label: 'Bands', min: 2, max: 12, step: 1, default: 5},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'intensity', label: 'Intensity', min: 0.1, max: 1, step: 0.05, default: 0.8},
            {type: 'slider', key: 'waveAmplitude', label: 'Wave Amplitude', min: 0, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'verticalPosition', label: 'Vertical Position', min: 0.3, max: 0.9, step: 0.01, default: 0.68},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#9922ff', '#4455ff', '#0077ee', '#00aabb', '#22ddff']}
        ],
        create: (canvas, config) => {
            const sim = createAurora(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createAurora(config)
    },
    {
        id: 'balloons',
        name: 'Balloons',
        description: 'Rising balloons with strings and gentle sway.',
        defaultConfig: {
            count: 15,
            speed: 1,
            driftAmount: 1,
            stringLength: 1,
            scale: 1,
            sizeRange: [25, 45] as [number, number]
        },
        liveKeys: ['speed', 'driftAmount', 'stringLength'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 3, max: 50, step: 1, default: 15},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'driftAmount', label: 'Drift Amount', min: 0, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'stringLength', label: 'String Length', min: 0.1, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'range', key: 'sizeRange', label: 'Size Range', min: 10, max: 120, step: 5, default: [25, 45]},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#cc5de8']}
        ],
        create: (canvas, config) => {
            const sim = createBalloons(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createBalloons(config)
    },
    {
        id: 'bubbles',
        name: 'Bubbles',
        description: 'Rising soap bubbles with click-to-pop.',
        defaultConfig: {
            count: 30,
            speed: 1,
            popOnClick: true,
            wobbleAmount: 1,
            scale: 1,
            sizeRange: [10, 40] as [number, number],
            popRadius: 50
        },
        liveKeys: ['speed', 'wobbleAmount'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 5, max: 150, step: 5, default: 30},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'wobbleAmount', label: 'Wobble', min: 0, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'range', key: 'sizeRange', label: 'Size Range', min: 5, max: 150, step: 5, default: [10, 40]},
            {type: 'slider', key: 'popRadius', label: 'Pop Radius', min: 10, max: 200, step: 10, default: 50},
            {type: 'toggle', key: 'popOnClick', label: 'Pop on Click', default: true}
        ],
        create: (canvas, config) => {
            const sim = createBubbles(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createBubbles(config)
    },
    {
        id: 'confetti',
        name: 'Confetti',
        description: 'Click anywhere to fire a burst of confetti.',
        interactive: 'confetti',
        defaultConfig: {
            scale: 1,
            palette: 'vibrant',
            particles: 50,
            spread: 45,
            startVelocity: 45,
            decay: 0.9,
            gravity: 1,
            ticks: 200,
            shapes: ['bowtie', 'circle', 'crescent', 'diamond', 'heart', 'hexagon', 'ribbon', 'ring', 'square', 'star', 'triangle']
        },
        liveKeys: [],
        schema: [
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {
                type: 'select',
                key: 'palette',
                label: 'Palette',
                options: [
                    {value: 'classic', label: 'Classic'},
                    {value: 'pastel', label: 'Pastel'},
                    {value: 'vibrant', label: 'Vibrant'},
                    {value: 'warm', label: 'Warm'}
                ],
                default: 'vibrant'
            },
            {type: 'slider', key: 'particles', label: 'Particles', min: 10, max: 500, step: 10, default: 50},
            {type: 'slider', key: 'spread', label: 'Spread', min: 10, max: 180, step: 5, default: 45},
            {type: 'slider', key: 'startVelocity', label: 'Velocity', min: 10, max: 100, step: 5, default: 45},
            {type: 'slider', key: 'decay', label: 'Decay', min: 0.7, max: 0.99, step: 0.01, default: 0.9},
            {type: 'slider', key: 'gravity', label: 'Gravity', min: 0, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'ticks', label: 'Duration', min: 50, max: 600, step: 25, default: 200},
            {
                type: 'multiselect',
                key: 'shapes',
                label: 'Shapes',
                options: [
                    {value: 'bowtie', label: 'Bowtie'},
                    {value: 'circle', label: 'Circle'},
                    {value: 'crescent', label: 'Crescent'},
                    {value: 'diamond', label: 'Diamond'},
                    {value: 'heart', label: 'Heart'},
                    {value: 'hexagon', label: 'Hexagon'},
                    {value: 'ribbon', label: 'Ribbon'},
                    {value: 'ring', label: 'Ring'},
                    {value: 'square', label: 'Square'},
                    {value: 'star', label: 'Star'},
                    {value: 'triangle', label: 'Triangle'}
                ],
                default: ['bowtie', 'circle', 'crescent', 'diamond', 'heart', 'hexagon', 'ribbon', 'ring', 'square', 'star', 'triangle']
            }
        ],
        create: (canvas, config) => {
            const sim = createConfetti(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createConfetti(config)
    },
    {
        id: 'donuts',
        name: 'Donuts',
        description: 'Floating rings with physics and mouse avoidance.',
        defaultConfig: {
            count: 20,
            mouseAvoidance: true,
            mouseAvoidanceRadius: 120,
            mouseAvoidanceStrength: 0.5,
            repulsionStrength: 1,
            thickness: 0.18,
            scale: 1,
            radiusRange: [60, 90] as [number, number],
            speedRange: [0.15, 0.6] as [number, number]
        },
        liveKeys: ['mouseAvoidance', 'mouseAvoidanceRadius', 'mouseAvoidanceStrength', 'repulsionStrength'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 3, max: 60, step: 1, default: 20},
            {type: 'slider', key: 'thickness', label: 'Thickness', min: 0.05, max: 0.45, step: 0.01, default: 0.18},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'range', key: 'radiusRange', label: 'Radius Range', min: 20, max: 200, step: 5, default: [60, 90]},
            {type: 'range', key: 'speedRange', label: 'Speed Range', min: 0.05, max: 2, step: 0.05, default: [0.15, 0.6]},
            {type: 'slider', key: 'repulsionStrength', label: 'Repulsion', min: 0, max: 5, step: 0.1, default: 1},
            {type: 'toggle', key: 'mouseAvoidance', label: 'Mouse Avoidance', default: true},
            {type: 'slider', key: 'mouseAvoidanceRadius', label: 'Avoid Radius', min: 30, max: 300, step: 10, default: 120},
            {type: 'slider', key: 'mouseAvoidanceStrength', label: 'Avoid Strength', min: 0.1, max: 2, step: 0.1, default: 0.5},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b']}
        ],
        create: (canvas, config) => {
            const sim = createDonuts(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createDonuts(config)
    },
    {
        id: 'fireflies',
        name: 'Fireflies',
        description: 'Glowing pulsing dots with organic drift.',
        defaultConfig: {
            count: 60,
            speed: 1,
            glowSpeed: 1,
            color: '#aaff44',
            scale: 1,
            size: 6
        },
        liveKeys: ['speed', 'glowSpeed'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 5, max: 200, step: 5, default: 60},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'glowSpeed', label: 'Glow Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'size', label: 'Size', min: 2, max: 20, step: 1, default: 6},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#aaff44'}
        ],
        create: (canvas, config) => {
            const sim = createFireflies(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createFireflies(config)
    },
    {
        id: 'firepit',
        name: 'Firepit',
        description: 'Animated fire with embers and flame layers.',
        defaultConfig: {
            embers: 200,
            intensity: 1,
            flameWidth: 0.5,
            flameHeight: 0.5,
            scale: 1
        },
        liveKeys: ['intensity', 'flameWidth', 'flameHeight'],
        schema: [
            {type: 'slider', key: 'embers', label: 'Embers', min: 30, max: 600, step: 10, default: 200},
            {type: 'slider', key: 'intensity', label: 'Intensity', min: 0.1, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'flameWidth', label: 'Flame Width', min: 0.1, max: 1, step: 0.05, default: 0.5},
            {type: 'slider', key: 'flameHeight', label: 'Flame Height', min: 0.1, max: 1, step: 0.05, default: 0.5},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1}
        ],
        create: (canvas, config) => {
            const sim = createFirepit(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createFirepit(config)
    },
    {
        id: 'fireworks',
        name: 'Fireworks',
        description: 'Auto-playing fireworks show. Click to fire a custom variant.',
        interactive: 'fireworks',
        defaultConfig: {
            scale: 1,
            autoSpawn: true,
            variants: [...FIREWORK_VARIANTS]
        },
        liveKeys: ['scale', 'autoSpawn', 'variants'],
        schema: [
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'toggle', key: 'autoSpawn', label: 'Auto Spawn', default: true},
            {
                type: 'multiselect',
                key: 'variants',
                label: 'Auto Spawn Variants',
                options: FIREWORK_VARIANTS.map(v => ({value: v, label: v})),
                default: [...FIREWORK_VARIANTS]
            }
        ],
        create: (canvas, config) => {
            const sim = createFireworks(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createFireworks(config)
    },
    {
        id: 'glitter',
        name: 'Glitter',
        description: 'Falling sparkles that settle on the ground.',
        defaultConfig: {
            count: 150,
            speed: 2,
            groundLevel: 0.9,
            scale: 1,
            size: 4,
            maxSettled: 200
        },
        liveKeys: ['speed', 'groundLevel'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 20, max: 500, step: 10, default: 150},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.5, max: 8, step: 0.5, default: 2},
            {type: 'slider', key: 'groundLevel', label: 'Ground Level', min: 0.5, max: 1, step: 0.01, default: 0.9},
            {type: 'slider', key: 'size', label: 'Size', min: 1, max: 16, step: 1, default: 4},
            {type: 'slider', key: 'maxSettled', label: 'Max Settled', min: 50, max: 1000, step: 50, default: 200},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ffd700', '#ff69b4', '#00ffff', '#ff4500', '#9400d3']}
        ],
        create: (canvas, config) => {
            const sim = createGlitter(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createGlitter(config)
    },
    {
        id: 'lanterns',
        name: 'Lanterns',
        description: 'Floating sky lanterns with a warm glow.',
        defaultConfig: {
            count: 20,
            speed: 1,
            scale: 1,
            size: 20
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 3, max: 80, step: 1, default: 20},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'size', label: 'Size', min: 8, max: 60, step: 2, default: 20},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff8c00', '#ffb347', '#ffd700', '#ff6347']}
        ],
        create: (canvas, config) => {
            const sim = createLanterns(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createLanterns(config)
    },
    {
        id: 'leaves',
        name: 'Leaves',
        description: 'Autumn leaves falling with wind and spin.',
        defaultConfig: {
            count: 60,
            speed: 1,
            wind: 0.5,
            scale: 1,
            size: 22
        },
        liveKeys: ['speed', 'wind'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 10, max: 200, step: 5, default: 60},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.2, max: 6, step: 0.1, default: 1},
            {type: 'slider', key: 'wind', label: 'Wind', min: -3, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'size', label: 'Size', min: 8, max: 60, step: 2, default: 22},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#8b4513', '#d2691e', '#cd853f', '#daa520', '#b8860b']}
        ],
        create: (canvas, config) => {
            const sim = createLeaves(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createLeaves(config)
    },
    {
        id: 'lightning',
        name: 'Lightning',
        description: 'Electric bolts with branches and screen flash.',
        defaultConfig: {
            frequency: 1,
            color: '#b4c8ff',
            branches: true,
            flash: true,
            scale: 1
        },
        liveKeys: [],
        schema: [
            {type: 'slider', key: 'frequency', label: 'Frequency', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#b4c8ff'},
            {type: 'toggle', key: 'branches', label: 'Branches', default: true},
            {type: 'toggle', key: 'flash', label: 'Flash', default: true}
        ],
        create: (canvas, config) => {
            const sim = createLightning(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createLightning(config)
    },
    {
        id: 'matrix',
        name: 'Matrix',
        description: 'Falling character streams in Matrix style.',
        defaultConfig: {
            speed: 1.5,
            fontSize: 14,
            trailLength: 15,
            color: '#00ff41',
            scale: 1,
            columns: 40
        },
        liveKeys: ['speed', 'trailLength'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.3, max: 8, step: 0.1, default: 1.5},
            {type: 'slider', key: 'fontSize', label: 'Font Size', min: 8, max: 32, step: 1, default: 14},
            {type: 'slider', key: 'trailLength', label: 'Trail Length', min: 3, max: 40, step: 1, default: 15},
            {type: 'slider', key: 'columns', label: 'Columns', min: 10, max: 120, step: 5, default: 40},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#00ff41'}
        ],
        create: (canvas, config) => {
            const sim = createMatrix(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createMatrix(config)
    },
    {
        id: 'orbits',
        name: 'Orbits',
        description: 'Objects orbiting around center points with trails.',
        defaultConfig: {
            centers: 3,
            orbitersPerCenter: 4,
            speed: 1,
            trailLength: 20,
            showCenters: true,
            scale: 1
        },
        liveKeys: ['speed', 'trailLength', 'showCenters', 'scale'],
        schema: [
            {type: 'slider', key: 'centers', label: 'Centers', min: 1, max: 8, step: 1, default: 3},
            {type: 'slider', key: 'orbitersPerCenter', label: 'Orbiters per Center', min: 1, max: 12, step: 1, default: 4},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'trailLength', label: 'Trail Length', min: 0, max: 60, step: 1, default: 20},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'toggle', key: 'showCenters', label: 'Show Centers', default: true},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#4d96ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#cc5de8']}
        ],
        create: (canvas, config) => {
            const sim = createOrbits(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createOrbits(config)
    },
    {
        id: 'particles',
        name: 'Particles',
        description: 'Network of connected particles with mouse interaction.',
        defaultConfig: {
            count: 100,
            color: '#6366f1',
            lineColor: '#6366f1',
            connectionDistance: 120,
            mouseMode: 'connect',
            glow: false,
            particleForces: false,
            scale: 1,
            size: [1, 3] as [number, number],
            speed: [0.2, 0.8] as [number, number],
            lineWidth: 0.5,
            mouseRadius: 150,
            mouseStrength: 0.03
        },
        liveKeys: ['connectionDistance', 'lineWidth', 'mouseMode', 'mouseRadius', 'mouseStrength', 'particleForces', 'glow'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 10, max: 300, step: 10, default: 100},
            {type: 'slider', key: 'connectionDistance', label: 'Connection Distance', min: 50, max: 300, step: 10, default: 120},
            {type: 'range', key: 'size', label: 'Size Range', min: 0.5, max: 10, step: 0.5, default: [1, 3]},
            {type: 'range', key: 'speed', label: 'Speed Range', min: 0.1, max: 3, step: 0.1, default: [0.2, 0.8]},
            {type: 'slider', key: 'lineWidth', label: 'Line Width', min: 0.1, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'mouseRadius', label: 'Mouse Radius', min: 30, max: 300, step: 10, default: 150},
            {type: 'slider', key: 'mouseStrength', label: 'Mouse Strength', min: 0.01, max: 0.3, step: 0.01, default: 0.03},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {
                type: 'select',
                key: 'mouseMode',
                label: 'Mouse Mode',
                options: [
                    {value: 'none', label: 'None'},
                    {value: 'connect', label: 'Connect'},
                    {value: 'attract', label: 'Attract'},
                    {value: 'repel', label: 'Repel'}
                ],
                default: 'connect'
            },
            {type: 'color', key: 'color', label: 'Particle Color', default: '#6366f1'},
            {type: 'color', key: 'lineColor', label: 'Line Color', default: '#6366f1'},
            {type: 'toggle', key: 'glow', label: 'Glow', default: false},
            {type: 'toggle', key: 'particleForces', label: 'Particle Forces', default: false}
        ],
        create: (canvas, config) => {
            const sim = createParticles(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createParticles(config)
    },
    {
        id: 'petals',
        name: 'Petals',
        description: 'Cherry blossom petals drifting in the wind.',
        defaultConfig: {
            count: 80,
            speed: 1,
            wind: 0.5,
            scale: 1,
            size: 24
        },
        liveKeys: ['speed', 'wind'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 10, max: 200, step: 5, default: 80},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.2, max: 6, step: 0.1, default: 1},
            {type: 'slider', key: 'wind', label: 'Wind', min: -3, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'size', label: 'Size', min: 8, max: 60, step: 2, default: 24},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ffb7c5', '#ff9eb5', '#ffc8d8', '#ffafc0']}
        ],
        create: (canvas, config) => {
            const sim = createPetals(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createPetals(config)
    },
    {
        id: 'plasma',
        name: 'Plasma',
        description: 'Fluid, colorful plasma animation.',
        defaultConfig: {
            speed: 1,
            resolution: 3,
            scale: 1
        },
        liveKeys: ['speed', 'scale'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 8, step: 0.1, default: 1},
            {type: 'slider', key: 'resolution', label: 'Resolution', min: 1, max: 8, step: 1, default: 3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1}
        ],
        create: (canvas, config) => {
            const sim = createPlasma(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createPlasma(config)
    },
    {
        id: 'rain',
        name: 'Rain',
        description: 'Raindrops with splashes and wind.',
        defaultConfig: {
            variant: 'downpour',
            drops: 200,
            speed: 0.85,
            wind: 0.25,
            splashes: true,
            groundLevel: 1.0,
            color: '#aec2e0',
            scale: 1
        },
        liveKeys: ['speed', 'wind', 'splashes'],
        schema: [
            {
                type: 'select',
                key: 'variant',
                label: 'Variant',
                options: [
                    {value: 'drizzle', label: 'Drizzle'},
                    {value: 'downpour', label: 'Downpour'},
                    {value: 'thunderstorm', label: 'Thunderstorm'}
                ],
                default: 'downpour'
            },
            {type: 'slider', key: 'drops', label: 'Drops', min: 20, max: 600, step: 10, default: 200},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 3, step: 0.05, default: 0.85},
            {type: 'slider', key: 'wind', label: 'Wind', min: -1, max: 1, step: 0.05, default: 0.25},
            {type: 'slider', key: 'groundLevel', label: 'Ground Level', min: 0.5, max: 1, step: 0.01, default: 1.0},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Drop Color', default: '#aec2e0'},
            {type: 'toggle', key: 'splashes', label: 'Splashes', default: true}
        ],
        create: (canvas, config) => {
            const sim = createRain(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createRain(config)
    },
    {
        id: 'sandstorm',
        name: 'Sandstorm',
        description: 'Swirling sand particles and dust haze.',
        defaultConfig: {
            count: 300,
            wind: 2,
            turbulence: 1,
            hazeOpacity: 0.15,
            color: '#c2a060',
            scale: 1
        },
        liveKeys: ['wind', 'turbulence'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 50, max: 800, step: 25, default: 300},
            {type: 'slider', key: 'wind', label: 'Wind', min: 0.5, max: 8, step: 0.5, default: 2},
            {type: 'slider', key: 'turbulence', label: 'Turbulence', min: 0, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'hazeOpacity', label: 'Haze Opacity', min: 0, max: 1, step: 0.05, default: 0.15},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#c2a060'}
        ],
        create: (canvas, config) => {
            const sim = createSandstorm(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createSandstorm(config)
    },
    {
        id: 'snow',
        name: 'Snow',
        description: 'Continuous snowfall with wind gusts.',
        defaultConfig: {
            particles: 200,
            speed: 2,
            scale: 1,
            size: 9
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'particles', label: 'Particles', min: 20, max: 600, step: 20, default: 200},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.3, max: 8, step: 0.1, default: 2},
            {type: 'slider', key: 'size', label: 'Size', min: 2, max: 30, step: 1, default: 9},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'fillStyle', label: 'Color', default: '#ffffff'}
        ],
        create: (canvas, config) => {
            const sim = createSnow(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createSnow(config)
    },
    {
        id: 'sparklers',
        name: 'Sparklers',
        description: 'Spark emitter with trails. Hover to emit.',
        defaultConfig: {
            emitRate: 10,
            maxSparks: 300,
            trailLength: 10,
            hoverMode: true,
            gravity: 0.15,
            friction: 0.96,
            speed: [2, 8] as [number, number],
            scale: 1
        },
        liveKeys: ['emitRate', 'friction', 'gravity', 'trailLength', 'hoverMode', 'scale'],
        schema: [
            {type: 'slider', key: 'emitRate', label: 'Emit Rate', min: 1, max: 40, step: 1, default: 10},
            {type: 'slider', key: 'maxSparks', label: 'Max Sparks', min: 50, max: 1000, step: 50, default: 300},
            {type: 'slider', key: 'trailLength', label: 'Trail Length', min: 3, max: 40, step: 1, default: 10},
            {type: 'slider', key: 'gravity', label: 'Gravity', min: 0, max: 1, step: 0.05, default: 0.15},
            {type: 'slider', key: 'friction', label: 'Friction', min: 0.8, max: 0.999, step: 0.001, default: 0.96},
            {type: 'range', key: 'speed', label: 'Speed Range', min: 0.5, max: 20, step: 0.5, default: [2, 8]},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'toggle', key: 'hoverMode', label: 'Hover Mode', default: true},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#fff6a0', '#ffee44', '#ffcc00', '#ffaa00', '#ff8800']}
        ],
        create: (canvas, config) => {
            const sim = createSparklers(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createSparklers(config)
    },
    {
        id: 'stars',
        name: 'Stars',
        description: 'Twinkling star sky with optional shooting stars.',
        defaultConfig: {
            mode: 'both',
            starCount: 150,
            twinkleSpeed: 1,
            shootingSpeed: 1,
            trailLength: 15,
            color: '#ffffff',
            shootingColor: '#ffffff',
            scale: 1,
            shootingInterval: [120, 360] as [number, number]
        },
        liveKeys: ['twinkleSpeed', 'scale'],
        schema: [
            {
                type: 'select',
                key: 'mode',
                label: 'Mode',
                options: [
                    {value: 'sky', label: 'Sky only'},
                    {value: 'shooting', label: 'Shooting only'},
                    {value: 'both', label: 'Both'}
                ],
                default: 'both'
            },
            {type: 'slider', key: 'starCount', label: 'Star Count', min: 20, max: 500, step: 10, default: 150},
            {type: 'slider', key: 'twinkleSpeed', label: 'Twinkle Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'shootingSpeed', label: 'Shooting Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'trailLength', label: 'Trail Length', min: 3, max: 40, step: 1, default: 15},
            {type: 'range', key: 'shootingInterval', label: 'Shooting Interval (frames)', min: 30, max: 600, step: 10, default: [120, 360]},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Star Color', default: '#ffffff'},
            {type: 'color', key: 'shootingColor', label: 'Shooting Color', default: '#ffffff'}
        ],
        create: (canvas, config) => {
            const sim = createStars(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createStars(config)
    },
    {
        id: 'streamers',
        name: 'Streamers',
        description: 'Falling ribbons and paper streamers.',
        defaultConfig: {
            count: 30,
            speed: 1,
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 5, max: 100, step: 5, default: 30},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.2, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#cc5de8']}
        ],
        create: (canvas, config) => {
            const sim = createStreamers(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createStreamers(config)
    },
    {
        id: 'waves',
        name: 'Waves',
        description: 'Sinusoidal ocean waves with foam.',
        defaultConfig: {
            layers: 4,
            speed: 1,
            scale: 1,
            foamAmount: 0.4,
            foamColor: '#ffffff'
        },
        liveKeys: ['speed', 'foamAmount', 'scale'],
        schema: [
            {type: 'slider', key: 'layers', label: 'Layers', min: 1, max: 10, step: 1, default: 4},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 8, step: 0.1, default: 1},
            {type: 'slider', key: 'foamAmount', label: 'Foam Amount', min: 0, max: 2, step: 0.1, default: 0.4},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'foamColor', label: 'Foam Color', default: '#ffffff'},
            {type: 'colors', key: 'colors', label: 'Wave Colors', default: ['#1a6b9e', '#1e7fb8', '#2493d2', '#28a6e6']}
        ],
        create: (canvas, config) => {
            const sim = createWaves(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createWaves(config)
    },
    {
        id: 'boids',
        name: 'Boids',
        description: 'Classic flocking simulation with separation, alignment, and cohesion.',
        defaultConfig: {
            count: 80,
            speed: 1,
            separation: 1,
            alignment: 1,
            cohesion: 1,
            color: '#44aaff',
            size: 6,
            scale: 1
        },
        liveKeys: ['speed', 'separation', 'alignment', 'cohesion'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 10, max: 300, step: 10, default: 80},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'separation', label: 'Separation', min: 0, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'alignment', label: 'Alignment', min: 0, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'cohesion', label: 'Cohesion', min: 0, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'size', label: 'Size', min: 2, max: 20, step: 1, default: 6},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#44aaff'}
        ],
        create: (canvas, config) => {
            const sim = createBoids(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createBoids(config)
    },
    {
        id: 'butterflies',
        name: 'Butterflies',
        description: 'Colorful butterflies with flapping wings following organic flight paths.',
        defaultConfig: {
            count: 12,
            speed: 1,
            size: 20,
            scale: 1,
            colors: ['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#8ecae6', '#ffb7c5', '#c77dff', '#f8edeb']
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 1, max: 40, step: 1, default: 12},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'size', label: 'Wing Size', min: 8, max: 60, step: 2, default: 20},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#8ecae6', '#ffb7c5', '#c77dff', '#f8edeb']}
        ],
        create: (canvas, config) => {
            const sim = createButterflies(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createButterflies(config)
    },
    {
        id: 'black-hole',
        name: 'Black Hole',
        description: 'Particles spiral inward toward a central black hole, accelerating near the event horizon.',
        defaultConfig: {
            count: 300,
            speed: 1,
            color: '#6644ff',
            size: 2,
            scale: 1
        },
        liveKeys: ['speed', 'color'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 50, max: 800, step: 25, default: 300},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'size', label: 'Size', min: 0.5, max: 6, step: 0.5, default: 2},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#6644ff'}
        ],
        create: (canvas, config) => {
            const sim = createBlackHole(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createBlackHole(config)
    },
    {
        id: 'clouds',
        name: 'Clouds',
        description: 'Layered soft clouds slowly drifting with parallax depth.',
        defaultConfig: {
            count: 8,
            speed: 0.3,
            color: '#ffffff',
            opacity: 0.8,
            scale: 1
        },
        liveKeys: ['speed', 'opacity'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 2, max: 20, step: 1, default: 8},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.05, max: 2, step: 0.05, default: 0.3},
            {type: 'slider', key: 'opacity', label: 'Opacity', min: 0.1, max: 1, step: 0.05, default: 0.8},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#ffffff'}
        ],
        create: (canvas, config) => {
            const sim = createClouds(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createClouds(config)
    },
    {
        id: 'hyper-space',
        name: 'HyperSpace',
        description: 'Warp-speed hyperspace effect with stars stretching into radial motion-blur streaks.',
        defaultConfig: {
            count: 250,
            speed: 1,
            color: '#ffffff',
            scale: 1
        },
        liveKeys: ['speed', 'color'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 50, max: 600, step: 25, default: 250},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#ffffff'}
        ],
        create: (canvas, config) => {
            const sim = createHyperSpace(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createHyperSpace(config)
    },
    {
        id: 'lava',
        name: 'Lava',
        description: 'Lava lamp effect with soft glowing blobs blending with screen compositing.',
        defaultConfig: {
            count: 12,
            speed: 1,
            colors: ['#ff4400', '#ff8800', '#ffcc00', '#ff0066'],
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 1, max: 40, step: 1, default: 12},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff4400', '#ff8800', '#ffcc00', '#ff0066']}
        ],
        create: (canvas, config) => {
            const sim = createLava(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createLava(config)
    },
    {
        id: 'nebula',
        name: 'Nebula',
        description: 'Atmospheric space nebula with softly drifting color clouds and twinkling stars.',
        defaultConfig: {
            starCount: 150,
            speed: 0.3,
            colors: ['#ff6b9d', '#c44dff', '#4d79ff', '#00d4ff'],
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'starCount', label: 'Star Count', min: 10, max: 500, step: 10, default: 150},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 3, step: 0.1, default: 0.3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff6b9d', '#c44dff', '#4d79ff', '#00d4ff']}
        ],
        create: (canvas, config) => {
            const sim = createNebula(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createNebula(config)
    },
    {
        id: 'neon',
        name: 'Neon',
        description: 'Animated neon glow tubes — circles, waves, zig-zags — with flicker effects.',
        defaultConfig: {
            count: 8,
            speed: 1,
            colors: ['#ff0080', '#00ffff', '#ffff00', '#ff6600', '#aa00ff'],
            flicker: true,
            scale: 1
        },
        liveKeys: ['speed', 'flicker'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 1, max: 32, step: 1, default: 8},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'toggle', key: 'flicker', label: 'Flicker', default: true},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff0080', '#00ffff', '#ffff00', '#ff6600', '#aa00ff']}
        ],
        create: (canvas, config) => {
            const sim = createNeon(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createNeon(config)
    },
    {
        id: 'roots',
        name: 'Roots',
        description: 'Procedurally growing root systems rising from the bottom with organic bezier curves.',
        defaultConfig: {
            count: 5,
            speed: 1,
            color: '#4a3728',
            branchProbability: 0.3,
            maxSegments: 200,
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 1, max: 20, step: 1, default: 5},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'branchProbability', label: 'Branch Probability', min: 0, max: 1, step: 0.05, default: 0.3},
            {type: 'slider', key: 'maxSegments', label: 'Max Segments', min: 50, max: 500, step: 25, default: 200},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#4a3728'}
        ],
        create: (canvas, config) => {
            const sim = createRoots(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createRoots(config)
    },
    {
        id: 'smoke',
        name: 'Smoke',
        description: 'Soft rising smoke particles drifting upward with organic turbulence.',
        defaultConfig: {
            count: 40,
            speed: 1,
            color: '#888888',
            spread: 0.3,
            scale: 1
        },
        liveKeys: ['speed', 'spread'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 5, max: 120, step: 5, default: 40},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'spread', label: 'Spread', min: 0.05, max: 1, step: 0.05, default: 0.3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#888888'}
        ],
        create: (canvas, config) => {
            const sim = createSmoke(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createSmoke(config)
    },
    {
        id: 'wormhole',
        name: 'Wormhole',
        description: 'Swirling vortex of particles.',
        defaultConfig: {
            count: 300,
            speed: 1,
            direction: 'inward',
            color: '#a78bfa',
            scale: 1
        },
        liveKeys: ['speed', 'scale'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 50, max: 800, step: 25, default: 300},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 8, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {
                type: 'select',
                key: 'direction',
                label: 'Direction',
                options: [
                    {value: 'inward', label: 'Inward'},
                    {value: 'outward', label: 'Outward'}
                ],
                default: 'inward'
            },
            {type: 'color', key: 'color', label: 'Color', default: '#a78bfa'}
        ],
        create: (canvas, config) => {
            const sim = createWormhole(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createWormhole(config)
    },
    {
        id: 'tornado',
        name: 'Tornado',
        description: 'Spinning funnel vortex with flying debris particles.',
        defaultConfig: {
            speed: 1,
            debris: 150,
            width: 0.3,
            intensity: 1,
            color: '#8B7355',
            scale: 1
        },
        liveKeys: ['speed', 'intensity'],
        schema: [
            {type: 'slider', key: 'debris', label: 'Debris', min: 30, max: 400, step: 10, default: 150},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'intensity', label: 'Intensity', min: 0.1, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'width', label: 'Funnel Width', min: 0.1, max: 0.6, step: 0.05, default: 0.3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#8B7355'}
        ],
        create: (canvas, config) => {
            const sim = createTornado(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createTornado(config)
    },
    {
        id: 'volcano',
        name: 'Volcano',
        description: 'Erupting volcano with lava projectiles, embers, and smoke.',
        defaultConfig: {
            speed: 1,
            projectiles: 30,
            embers: 60,
            intensity: 1,
            color: '#ff4400',
            smokeColor: '#444444',
            scale: 1
        },
        liveKeys: ['speed', 'intensity'],
        schema: [
            {type: 'slider', key: 'projectiles', label: 'Projectiles', min: 5, max: 80, step: 5, default: 30},
            {type: 'slider', key: 'embers', label: 'Embers', min: 10, max: 200, step: 10, default: 60},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'intensity', label: 'Intensity', min: 0.1, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Lava Color', default: '#ff4400'},
            {type: 'color', key: 'smokeColor', label: 'Smoke Color', default: '#444444'}
        ],
        create: (canvas, config) => {
            const sim = createVolcano(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createVolcano(config)
    },
    {
        id: 'coral-reef',
        name: 'Coral Reef',
        description: 'Underwater scene with swaying anemones, jellyfish, and bubbles.',
        defaultConfig: {
            anemones: 8,
            jellyfish: 5,
            bubbles: 20,
            speed: 1,
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'anemones', label: 'Anemones', min: 2, max: 20, step: 1, default: 8},
            {type: 'slider', key: 'jellyfish', label: 'Jellyfish', min: 1, max: 15, step: 1, default: 5},
            {type: 'slider', key: 'bubbles', label: 'Bubbles', min: 5, max: 60, step: 5, default: 20},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff6b9d', '#c44dff', '#00d4aa', '#ff8c42', '#4dc9f6']}
        ],
        create: (canvas, config) => {
            const sim = createCoralReef(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createCoralReef(config)
    },
    {
        id: 'murmuration',
        name: 'Murmuration',
        description: 'Starling-like swarm forming organic flowing shapes.',
        defaultConfig: {
            count: 300,
            speed: 1,
            cohesion: 0.5,
            alignment: 0.8,
            separation: 0.4,
            turnRadius: 0.7,
            color: '#1a1a2e',
            scale: 1
        },
        liveKeys: ['speed', 'cohesion', 'alignment', 'separation'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 50, max: 800, step: 25, default: 300},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'cohesion', label: 'Cohesion', min: 0, max: 2, step: 0.1, default: 0.5},
            {type: 'slider', key: 'alignment', label: 'Alignment', min: 0, max: 2, step: 0.1, default: 0.8},
            {type: 'slider', key: 'separation', label: 'Separation', min: 0, max: 2, step: 0.1, default: 0.4},
            {type: 'slider', key: 'turnRadius', label: 'Turn Radius', min: 0.1, max: 2, step: 0.1, default: 0.7},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#1a1a2e'}
        ],
        create: (canvas, config) => {
            const sim = createMurmuration(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createMurmuration(config)
    },
    {
        id: 'crystallization',
        name: 'Crystallization',
        description: 'Ice crystals growing from seed points in fractal branching patterns.',
        defaultConfig: {
            seeds: 5,
            speed: 1,
            branchAngle: 60,
            maxDepth: 5,
            color: '#88ccff',
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'seeds', label: 'Seeds', min: 1, max: 12, step: 1, default: 5},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'branchAngle', label: 'Branch Angle', min: 20, max: 90, step: 5, default: 60},
            {type: 'slider', key: 'maxDepth', label: 'Max Depth', min: 2, max: 8, step: 1, default: 5},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#88ccff'}
        ],
        create: (canvas, config) => {
            const sim = createCrystallization(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createCrystallization(config)
    },
    {
        id: 'pollen',
        name: 'Pollen',
        description: 'Subtle floating pollen particles with warm sunlight glow.',
        defaultConfig: {
            count: 40,
            speed: 0.5,
            size: 3,
            color: '#fff8e1',
            glowSize: 2,
            wind: 0.3,
            scale: 1
        },
        liveKeys: ['speed', 'wind'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 10, max: 100, step: 5, default: 40},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'size', label: 'Size', min: 1, max: 8, step: 0.5, default: 3},
            {type: 'slider', key: 'glowSize', label: 'Glow Size', min: 1, max: 5, step: 0.5, default: 2},
            {type: 'slider', key: 'wind', label: 'Wind', min: -1, max: 1, step: 0.1, default: 0.3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#fff8e1'}
        ],
        create: (canvas, config) => {
            const sim = createPollen(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createPollen(config)
    },
    {
        id: 'glitch',
        name: 'Glitch',
        description: 'Digital glitch artifacts with RGB splits, scanlines, and noise blocks.',
        defaultConfig: {
            intensity: 0.5,
            speed: 1,
            rgbSplit: 3,
            scanlines: true,
            noiseBlocks: true,
            sliceDisplacement: true,
            color: '#00ff00',
            scale: 1
        },
        liveKeys: ['intensity', 'speed', 'rgbSplit'],
        schema: [
            {type: 'slider', key: 'intensity', label: 'Intensity', min: 0.1, max: 1, step: 0.05, default: 0.5},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'rgbSplit', label: 'RGB Split', min: 0, max: 20, step: 1, default: 3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'toggle', key: 'scanlines', label: 'Scanlines', default: true},
            {type: 'toggle', key: 'noiseBlocks', label: 'Noise Blocks', default: true},
            {type: 'toggle', key: 'sliceDisplacement', label: 'Slice Displacement', default: true},
            {type: 'color', key: 'color', label: 'Color', default: '#00ff00'}
        ],
        create: (canvas, config) => {
            const sim = createGlitch(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createGlitch(config)
    },
    {
        id: 'hologram',
        name: 'Hologram',
        description: 'Holographic projection with scanlines, flicker, and data fragments.',
        defaultConfig: {
            speed: 1,
            scanlineSpacing: 3,
            flickerIntensity: 0.3,
            dataFragments: 15,
            color: '#00ccff',
            scale: 1
        },
        liveKeys: ['speed', 'flickerIntensity'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scanlineSpacing', label: 'Scanline Spacing', min: 1, max: 10, step: 1, default: 3},
            {type: 'slider', key: 'flickerIntensity', label: 'Flicker', min: 0, max: 1, step: 0.05, default: 0.3},
            {type: 'slider', key: 'dataFragments', label: 'Data Fragments', min: 0, max: 40, step: 1, default: 15},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#00ccff'}
        ],
        create: (canvas, config) => {
            const sim = createHologram(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createHologram(config)
    },
    {
        id: 'portal',
        name: 'Portal',
        description: 'Spinning energy portal with spiraling particles.',
        defaultConfig: {
            speed: 1,
            particles: 100,
            size: 0.3,
            color: '#8844ff',
            secondaryColor: '#44aaff',
            direction: 'inward',
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'particles', label: 'Particles', min: 20, max: 300, step: 10, default: 100},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'size', label: 'Portal Size', min: 0.1, max: 0.6, step: 0.05, default: 0.3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {
                type: 'select',
                key: 'direction',
                label: 'Direction',
                options: [
                    {value: 'inward', label: 'Inward'},
                    {value: 'outward', label: 'Outward'}
                ],
                default: 'inward'
            },
            {type: 'color', key: 'color', label: 'Color', default: '#8844ff'},
            {type: 'color', key: 'secondaryColor', label: 'Secondary Color', default: '#44aaff'}
        ],
        create: (canvas, config) => {
            const sim = createPortal(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createPortal(config)
    },
    {
        id: 'digital-rain',
        name: 'Digital Rain',
        description: 'Falling binary/hex characters in columns.',
        defaultConfig: {
            speed: 1,
            fontSize: 14,
            columns: 0,
            mode: 'hex',
            color: '#00ffaa',
            trailLength: 20,
            scale: 1
        },
        liveKeys: ['speed', 'trailLength'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'fontSize', label: 'Font Size', min: 8, max: 32, step: 1, default: 14},
            {type: 'slider', key: 'columns', label: 'Columns (0=auto)', min: 0, max: 120, step: 5, default: 0},
            {type: 'slider', key: 'trailLength', label: 'Trail Length', min: 5, max: 40, step: 1, default: 20},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {
                type: 'select',
                key: 'mode',
                label: 'Mode',
                options: [
                    {value: 'binary', label: 'Binary'},
                    {value: 'hex', label: 'Hex'},
                    {value: 'mixed', label: 'Mixed'}
                ],
                default: 'hex'
            },
            {type: 'color', key: 'color', label: 'Color', default: '#00ffaa'}
        ],
        create: (canvas, config) => {
            const sim = createDigitalRain(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createDigitalRain(config)
    },
    {
        id: 'pulse-grid',
        name: 'Pulse Grid',
        description: 'Grid of dots lighting up in expanding wave patterns.',
        defaultConfig: {
            spacing: 30,
            speed: 1,
            color: '#4488ff',
            dotSize: 2,
            waveCount: 3,
            waveSpeed: 100,
            scale: 1
        },
        liveKeys: ['speed', 'waveSpeed'],
        schema: [
            {type: 'slider', key: 'spacing', label: 'Spacing', min: 15, max: 60, step: 5, default: 30},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'dotSize', label: 'Dot Size', min: 1, max: 6, step: 0.5, default: 2},
            {type: 'slider', key: 'waveCount', label: 'Wave Count', min: 1, max: 8, step: 1, default: 3},
            {type: 'slider', key: 'waveSpeed', label: 'Wave Speed', min: 30, max: 300, step: 10, default: 100},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#4488ff'}
        ],
        create: (canvas, config) => {
            const sim = createPulseGrid(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createPulseGrid(config)
    },
    {
        id: 'constellation',
        name: 'Constellation',
        description: 'Twinkling stars connected by constellation lines.',
        defaultConfig: {
            stars: 50,
            speed: 1,
            connectionDistance: 120,
            color: '#ffffff',
            lineWidth: 0.5,
            twinkleSpeed: 1,
            scale: 1
        },
        liveKeys: ['speed', 'twinkleSpeed', 'connectionDistance'],
        schema: [
            {type: 'slider', key: 'stars', label: 'Stars', min: 10, max: 150, step: 5, default: 50},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'connectionDistance', label: 'Connection Distance', min: 50, max: 250, step: 10, default: 120},
            {type: 'slider', key: 'lineWidth', label: 'Line Width', min: 0.1, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'twinkleSpeed', label: 'Twinkle Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#ffffff'}
        ],
        create: (canvas, config) => {
            const sim = createConstellation(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createConstellation(config)
    },
    {
        id: 'interference',
        name: 'Interference',
        description: 'Moiré interference patterns from overlapping wave sources.',
        defaultConfig: {
            speed: 1,
            scale: 1,
            resolution: 3,
            layers: 3
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'resolution', label: 'Resolution', min: 1, max: 8, step: 1, default: 3},
            {type: 'slider', key: 'layers', label: 'Layers', min: 2, max: 6, step: 1, default: 3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff0066', '#0066ff', '#00ff66']}
        ],
        create: (canvas, config) => {
            const sim = createInterference(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createInterference(config)
    },
    {
        id: 'popcorn',
        name: 'Popcorn',
        description: 'Popping kernels with bouncing physics.',
        defaultConfig: {
            count: 25,
            speed: 1,
            gravity: 1,
            bounciness: 0.6,
            color: '#fff8dc',
            popRate: 2,
            scale: 1
        },
        liveKeys: ['speed', 'gravity', 'popRate'],
        schema: [
            {type: 'slider', key: 'count', label: 'Count', min: 5, max: 60, step: 5, default: 25},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'gravity', label: 'Gravity', min: 0.1, max: 3, step: 0.1, default: 1},
            {type: 'slider', key: 'bounciness', label: 'Bounciness', min: 0.1, max: 0.95, step: 0.05, default: 0.6},
            {type: 'slider', key: 'popRate', label: 'Pop Rate', min: 0.5, max: 8, step: 0.5, default: 2},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#fff8dc'}
        ],
        create: (canvas, config) => {
            const sim = createPopcorn(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createPopcorn(config)
    },
    {
        id: 'kaleidoscope',
        name: 'Kaleidoscope',
        description: 'Symmetrically mirrored rotating patterns.',
        defaultConfig: {
            segments: 8,
            speed: 1,
            shapes: 15,
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'segments', label: 'Segments', min: 4, max: 16, step: 2, default: 8},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'shapes', label: 'Shapes', min: 3, max: 30, step: 1, default: 15},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff3366', '#33ccff', '#ffcc00', '#66ff66', '#cc66ff', '#ff9933']}
        ],
        create: (canvas, config) => {
            const sim = createKaleidoscope(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createKaleidoscope(config)
    },
    {
        id: 'caustics',
        name: 'Caustics',
        description: 'Swimming pool light refraction patterns.',
        defaultConfig: {
            speed: 1,
            scale: 1,
            resolution: 4,
            intensity: 0.7,
            color: '#4488cc'
        },
        liveKeys: ['speed', 'intensity'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, default: 1},
            {type: 'slider', key: 'resolution', label: 'Resolution', min: 1, max: 8, step: 1, default: 4},
            {type: 'slider', key: 'intensity', label: 'Intensity', min: 0.1, max: 1, step: 0.05, default: 0.7},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#4488cc'}
        ],
        create: (canvas, config) => {
            const sim = createCaustics(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createCaustics(config)
    },
    {
        id: 'gradient-flow',
        name: 'Gradient Flow',
        description: 'Smooth morphing color gradients with metaball blending.',
        defaultConfig: {
            speed: 0.5,
            scale: 1,
            blobs: 5,
            resolution: 6
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'blobs', label: 'Blobs', min: 2, max: 12, step: 1, default: 5},
            {type: 'slider', key: 'resolution', label: 'Resolution', min: 2, max: 10, step: 1, default: 6},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7']}
        ],
        create: (canvas, config) => {
            const sim = createGradientFlow(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createGradientFlow(config)
    },
    {
        id: 'topography',
        name: 'Topography',
        description: 'Animated contour lines like a topographic map.',
        defaultConfig: {
            speed: 0.5,
            scale: 1,
            resolution: 4,
            contourSpacing: 0.1,
            lineWidth: 1.5,
            color: '#2d5016'
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'resolution', label: 'Resolution', min: 1, max: 8, step: 1, default: 4},
            {type: 'slider', key: 'contourSpacing', label: 'Contour Spacing', min: 0.03, max: 0.3, step: 0.01, default: 0.1},
            {type: 'slider', key: 'lineWidth', label: 'Line Width', min: 0.5, max: 4, step: 0.5, default: 1.5},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'color', label: 'Color', default: '#2d5016'}
        ],
        create: (canvas, config) => {
            const sim = createTopography(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createTopography(config)
    },
    {
        id: 'voronoi',
        name: 'Voronoi',
        description: 'Animated Voronoi diagram with colorful cells and edges.',
        defaultConfig: {
            cells: 20,
            speed: 0.5,
            edgeColor: '#ffffff',
            edgeWidth: 2,
            resolution: 3,
            scale: 1
        },
        liveKeys: ['speed'],
        schema: [
            {type: 'slider', key: 'cells', label: 'Cells', min: 5, max: 50, step: 1, default: 20},
            {type: 'slider', key: 'speed', label: 'Speed', min: 0.1, max: 3, step: 0.1, default: 0.5},
            {type: 'slider', key: 'edgeWidth', label: 'Edge Width', min: 0, max: 6, step: 0.5, default: 2},
            {type: 'slider', key: 'resolution', label: 'Resolution', min: 1, max: 6, step: 1, default: 3},
            {type: 'slider', key: 'scale', label: 'Scale', min: 0.5, max: 3, step: 0.1, default: 1},
            {type: 'color', key: 'edgeColor', label: 'Edge Color', default: '#ffffff'},
            {type: 'colors', key: 'colors', label: 'Colors', default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#e17055']}
        ],
        create: (canvas, config) => {
            const sim = createVoronoi(config);
            sim.mount(canvas).start();
            return sim;
        },
        createLayer: (config) => createVoronoi(config)
    }
];

export const SIMULATOR_MAP = new Map<string, SimulatorDef>(
    SIMULATORS.map((sim) => [sim.id, sim])
);

export { FIREWORK_VARIANTS };
