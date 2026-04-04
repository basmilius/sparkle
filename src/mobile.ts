export function isSmallScreen(): boolean {
    return typeof globalThis.innerWidth !== 'undefined' && globalThis.innerWidth < 991;
}
