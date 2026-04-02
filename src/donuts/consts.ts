import { mulberry32 } from '@basmilius/utils';
import type { DonutSimulationConfig } from './simulation';

export const MULBERRY = mulberry32(13);

export const DEFAULT_CONFIG: DonutSimulationConfig = {
    background: '#a51955',
    collisionPadding: 20,
    colors: ['#bd1961', '#da287c'],
    count: 12,
    mouseAvoidance: false,
    mouseAvoidanceRadius: 150,
    mouseAvoidanceStrength: 0.03,
    radiusRange: [60, 90],
    repulsionStrength: 0.02,
    rotationSpeedRange: [0.0005, 0.002],
    speedRange: [0.15, 0.6],
    thickness: 0.39
};
