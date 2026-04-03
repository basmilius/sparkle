import { Voronoi } from './layer';
import type { VoronoiConfig } from './layer';
import type { Effect } from '../effect';

export function createVoronoi(config?: VoronoiConfig): Effect<VoronoiConfig> {
    return new Voronoi(config);
}

export type { VoronoiConfig };
export type { VoronoiCell } from './types';
