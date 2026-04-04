export class SpatialGrid<T> {
    readonly #cellSize: number;
    readonly #cells: Map<number, T[]> = new Map();
    #cols: number = 0;

    constructor(cellSize: number) {
        this.#cellSize = cellSize;
    }

    setWidth(width: number): void {
        this.#cols = Math.ceil(width / this.#cellSize);
    }

    clear(): void {
        this.#cells.clear();
    }

    insert(x: number, y: number, item: T): void {
        const col = Math.floor(x / this.#cellSize);
        const row = Math.floor(y / this.#cellSize);
        const key = col + row * this.#cols;
        let cell = this.#cells.get(key);
        if (!cell) {
            cell = [];
            this.#cells.set(key, cell);
        }
        cell.push(item);
    }

    query(x: number, y: number, callback: (item: T) => void): void {
        const col = Math.floor(x / this.#cellSize);
        const row = Math.floor(y / this.#cellSize);

        for (let dc = -1; dc <= 1; dc++) {
            for (let dr = -1; dr <= 1; dr++) {
                const cell = this.#cells.get((col + dc) + (row + dr) * this.#cols);
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        callback(cell[i]);
                    }
                }
            }
        }
    }
}
