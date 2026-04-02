import { mulberry32 } from '@basmilius/utils';
import type { Config } from './types';

export const DEFAULT_CONFIG: Config = {
    angle: 90,
    colors: [
        '#26ccff',
        '#a25afd',
        '#ff5e7e',
        '#88ff5a',
        '#fcff42',
        '#ffa62d',
        '#ff36ff'
    ],
    decay: 0.9,
    gravity: 1,
    particles: 50,
    shapes: ['circle', 'diamond', 'ribbon', 'square', 'star', 'triangle'],
    spread: 45,
    ticks: 200,
    startVelocity: 45,
    x: 0.5,
    y: 0.5
};

export const MULBERRY = mulberry32(13);
