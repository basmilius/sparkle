import { Matrix } from './layer';
import type { MatrixConfig } from './types';
import type { Effect } from '../effect';

export function createMatrix(config?: MatrixConfig): Effect<MatrixConfig> {
    return new Matrix(config);
}

export type { MatrixConfig, MatrixColumn } from './types';
