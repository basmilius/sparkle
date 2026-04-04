export type BlueprintElement = {
    type: 'line' | 'rect' | 'circle' | 'arc' | 'dashed' | 'polyline' | 'dimension';
    points: number[];
    progress: number;
};

export type BlueprintDrawing = {
    elements: BlueprintElement[];
    phase: 'drawing' | 'visible' | 'fading' | 'dead';
    drawingTimer: number;
    phaseTimer: number;
    opacity: number;
    cx: number;
    cy: number;
    size: number;
};
