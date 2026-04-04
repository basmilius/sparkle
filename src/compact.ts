/**
 * Compacts an array in-place, keeping only items for which
 * {@link isAlive} returns `true`. This avoids the allocation
 * overhead of `Array.prototype.filter`.
 */
export function compactArray<T>(array: T[], isAlive: (item: T) => boolean): void {
    let write = 0;

    for (let i = 0; i < array.length; i++) {
        if (isAlive(array[i])) {
            array[write++] = array[i];
        }
    }

    array.length = write;
}
