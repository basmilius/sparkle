import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'dev',
    resolve: {
        alias: {
            '@basmilius/effects': resolve(__dirname, 'src/index.ts')
        }
    }
});
