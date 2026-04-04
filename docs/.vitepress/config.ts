import { resolve } from 'path';
import { DefaultTheme, defineConfig, UserConfig } from 'vitepress';
import examplePlugin from 'vitepress-plugin-example';
import renderPlugin from 'vitepress-plugin-render';

export default defineConfig({
    title: 'Sparkle',
    description: 'Canvas-based visual effects library for the web.',
    vite: {
        resolve: {
            alias: {
                '@basmilius/sparkle': resolve(__dirname, '../../src/index.ts')
            }
        },
        ssr: {
            external: ['@vue/devtools-kit', '@vue/devtools-api']
        }
    },
    markdown: {
        config(md) {
            md.use(examplePlugin);
            md.use(renderPlugin);
        }
    },
    themeConfig: {
        logo: '/logo.svg',

        nav: [
            {text: 'Home', link: '/'},
            {text: 'Guide', link: '/guide/getting-started'},
            {text: 'Advanced', link: '/advanced/getting-started'},
            {text: 'API', link: '/api/general'}
        ],
        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    items: [
                        {text: 'Getting Started', link: '/guide/getting-started'}
                    ]
                },
                {
                    text: 'Celebration',
                    items: [
                        {text: 'Balloons', link: '/guide/balloons'},
                        {text: 'Confetti', link: '/guide/confetti'},
                        {text: 'Fireworks', link: '/guide/fireworks'},
                        {text: 'Glitter', link: '/guide/glitter'},
                        {text: 'Lanterns', link: '/guide/lanterns'},
                        {text: 'Popcorn', link: '/guide/popcorn'},
                        {text: 'Sparklers', link: '/guide/sparklers'},
                        {text: 'Streamers', link: '/guide/streamers'}
                    ]
                },
                {
                    text: 'Weather',
                    items: [
                        {text: 'Aurora', link: '/guide/aurora'},
                        {text: 'Clouds', link: '/guide/clouds'},
                        {text: 'Lightning', link: '/guide/lightning'},
                        {text: 'Rain', link: '/guide/rain'},
                        {text: 'Sandstorm', link: '/guide/sandstorm'},
                        {text: 'Smoke', link: '/guide/smoke'},
                        {text: 'Snow', link: '/guide/snow'},
                        {text: 'Tornado', link: '/guide/tornado'},
                        {text: 'Volcano', link: '/guide/volcano'}
                    ]
                },
                {
                    text: 'Nature',
                    items: [
                        {text: 'Boids', link: '/guide/boids'},
                        {text: 'Butterflies', link: '/guide/butterflies'},
                        {text: 'Coral Reef', link: '/guide/coral-reef'},
                        {text: 'Crystallization', link: '/guide/crystallization'},
                        {text: 'Fireflies', link: '/guide/fireflies'},
                        {text: 'Leaves', link: '/guide/leaves'},
                        {text: 'Murmuration', link: '/guide/murmuration'},
                        {text: 'Petals', link: '/guide/petals'},
                        {text: 'Pollen', link: '/guide/pollen'},
                        {text: 'Roots', link: '/guide/roots'}
                    ]
                },
                {
                    text: 'Space',
                    items: [
                        {text: 'Black Hole', link: '/guide/black-hole'},
                        {text: 'HyperSpace', link: '/guide/hyper-space'},
                        {text: 'Nebula', link: '/guide/nebula'},
                        {text: 'Orbits', link: '/guide/orbits'},
                        {text: 'Portal', link: '/guide/portal'},
                        {text: 'Stars', link: '/guide/stars'},
                        {text: 'Wormhole', link: '/guide/wormhole'}
                    ]
                },
                {
                    text: 'Fluid & Fire',
                    items: [
                        {text: 'Bubbles', link: '/guide/bubbles'},
                        {text: 'Caustics', link: '/guide/caustics'},
                        {text: 'Firepit', link: '/guide/firepit'},
                        {text: 'Fluid', link: '/guide/fluid'},
                        {text: 'Lava', link: '/guide/lava'},
                        {text: 'Waves', link: '/guide/waves'}
                    ]
                },
                {
                    text: 'Digital',
                    items: [
                        {text: 'Blueprint', link: '/guide/blueprint'},
                        {text: 'Digital Rain', link: '/guide/digital-rain'},
                        {text: 'Glitch', link: '/guide/glitch'},
                        {text: 'Hologram', link: '/guide/hologram'},
                        {text: 'Matrix', link: '/guide/matrix'},
                        {text: 'Neural Network', link: '/guide/neural-network'},
                        {text: 'Neon', link: '/guide/neon'}
                    ]
                },
                {
                    text: 'Simulation',
                    items: [
                        {text: 'Interference', link: '/guide/interference'},
                        {text: 'Magnetic Sand', link: '/guide/magnetic-sand'},
                        {text: 'Particles', link: '/guide/particles'},
                        {text: 'Primordial Soup', link: '/guide/primordial-soup'},
                        {text: 'Pulse Grid', link: '/guide/pulse-grid'},
                        {text: 'Sound Waves', link: '/guide/sound-waves'}
                    ]
                },
                {
                    text: 'Abstract',
                    items: [
                        {text: 'Donuts', link: '/guide/donuts'},
                        {text: 'Gradient Flow', link: '/guide/gradient-flow'},
                        {text: 'Kaleidoscope', link: '/guide/kaleidoscope'},
                        {text: 'Plasma', link: '/guide/plasma'},
                        {text: 'Spirograph', link: '/guide/spirograph'},
                        {text: 'Topography', link: '/guide/topography'},
                        {text: 'Voronoi', link: '/guide/voronoi'}
                    ]
                },
            ],
            '/advanced/': [
                {
                    text: 'Advanced',
                    items: [
                        {text: 'Getting Started', link: '/advanced/getting-started'},
                        {text: 'Layering Effects', link: '/advanced/layered'}
                    ]
                },
                {
                    text: 'Particles',
                    items: [
                        {text: 'Particles', link: '/advanced/particles'},
                        {text: 'Fireworks', link: '/advanced/fireworks'}
                    ]
                }
            ],
            '/api/': [
                {
                    text: 'API Reference',
                    items: [
                        {text: 'General', link: '/api/general'},
                        {text: 'Layered', link: '/api/layered'},
                        {text: 'Primitives', link: '/api/primitives'}
                    ]
                },
                {
                    text: 'Celebration',
                    items: [
                        {text: 'Balloons', link: '/api/balloons'},
                        {text: 'Confetti', link: '/api/confetti'},
                        {text: 'Fireworks', link: '/api/fireworks'},
                        {text: 'Glitter', link: '/api/glitter'},
                        {text: 'Lanterns', link: '/api/lanterns'},
                        {text: 'Popcorn', link: '/api/popcorn'},
                        {text: 'Sparklers', link: '/api/sparklers'},
                        {text: 'Streamers', link: '/api/streamers'}
                    ]
                },
                {
                    text: 'Weather',
                    items: [
                        {text: 'Aurora', link: '/api/aurora'},
                        {text: 'Clouds', link: '/api/clouds'},
                        {text: 'Lightning', link: '/api/lightning'},
                        {text: 'Rain', link: '/api/rain'},
                        {text: 'Sandstorm', link: '/api/sandstorm'},
                        {text: 'Smoke', link: '/api/smoke'},
                        {text: 'Snow', link: '/api/snow'},
                        {text: 'Tornado', link: '/api/tornado'},
                        {text: 'Volcano', link: '/api/volcano'}
                    ]
                },
                {
                    text: 'Nature',
                    items: [
                        {text: 'Boids', link: '/api/boids'},
                        {text: 'Butterflies', link: '/api/butterflies'},
                        {text: 'Coral Reef', link: '/api/coral-reef'},
                        {text: 'Crystallization', link: '/api/crystallization'},
                        {text: 'Fireflies', link: '/api/fireflies'},
                        {text: 'Leaves', link: '/api/leaves'},
                        {text: 'Murmuration', link: '/api/murmuration'},
                        {text: 'Petals', link: '/api/petals'},
                        {text: 'Pollen', link: '/api/pollen'},
                        {text: 'Roots', link: '/api/roots'}
                    ]
                },
                {
                    text: 'Space',
                    items: [
                        {text: 'Black Hole', link: '/api/black-hole'},
                        {text: 'HyperSpace', link: '/api/hyper-space'},
                        {text: 'Nebula', link: '/api/nebula'},
                        {text: 'Orbits', link: '/api/orbits'},
                        {text: 'Portal', link: '/api/portal'},
                        {text: 'Stars', link: '/api/stars'},
                        {text: 'Wormhole', link: '/api/wormhole'}
                    ]
                },
                {
                    text: 'Fluid & Fire',
                    items: [
                        {text: 'Bubbles', link: '/api/bubbles'},
                        {text: 'Caustics', link: '/api/caustics'},
                        {text: 'Firepit', link: '/api/firepit'},
                        {text: 'Fluid', link: '/api/fluid'},
                        {text: 'Lava', link: '/api/lava'},
                        {text: 'Waves', link: '/api/waves'}
                    ]
                },
                {
                    text: 'Digital',
                    items: [
                        {text: 'Blueprint', link: '/api/blueprint'},
                        {text: 'Digital Rain', link: '/api/digital-rain'},
                        {text: 'Glitch', link: '/api/glitch'},
                        {text: 'Hologram', link: '/api/hologram'},
                        {text: 'Matrix', link: '/api/matrix'},
                        {text: 'Neural Network', link: '/api/neural-network'},
                        {text: 'Neon', link: '/api/neon'}
                    ]
                },
                {
                    text: 'Simulation',
                    items: [
                        {text: 'Interference', link: '/api/interference'},
                        {text: 'Magnetic Sand', link: '/api/magnetic-sand'},
                        {text: 'Particles', link: '/api/particles'},
                        {text: 'Primordial Soup', link: '/api/primordial-soup'},
                        {text: 'Pulse Grid', link: '/api/pulse-grid'},
                        {text: 'Sound Waves', link: '/api/sound-waves'}
                    ]
                },
                {
                    text: 'Abstract',
                    items: [
                        {text: 'Donuts', link: '/api/donuts'},
                        {text: 'Gradient Flow', link: '/api/gradient-flow'},
                        {text: 'Kaleidoscope', link: '/api/kaleidoscope'},
                        {text: 'Plasma', link: '/api/plasma'},
                        {text: 'Spirograph', link: '/api/spirograph'},
                        {text: 'Topography', link: '/api/topography'},
                        {text: 'Voronoi', link: '/api/voronoi'}
                    ]
                }
            ]
        },
        footer: {
            message: 'Released under the <a href="https://github.com/basmilius/sparkle/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2024–present <a href="https://github.com/basmilius">Bas Milius</a>'
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/basmilius/sparkle'}
        ]
    }
}) as UserConfig<DefaultTheme.Config>;
