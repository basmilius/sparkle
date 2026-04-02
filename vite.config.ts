import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'example',
    resolve: {
        alias: {
            '@basmilius/effects': resolve(__dirname, 'packages/effects/src/index.ts')
        }
    }
});
