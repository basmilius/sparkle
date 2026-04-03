export type SliderControl = {
    type: 'slider';
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    default: number;
};

export type ToggleControl = {
    type: 'toggle';
    key: string;
    label: string;
    default: boolean;
};

export type ColorControl = {
    type: 'color';
    key: string;
    label: string;
    default: string;
};

export type SelectControl = {
    type: 'select';
    key: string;
    label: string;
    options: { value: string; label: string }[];
    default: string;
};

export type RangeControl = {
    type: 'range';
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    default: [number, number];
};

export type ColorsControl = {
    type: 'colors';
    key: string;
    label: string;
    default: string[];
};

export type MultiSelectControl = {
    type: 'multiselect';
    key: string;
    label: string;
    options: { value: string; label: string }[];
    default: string[];
};

export type ControlDef = SliderControl | ToggleControl | ColorControl | SelectControl | RangeControl | ColorsControl | MultiSelectControl;

export interface SimInstance {
    start(): void;
    stop(): void;
    destroy(): void;
    configure?(config: Record<string, unknown>): void;
    fire?(config: unknown): void;
    fireExplosion?(variant: string, pos: { x: number; y: number }): void;
}

export interface SimulatorDef {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly schema: ControlDef[];
    readonly defaultConfig: Record<string, unknown>;
    readonly liveKeys: string[];
    readonly interactive?: 'confetti' | 'fireworks';
    create(canvas: HTMLCanvasElement, config: Record<string, unknown>): SimInstance;
    createLayer(config: Record<string, unknown>): unknown;
}
