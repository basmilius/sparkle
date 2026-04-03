import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'dev',
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@basmilius/sparkle': resolve(__dirname, 'src/index.ts')
        }
    }
});
