import type { DigitalRainConfig } from './layer';
import { DigitalRain } from './layer';
import type { Effect } from '../effect';

export function createDigitalRain(config?: DigitalRainConfig): Effect<DigitalRainConfig> {
    return new DigitalRain(config);
}

export type { DigitalRainConfig };
export type { DigitalRainColumn, DigitalRainMode } from './types';
