import { resolve } from 'path';
import { defineConfig } from 'vitepress';
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
                    {text: 'Fireworks', link: '/guide/fireworks'},
                    {text: 'Confetti', link: '/guide/confetti'},
                    {text: 'Donuts', link: '/guide/donuts'},
                    {text: 'Snow', link: '/guide/snow'},
                    {text: 'Fireflies', link: '/guide/fireflies'},
                    {text: 'Rain', link: '/guide/rain'},
                    {text: 'Aurora', link: '/guide/aurora'},
                    {text: 'Bubbles', link: '/guide/bubbles'},
                    {text: 'Sparklers', link: '/guide/sparklers'},
                    {text: 'Balloons', link: '/guide/balloons'},
                    {text: 'Stars', link: '/guide/stars'},
                    {text: 'Particles', link: '/guide/particles'}
                ]
            },
            {
                text: 'API',
                items: [
                    {text: 'General', link: '/api/general'},
                    {text: 'Fireworks', link: '/api/fireworks'},
                    {text: 'Confetti', link: '/api/confetti'},
                    {text: 'Donuts', link: '/api/donuts'},
                    {text: 'Snow', link: '/api/snow'},
                    {text: 'Fireflies', link: '/api/fireflies'},
                    {text: 'Rain', link: '/api/rain'},
                    {text: 'Aurora', link: '/api/aurora'},
                    {text: 'Bubbles', link: '/api/bubbles'},
                    {text: 'Sparklers', link: '/api/sparklers'},
                    {text: 'Balloons', link: '/api/balloons'},
                    {text: 'Stars', link: '/api/stars'},
                    {text: 'Particles', link: '/api/particles'}
                ]
            }
        ],
        socialLinks: [
            {icon: 'github', link: 'https://github.com/basmilius/sparkle'}
        ]
    }
});
