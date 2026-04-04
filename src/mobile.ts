export function isSmallScreen(): boolean {
    return typeof globalThis.innerWidth !== 'undefined' && globalThis.innerWidth < 991;
}

/**
 * Returns a reduced particle/entity count for small screens.
 * Defaults to halving the count, but the factor can be customized.
 */
export function mobileCount(count: number, factor: number = 0.5): number {
    return isSmallScreen() ? Math.floor(count * factor) : count;
}
