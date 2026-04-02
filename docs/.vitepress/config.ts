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
                    {text: 'Snow', link: '/guide/snow'}
                ]
            },
            {
                text: 'API',
                items: [
                    {text: 'General', link: '/api/general'},
                    {text: 'Fireworks', link: '/api/fireworks'},
                    {text: 'Confetti', link: '/api/confetti'},
                    {text: 'Snow', link: '/api/snow'}
                ]
            }
        ],
        socialLinks: [
            {icon: 'github', link: 'https://github.com/basmilius/sparkle'}
        ]
    }
});
