import { type Mulberry32, mulberry32 } from '@basmilius/utils';
import type { Config, Palette } from './types';

export const PALETTES: Record<Palette, string[]> = {
    classic: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
    pastel: ['#a8d8ea', '#c3aed6', '#f9b4c4', '#ffd6a5', '#caffbf', '#fdffb6'],
    vibrant: ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4'],
    warm: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4']
};

export const DEFAULT_CONFIG: Config = {
    angle: 90,
    colors: PALETTES.vibrant,
    decay: 0.9,
    gravity: 1,
    palette: 'vibrant',
    particles: 50,
    shapes: ['bowtie', 'circle', 'crescent', 'diamond', 'heart', 'hexagon', 'ribbon', 'ring', 'square', 'star', 'triangle'],
    spread: 45,
    ticks: 200,
    startVelocity: 45,
    x: 0.5,
    y: 0.5
};

export const MULBERRY: Mulberry32 = mulberry32(13);
