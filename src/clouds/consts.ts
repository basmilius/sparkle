import { type Mulberry32, mulberry32 } from '@basmilius/utils';

export const MULBERRY: Mulberry32 = mulberry32(17);

export const DEFAULT_CONFIG = {
    color: '#ffffff',
    count: 8,
    opacity: 0.8,
    scale: 1,
    speed: 0.3,
} as const;

export const SPRITE_COUNT = 6;
export const SPRITE_W = 512;
export const SPRITE_H = 220;
export const FADE_MARGIN = 0.15;

// Blob layouts per sprite variant.
// Each entry is an array of [dx, dy, radius_factor] relative to sprite center,
// as fractions of SPRITE_W. This ensures blobs are always within the sprite bounds.
export type BlobDef = [number, number, number];

export const BLOB_LAYOUTS: BlobDef[][] = [
    [[0, 0, 0.20], [-0.22, 0.03, 0.16], [0.22, -0.02, 0.16]],
    [[0, 0, 0.19], [-0.20, 0.04, 0.15], [0.24, -0.01, 0.17], [0.08, -0.07, 0.13]],
    [[0, 0, 0.21], [-0.28, 0.05, 0.14], [0.18, 0.02, 0.15], [-0.10, -0.06, 0.12]],
    [[0, -0.03, 0.18], [-0.25, 0.04, 0.16], [0.20, 0.03, 0.14], [0.05, 0.05, 0.13]],
    [[0, 0, 0.22], [-0.15, -0.04, 0.18], [0.30, 0.02, 0.13]],
    [[-0.05, 0, 0.20], [0.20, -0.02, 0.17], [-0.28, 0.04, 0.13], [0.12, 0.06, 0.12]],
];
