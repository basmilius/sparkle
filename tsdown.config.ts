import { defineConfig, type UserConfig } from 'tsdown';

export default defineConfig([
    {
        entry: ['./src/index.ts'],
        dts: true,
    },
    {
        entry: { sparkle: './src/index.ts' },
        format: 'iife',
        globalName: 'Sparkle',
        minify: true,
        deps: {
            alwaysBundle: ['@basmilius/utils'],
        },
    },
]) as UserConfig;
