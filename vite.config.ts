import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'dev',
    resolve: {
        alias: {
            '@basmilius/sparkle': resolve(__dirname, 'src/index.ts')
        }
    }
});
