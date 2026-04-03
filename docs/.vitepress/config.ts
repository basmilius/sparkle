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
                        {text: 'Fireworks', link: '/guide/fireworks'},
                        {text: 'Confetti', link: '/guide/confetti'},
                        {text: 'Balloons', link: '/guide/balloons'},
                        {text: 'Streamers', link: '/guide/streamers'},
                        {text: 'Glitter', link: '/guide/glitter'},
                        {text: 'Lanterns', link: '/guide/lanterns'},
                        {text: 'Sparklers', link: '/guide/sparklers'}
                    ]
                },
                {
                    text: 'Nature',
                    items: [
                        {text: 'Snow', link: '/guide/snow'},
                        {text: 'Rain', link: '/guide/rain'},
                        {text: 'Aurora', link: '/guide/aurora'},
                        {text: 'Leaves', link: '/guide/leaves'},
                        {text: 'Petals', link: '/guide/petals'},
                        {text: 'Fireflies', link: '/guide/fireflies'},
                        {text: 'Bubbles', link: '/guide/bubbles'},
                        {text: 'Waves', link: '/guide/waves'},
                        {text: 'Lightning', link: '/guide/lightning'},
                        {text: 'Sandstorm', link: '/guide/sandstorm'},
                        {text: 'Smoke', link: '/guide/smoke'},
                        {text: 'Butterflies', link: '/guide/butterflies'},
                        {text: 'Clouds', link: '/guide/clouds'}
                    ]
                },
                {
                    text: 'Space',
                    items: [
                        {text: 'Nebula', link: '/guide/nebula'},
                        {text: 'Black Hole', link: '/guide/black-hole'},
                        {text: 'HyperSpace', link: '/guide/hyper-space'}
                    ]
                },
                {
                    text: 'Ambient',
                    items: [
                        {text: 'Stars', link: '/guide/stars'},
                        {text: 'Particles', link: '/guide/particles'},
                        {text: 'Firepit', link: '/guide/firepit'},
                        {text: 'Plasma', link: '/guide/plasma'},
                        {text: 'Orbits', link: '/guide/orbits'},
                        {text: 'Lava', link: '/guide/lava'},
                        {text: 'Neon', link: '/guide/neon'}
                    ]
                },
                {
                    text: 'Organic',
                    items: [
                        {text: 'Boids', link: '/guide/boids'},
                        {text: 'Roots', link: '/guide/roots'}
                    ]
                },
                {
                    text: 'Stylized',
                    items: [
                        {text: 'Matrix', link: '/guide/matrix'},
                        {text: 'Wormhole', link: '/guide/wormhole'},
                        {text: 'Donuts', link: '/guide/donuts'}
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
                        {text: 'Fireworks', link: '/api/fireworks'},
                        {text: 'Confetti', link: '/api/confetti'},
                        {text: 'Balloons', link: '/api/balloons'},
                        {text: 'Streamers', link: '/api/streamers'},
                        {text: 'Glitter', link: '/api/glitter'},
                        {text: 'Lanterns', link: '/api/lanterns'},
                        {text: 'Sparklers', link: '/api/sparklers'}
                    ]
                },
                {
                    text: 'Nature',
                    items: [
                        {text: 'Snow', link: '/api/snow'},
                        {text: 'Rain', link: '/api/rain'},
                        {text: 'Aurora', link: '/api/aurora'},
                        {text: 'Leaves', link: '/api/leaves'},
                        {text: 'Petals', link: '/api/petals'},
                        {text: 'Fireflies', link: '/api/fireflies'},
                        {text: 'Bubbles', link: '/api/bubbles'},
                        {text: 'Waves', link: '/api/waves'},
                        {text: 'Lightning', link: '/api/lightning'},
                        {text: 'Sandstorm', link: '/api/sandstorm'},
                        {text: 'Smoke', link: '/api/smoke'},
                        {text: 'Butterflies', link: '/api/butterflies'},
                        {text: 'Clouds', link: '/api/clouds'}
                    ]
                },
                {
                    text: 'Space',
                    items: [
                        {text: 'Nebula', link: '/api/nebula'},
                        {text: 'Black Hole', link: '/api/black-hole'},
                        {text: 'HyperSpace', link: '/api/hyper-space'}
                    ]
                },
                {
                    text: 'Ambient',
                    items: [
                        {text: 'Stars', link: '/api/stars'},
                        {text: 'Particles', link: '/api/particles'},
                        {text: 'Firepit', link: '/api/firepit'},
                        {text: 'Plasma', link: '/api/plasma'},
                        {text: 'Orbits', link: '/api/orbits'},
                        {text: 'Lava', link: '/api/lava'},
                        {text: 'Neon', link: '/api/neon'}
                    ]
                },
                {
                    text: 'Organic',
                    items: [
                        {text: 'Boids', link: '/api/boids'},
                        {text: 'Roots', link: '/api/roots'}
                    ]
                },
                {
                    text: 'Stylized',
                    items: [
                        {text: 'Matrix', link: '/api/matrix'},
                        {text: 'Wormhole', link: '/api/wormhole'},
                        {text: 'Donuts', link: '/api/donuts'}
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
