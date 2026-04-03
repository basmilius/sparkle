import { Portal } from './layer';
import type { PortalConfig } from './layer';
import type { Effect } from '../effect';

export function createPortal(config?: PortalConfig): Effect<PortalConfig> {
    return new Portal(config);
}

export type { PortalConfig };
export type { PortalDirection, PortalParticle } from './types';
