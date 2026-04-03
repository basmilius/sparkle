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
        nav: [
            {text: 'Guide', link: '/guide/getting-started'},
            {text: 'API', link: '/api/general'}
        ],
        sidebar: [
            {
                text: 'Guide',
                items: [
                    {text: 'Getting Started', link: '/guide/getting-started'},
                    {text: 'Layering Effects', link: '/guide/layered'}
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
                    {text: 'Sandstorm', link: '/guide/sandstorm'}
                ]
            },
            {
                text: 'Ambient',
                items: [
                    {text: 'Stars', link: '/guide/stars'},
                    {text: 'Particles', link: '/guide/particles'},
                    {text: 'Firepit', link: '/guide/firepit'},
                    {text: 'Plasma', link: '/guide/plasma'},
                    {text: 'Orbits', link: '/guide/orbits'}
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
            {
                text: 'Advanced',
                items: [
                    {text: 'Custom Effects', link: '/guide/custom-effects'}
                ]
            },
            {
                text: 'API Reference',
                collapsed: true,
                items: [
                    {text: 'General', link: '/api/general'},
                    {text: 'Layered', link: '/api/layered'},
                    {text: 'Aurora', link: '/api/aurora'},
                    {text: 'Balloons', link: '/api/balloons'},
                    {text: 'Bubbles', link: '/api/bubbles'},
                    {text: 'Confetti', link: '/api/confetti'},
                    {text: 'Donuts', link: '/api/donuts'},
                    {text: 'Fireflies', link: '/api/fireflies'},
                    {text: 'Firepit', link: '/api/firepit'},
                    {text: 'Fireworks', link: '/api/fireworks'},
                    {text: 'Glitter', link: '/api/glitter'},
                    {text: 'Lanterns', link: '/api/lanterns'},
                    {text: 'Leaves', link: '/api/leaves'},
                    {text: 'Lightning', link: '/api/lightning'},
                    {text: 'Matrix', link: '/api/matrix'},
                    {text: 'Orbits', link: '/api/orbits'},
                    {text: 'Particles', link: '/api/particles'},
                    {text: 'Petals', link: '/api/petals'},
                    {text: 'Plasma', link: '/api/plasma'},
                    {text: 'Rain', link: '/api/rain'},
                    {text: 'Sandstorm', link: '/api/sandstorm'},
                    {text: 'Snow', link: '/api/snow'},
                    {text: 'Sparklers', link: '/api/sparklers'},
                    {text: 'Stars', link: '/api/stars'},
                    {text: 'Streamers', link: '/api/streamers'},
                    {text: 'Waves', link: '/api/waves'},
                    {text: 'Wormhole', link: '/api/wormhole'},
                    {text: 'Primitives', link: '/api/primitives'}
                ]
            }
        ],
        socialLinks: [
            {icon: 'github', link: 'https://github.com/basmilius/sparkle'}
        ]
    }
}) as UserConfig<DefaultTheme.Config>;
