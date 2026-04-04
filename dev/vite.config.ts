import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@basmilius/sparkle': resolve(__dirname, '../src/index.ts')
        }
    }
});
