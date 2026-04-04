import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { BlueprintDrawing, BlueprintElement } from './types';

export interface BlueprintConfig {
    readonly speed?: number;
    readonly gridSize?: number;
    readonly lineColor?: string;
    readonly backgroundColor?: string;
    readonly complexity?: number;
    readonly scale?: number;
}

const TWO_PI = Math.PI * 2;
const DRAWING_DURATION = 3.5;
const VISIBLE_DURATION = 5;
const FADE_DURATION = 1.5;
const MAX_DRAWINGS = 5;
const MIN_SEPARATION = 0.55;  // Minimum distance between centers as fraction of combined sizes.

export class Blueprint extends Effect<BlueprintConfig> {
    #vscale: number;
    readonly #gridSize: number;
    readonly #complexity: number;
    #lr: number;
    #lg: number;
    #lb: number;
    #bgR: number;
    #bgG: number;
    #bgB: number;
    #speed: number;
    #width: number = 0;
    #height: number = 0;
    #drawings: BlueprintDrawing[] = [];

    constructor(config: BlueprintConfig = {}) {
        super();

        this.#vscale = config.scale ?? 1;
        this.#gridSize = (config.gridSize ?? 30) * this.#vscale;
        this.#complexity = config.complexity ?? 5;
        this.#speed = config.speed ?? 1;

        const [lr, lg, lb] = hexToRGB(config.lineColor ?? '#c8deff');
        this.#lr = lr;
        this.#lg = lg;
        this.#lb = lb;

        const [bgR, bgG, bgB] = hexToRGB(config.backgroundColor ?? '#0d1b2a');
        this.#bgR = bgR;
        this.#bgG = bgG;
        this.#bgB = bgB;
    }

    configure(config: Partial<BlueprintConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.lineColor !== undefined) {
            const [lr, lg, lb] = hexToRGB(config.lineColor);
            this.#lr = lr;
            this.#lg = lg;
            this.#lb = lb;
        }
        if (config.backgroundColor !== undefined) {
            const [bgR, bgG, bgB] = hexToRGB(config.backgroundColor);
            this.#bgR = bgR;
            this.#bgG = bgG;
            this.#bgB = bgB;
        }
        if (config.scale !== undefined) {
            this.#vscale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#drawings = [];

        for (let index = 0; index < MAX_DRAWINGS; index++) {
            const drawing = this.#spawnDrawing();
            if (!drawing) break;

            // Stagger initial states.
            if (index === 1 || index === 2) {
                drawing.phase = 'visible';
                drawing.phaseTimer = VISIBLE_DURATION * MULBERRY.next() * 0.7;
                drawing.opacity = 1;
                for (const el of drawing.elements) el.progress = 1;
            } else if (index === 3 || index === 4) {
                drawing.drawingTimer = DRAWING_DURATION * (0.35 + MULBERRY.next() * 0.4);
                drawing.opacity = 1;
                this.#advanceDrawing(drawing);
            }

            this.#drawings.push(drawing);
        }
    }

    tick(dt: number): void {
        const dtSec = (dt / 1000) * this.#speed;

        for (const drawing of this.#drawings) {
            this.#tickDrawing(drawing, dtSec);
        }

        for (let index = this.#drawings.length - 1; index >= 0; index--) {
            if (this.#drawings[index].phase === 'dead') {
                this.#drawings.splice(index, 1);
                const next = this.#spawnDrawing();
                if (next) this.#drawings.push(next);
            }
        }

        while (this.#drawings.length < MAX_DRAWINGS) {
            const next = this.#spawnDrawing();
            if (!next) break;
            this.#drawings.push(next);
        }
    }

    #tickDrawing(drawing: BlueprintDrawing, dtSec: number): void {
        drawing.phaseTimer += dtSec;

        switch (drawing.phase) {
            case 'drawing':
                drawing.drawingTimer += dtSec;
                drawing.opacity = Math.min(1, drawing.drawingTimer * 2.5);
                this.#advanceDrawing(drawing);

                if (drawing.drawingTimer >= DRAWING_DURATION) {
                    drawing.phase = 'visible';
                    drawing.phaseTimer = 0;
                    drawing.opacity = 1;
                    for (const el of drawing.elements) el.progress = 1;
                }
                break;

            case 'visible':
                if (drawing.phaseTimer >= VISIBLE_DURATION) {
                    drawing.phase = 'fading';
                    drawing.phaseTimer = 0;
                }
                break;

            case 'fading':
                drawing.opacity = Math.max(0, 1 - drawing.phaseTimer / FADE_DURATION);
                if (drawing.phaseTimer >= FADE_DURATION) {
                    drawing.phase = 'dead';
                }
                break;
        }
    }

    #advanceDrawing(drawing: BlueprintDrawing): void {
        const count = drawing.elements.length;
        if (count === 0) return;

        const rate = count / DRAWING_DURATION;
        const targetIndex = Math.min(count, Math.floor(drawing.drawingTimer * rate));

        for (let index = 0; index < targetIndex; index++) {
            drawing.elements[index].progress = 1;
        }

        if (targetIndex < count) {
            const start = targetIndex / rate;
            const dur = 1 / rate;
            drawing.elements[targetIndex].progress = Math.min(1, Math.max(0, (drawing.drawingTimer - start) / dur));
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillStyle = `rgb(${this.#bgR}, ${this.#bgG}, ${this.#bgB})`;
        ctx.fillRect(0, 0, width, height);

        this.#drawGrid(ctx, width, height);

        for (const drawing of this.#drawings) {
            if (drawing.opacity > 0.01) {
                this.#renderDrawing(ctx, drawing);
            }
        }
    }

    #drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const gs = this.#gridSize;
        ctx.strokeStyle = `rgba(${this.#lr}, ${this.#lg}, ${this.#lb}, 0.05)`;
        ctx.lineWidth = 0.5 * this.#vscale;
        ctx.setLineDash([]);
        ctx.beginPath();

        for (let x = 0; x <= width; x += gs) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        for (let y = 0; y <= height; y += gs) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }

        ctx.stroke();
    }

    #renderDrawing(ctx: CanvasRenderingContext2D, drawing: BlueprintDrawing): void {
        ctx.save();
        for (const el of drawing.elements) {
            if (el.progress > 0) {
                this.#drawElement(ctx, el, drawing.opacity);
            }
        }
        ctx.restore();
    }

    #drawElement(ctx: CanvasRenderingContext2D, el: BlueprintElement, alpha: number): void {
        const lr = this.#lr;
        const lg = this.#lg;
        const lb = this.#lb;
        const progress = Math.min(1, el.progress);
        const s = this.#vscale;

        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha * 0.8})`;
        ctx.lineWidth = 1 * s;

        switch (el.type) {
            case 'line': {
                const [x1, y1, x2, y2] = el.points;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress);
                ctx.stroke();
                break;
            }

            case 'rect': {
                const [rx, ry, rw, rh] = el.points;
                const perimeter = 2 * (rw + rh);
                const drawn = perimeter * progress;
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                let rem = drawn;
                const top = Math.min(rem, rw); ctx.lineTo(rx + top, ry); rem -= top;
                if (rem > 0) { const r = Math.min(rem, rh); ctx.lineTo(rx + rw, ry + r); rem -= r; }
                if (rem > 0) { const b = Math.min(rem, rw); ctx.lineTo(rx + rw - b, ry + rh); rem -= b; }
                if (rem > 0) { const l = Math.min(rem, rh); ctx.lineTo(rx, ry + rh - l); }
                ctx.stroke();
                break;
            }

            case 'circle': {
                const [cx, cy, radius] = el.points;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, TWO_PI * progress);
                ctx.stroke();

                if (progress > 0.6) {
                    const markAlpha = Math.min(1, (progress - 0.6) * 4) * alpha * 0.4;
                    const markSize = 4 * s;
                    ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${markAlpha})`;
                    ctx.lineWidth = 0.7 * s;
                    ctx.setLineDash([3 * s, 3 * s]);
                    ctx.beginPath();
                    ctx.moveTo(cx - markSize * 1.6, cy); ctx.lineTo(cx + markSize * 1.6, cy);
                    ctx.moveTo(cx, cy - markSize * 1.6); ctx.lineTo(cx, cy + markSize * 1.6);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
                break;
            }

            case 'arc': {
                const [cx, cy, radius, startA, endA] = el.points;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, startA, startA + (endA - startA) * progress);
                ctx.stroke();
                break;
            }

            case 'dashed': {
                const [x1, y1, x2, y2] = el.points;
                ctx.setLineDash([5 * s, 4 * s]);
                ctx.lineWidth = 0.7 * s;
                ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha * 0.4})`;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress);
                ctx.stroke();
                ctx.setLineDash([]);
                break;
            }

            case 'dimension': {
                const [x1, y1, x2, y2] = el.points;
                const angle = Math.atan2(y2 - y1, x2 - x1);
                const ex = x1 + (x2 - x1) * progress;
                const ey = y1 + (y2 - y1) * progress;

                ctx.lineWidth = 0.6 * s;
                ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha * 0.5})`;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(ex, ey);
                ctx.stroke();

                this.#drawArrow(ctx, x1, y1, angle + Math.PI, 5 * s, alpha * 0.5);

                if (progress > 0.95) {
                    this.#drawArrow(ctx, x2, y2, angle, 5 * s, alpha * 0.5);
                }
                break;
            }

            case 'polyline': {
                const pts = el.points;
                const segCount = (pts.length / 2) - 1;
                if (segCount <= 0) break;

                const totalDrawn = segCount * progress;
                ctx.beginPath();
                ctx.moveTo(pts[0], pts[1]);

                for (let seg = 0; seg < segCount; seg++) {
                    const segP = Math.min(1, Math.max(0, totalDrawn - seg));
                    if (segP <= 0) break;
                    const ix1 = pts[seg * 2], iy1 = pts[seg * 2 + 1];
                    const ix2 = pts[(seg + 1) * 2], iy2 = pts[(seg + 1) * 2 + 1];
                    ctx.lineTo(ix1 + (ix2 - ix1) * segP, iy1 + (iy2 - iy1) * segP);
                }

                ctx.stroke();
                break;
            }
        }
    }

    #drawArrow(ctx: CanvasRenderingContext2D, tipX: number, tipY: number, angle: number, size: number, alpha: number): void {
        const lr = this.#lr, lg = this.#lg, lb = this.#lb;
        ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - Math.cos(angle - 0.35) * size, tipY - Math.sin(angle - 0.35) * size);
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - Math.cos(angle + 0.35) * size, tipY - Math.sin(angle + 0.35) * size);
        ctx.stroke();
    }

    #spawnDrawing(): BlueprintDrawing | null {
        const s = this.#vscale;
        const w = this.#width;
        const h = this.#height;
        const padding = 30 * s;
        const minSize = Math.min(w, h) * 0.15;
        const maxSize = Math.min(w, h) * 0.40;

        // Try to find a position not too close to existing drawings.
        for (let attempt = 0; attempt < 20; attempt++) {
            const size = minSize + MULBERRY.next() * (maxSize - minSize);
            const cx = padding + size * 0.5 + MULBERRY.next() * (w - padding * 2 - size);
            const cy = padding + size * 0.5 + MULBERRY.next() * (h - padding * 2 - size);

            let tooClose = false;
            for (const existing of this.#drawings) {
                if (existing.phase === 'dead') continue;
                const dx = cx - existing.cx;
                const dy = cy - existing.cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = (size + existing.size) * MIN_SEPARATION;
                if (dist < minDist) { tooClose = true; break; }
            }

            if (!tooClose) {
                const drawing: BlueprintDrawing = {
                    elements: [],
                    phase: 'drawing',
                    drawingTimer: 0,
                    phaseTimer: 0,
                    opacity: 0,
                    cx,
                    cy,
                    size,
                };
                this.#generateContent(drawing);
                return drawing;
            }
        }

        return null;
    }

    #generateContent(drawing: BlueprintDrawing): void {
        const s = this.#vscale;
        const { cx, cy, size } = drawing;
        const type = Math.floor(MULBERRY.next() * 8);

        switch (type) {
            case 0: this.#generateConcentricRings(drawing, cx, cy, size, s); break;
            case 1: this.#generatePolygon(drawing, cx, cy, size, s); break;
            case 2: this.#generateFrameWithCutouts(drawing, cx, cy, size, s); break;
            case 3: this.#generateRadialArray(drawing, cx, cy, size, s); break;
            case 4: this.#generateProfile(drawing, cx, cy, size, s); break;
            case 5: this.#generateConstruction(drawing, cx, cy, size, s); break;
            case 6: this.#generateOrthographicViews(drawing, cx, cy, size, s); break;
            case 7: this.#generateNestedShapes(drawing, cx, cy, size, s); break;
        }
    }

    #add(drawing: BlueprintDrawing, type: BlueprintElement['type'], points: number[]): void {
        drawing.elements.push({ type, points, progress: 0 });
    }


    // --- Drawing generators (generic geometric forms) ---

    // 1. Concentric circles with radial spokes and partial arc sectors.
    #generateConcentricRings(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const complexity = this.#complexity;
        const dimOff = 18 * s;
        const ringCount = 2 + Math.floor(MULBERRY.next() * Math.min(complexity, 4));
        const maxR = size * 0.42;
        const spokeCount = [0, 4, 6, 8][Math.floor(MULBERRY.next() * 4)];
        const rotation = MULBERRY.next() * Math.PI;

        // Rings — alternate between full circles and partial arcs.
        for (let index = 0; index < ringCount; index++) {
            const r = maxR * ((index + 1) / ringCount);
            if (index === ringCount - 1 || MULBERRY.next() > 0.35) {
                this.#add(drawing, 'circle', [cx, cy, r]);
            } else {
                const startA = rotation + MULBERRY.next() * Math.PI;
                this.#add(drawing, 'arc', [cx, cy, r, startA, startA + Math.PI * (1.1 + MULBERRY.next() * 0.8)]);
            }
        }

        // Spokes from inner ring to outer.
        if (spokeCount > 0) {
            const innerR = maxR / ringCount;
            for (let index = 0; index < spokeCount; index++) {
                const angle = rotation + (index / spokeCount) * TWO_PI;
                this.#add(drawing, 'line', [
                    cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR,
                    cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR,
                ]);
            }
        }

        // Extended center cross (dashed).
        const extR = maxR + 14 * s;
        this.#add(drawing, 'dashed', [cx - extR, cy, cx + extR, cy]);
        this.#add(drawing, 'dashed', [cx, cy - extR, cx, cy + extR]);

        // Dimension lines.
        this.#add(drawing, 'dimension', [cx - maxR, cy + maxR + dimOff, cx + maxR, cy + maxR + dimOff]);
        if (ringCount > 1) {
            const innerR = maxR / ringCount;
            this.#add(drawing, 'dimension', [cx - innerR, cy - maxR - dimOff * 0.6, cx + innerR, cy - maxR - dimOff * 0.6]);
        }
    }

    // 2. Polygon with inscribed / circumscribed circles and construction lines.
    #generatePolygon(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const complexity = this.#complexity;
        const dimOff = 18 * s;
        const sides = 3 + Math.floor(MULBERRY.next() * 5);  // 3–7 sides
        const outerR = size * 0.40;
        const innerR = outerR * Math.cos(Math.PI / sides);  // Apothem (inscribed circle).
        const rotation = -Math.PI / 2 + (sides % 2 === 0 ? Math.PI / sides : 0);

        // Circumscribed circle (faint dashed).
        this.#add(drawing, 'arc', [cx, cy, outerR, 0, Math.PI]);
        this.#add(drawing, 'arc', [cx, cy, outerR, Math.PI, TWO_PI]);

        // Polygon outline.
        const polyPts: number[] = [];
        for (let index = 0; index <= sides; index++) {
            const angle = rotation + (index / sides) * TWO_PI;
            polyPts.push(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
        }
        this.#add(drawing, 'polyline', polyPts);

        // Inscribed circle.
        this.#add(drawing, 'circle', [cx, cy, innerR]);

        // Construction lines from center to each vertex (dashed, selective).
        const showConstruction = MULBERRY.next() > 0.4;
        if (showConstruction) {
            for (let index = 0; index < sides; index++) {
                const angle = rotation + (index / sides) * TWO_PI;
                this.#add(drawing, 'dashed', [cx, cy, cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR]);
            }
        }

        // Optional second polygon inside, rotated.
        if (complexity > 4 && MULBERRY.next() > 0.5) {
            const innerPoly: number[] = [];
            const rotOffset = Math.PI / sides;
            for (let index = 0; index <= sides; index++) {
                const angle = rotation + rotOffset + (index / sides) * TWO_PI;
                innerPoly.push(cx + Math.cos(angle) * innerR * 0.75, cy + Math.sin(angle) * innerR * 0.75);
            }
            this.#add(drawing, 'polyline', innerPoly);
        }

        // Center mark and dimension.
        const extR = outerR + 14 * s;
        this.#add(drawing, 'dashed', [cx - extR, cy, cx + extR, cy]);
        this.#add(drawing, 'dashed', [cx, cy - extR, cx, cy + extR]);
        this.#add(drawing, 'dimension', [cx - outerR, cy + outerR + dimOff, cx + outerR, cy + outerR + dimOff]);
        this.#add(drawing, 'dimension', [cx - innerR, cy - outerR - dimOff * 0.6, cx + innerR, cy - outerR - dimOff * 0.6]);
    }

    // 3. Rectangular frame with punched cutouts (holes, slots, or pattern).
    #generateFrameWithCutouts(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const complexity = this.#complexity;
        const dimOff = 18 * s;
        const frameW = size * (0.7 + MULBERRY.next() * 0.2);
        const frameH = size * (0.5 + MULBERRY.next() * 0.25);
        const ox = cx - frameW / 2;
        const oy = cy - frameH / 2;

        // Outer frame.
        this.#add(drawing, 'rect', [ox, oy, frameW, frameH]);

        // Dimension lines.
        this.#add(drawing, 'dimension', [ox, oy - dimOff, ox + frameW, oy - dimOff]);
        this.#add(drawing, 'dimension', [ox - dimOff, oy, ox - dimOff, oy + frameH]);

        const cutoutType = Math.floor(MULBERRY.next() * 4);

        if (cutoutType === 0) {
            // Single large circular cutout centered.
            const r = Math.min(frameW, frameH) * (0.22 + MULBERRY.next() * 0.13);
            this.#add(drawing, 'circle', [cx, cy, r]);
            this.#add(drawing, 'dashed', [cx - r * 1.4, cy, cx + r * 1.4, cy]);
            this.#add(drawing, 'dashed', [cx, cy - r * 1.4, cx, cy + r * 1.4]);
            this.#add(drawing, 'dimension', [cx - r, cy + r + dimOff * 0.55, cx + r, cy + r + dimOff * 0.55]);

        } else if (cutoutType === 1) {
            // Rectangular slot centered.
            const slotW = frameW * (0.28 + MULBERRY.next() * 0.2);
            const slotH = frameH * (0.28 + MULBERRY.next() * 0.2);
            this.#add(drawing, 'rect', [cx - slotW / 2, cy - slotH / 2, slotW, slotH]);
            this.#add(drawing, 'dashed', [cx, oy - 10 * s, cx, oy + frameH + 10 * s]);
            this.#add(drawing, 'dimension', [cx - slotW / 2, cy + frameH / 2 + dimOff * 0.55, cx + slotW / 2, cy + frameH / 2 + dimOff * 0.55]);

        } else if (cutoutType === 2) {
            // Row of evenly-spaced holes.
            const count = 2 + Math.floor(MULBERRY.next() * Math.min(complexity, 4));
            const spacing = frameW / (count + 1);
            const r = Math.min(spacing * 0.28, frameH * 0.2);
            for (let index = 0; index < count; index++) {
                const hx = ox + spacing * (index + 1);
                this.#add(drawing, 'circle', [hx, cy, r]);
            }
            this.#add(drawing, 'dashed', [cx, cy - r * 1.4, cx, cy + r * 1.4]);

        } else {
            // Grid of small holes.
            const cols = 2 + Math.floor(MULBERRY.next() * 3);
            const rows = 2 + Math.floor(MULBERRY.next() * 2);
            const hSpacing = frameW / (cols + 1);
            const vSpacing = frameH / (rows + 1);
            const r = Math.min(hSpacing, vSpacing) * 0.2;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    this.#add(drawing, 'circle', [ox + hSpacing * (col + 1), oy + vSpacing * (row + 1), r]);
                }
            }
        }

        // Corner notches (optional).
        if (complexity > 4 && MULBERRY.next() > 0.5) {
            const notchSize = size * 0.04;
            this.#add(drawing, 'line', [ox + notchSize, oy, ox, oy + notchSize]);
            this.#add(drawing, 'line', [ox + frameW - notchSize, oy, ox + frameW, oy + notchSize]);
            this.#add(drawing, 'line', [ox + notchSize, oy + frameH, ox, oy + frameH - notchSize]);
            this.#add(drawing, 'line', [ox + frameW - notchSize, oy + frameH, ox + frameW, oy + frameH - notchSize]);
        }
    }

    // 4. Radial array — central element with smaller elements arranged around it.
    #generateRadialArray(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const complexity = this.#complexity;
        const dimOff = 18 * s;
        const outerR = size * 0.42;
        const arrayR = outerR * (0.62 + MULBERRY.next() * 0.12);
        const centerR = outerR * (0.12 + MULBERRY.next() * 0.08);
        const elemCount = 4 + Math.floor(MULBERRY.next() * Math.min(complexity, 5));
        const elemType = Math.floor(MULBERRY.next() * 3);
        const elemSize = outerR * (0.08 + MULBERRY.next() * 0.06);
        const rotation = MULBERRY.next() * TWO_PI;

        // Outer boundary and center hub.
        this.#add(drawing, 'circle', [cx, cy, outerR]);
        this.#add(drawing, 'circle', [cx, cy, centerR]);

        // Array PCD (split dashed arcs).
        this.#add(drawing, 'arc', [cx, cy, arrayR, 0, Math.PI]);
        this.#add(drawing, 'arc', [cx, cy, arrayR, Math.PI, TWO_PI]);

        // Elements arranged radially.
        for (let index = 0; index < elemCount; index++) {
            const angle = rotation + (index / elemCount) * TWO_PI;
            const ex = cx + Math.cos(angle) * arrayR;
            const ey = cy + Math.sin(angle) * arrayR;

            if (elemType === 0) {
                this.#add(drawing, 'circle', [ex, ey, elemSize]);
            } else if (elemType === 1) {
                this.#add(drawing, 'rect', [ex - elemSize, ey - elemSize, elemSize * 2, elemSize * 2]);
            } else {
                // Arc element.
                this.#add(drawing, 'arc', [ex, ey, elemSize, angle - Math.PI * 0.7, angle + Math.PI * 0.7]);
            }

            // Radial spoke (every other element).
            if (index % 2 === 0) {
                this.#add(drawing, 'dashed', [
                    cx + Math.cos(angle) * centerR,
                    cy + Math.sin(angle) * centerR,
                    ex,
                    ey,
                ]);
            }
        }

        // Extended center cross.
        const extR = outerR + 14 * s;
        this.#add(drawing, 'dashed', [cx - extR, cy, cx + extR, cy]);
        this.#add(drawing, 'dashed', [cx, cy - extR, cx, cy + extR]);

        // Dimensions.
        this.#add(drawing, 'dimension', [cx - outerR, cy + outerR + dimOff, cx + outerR, cy + outerR + dimOff]);
        this.#add(drawing, 'dimension', [cx, cy, cx + arrayR, cy - dimOff * 0.5]);
    }

    // 5. Stepped cross-section profile (L, T, U, or Z shape) with hatch.
    #generateProfile(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const dimOff = 18 * s;
        const profileType = Math.floor(MULBERRY.next() * 4);
        const w = size * (0.55 + MULBERRY.next() * 0.2);
        const h = size * (0.5 + MULBERRY.next() * 0.2);
        const t = w * (0.14 + MULBERRY.next() * 0.08);  // Wall thickness.
        const ox = cx - w / 2;
        const oy = cy - h / 2;
        let pts: number[] = [];

        if (profileType === 0) {
            // L-shape.
            pts = [
                ox, oy,
                ox + w, oy,
                ox + w, oy + t,
                ox + t, oy + t,
                ox + t, oy + h,
                ox, oy + h,
                ox, oy,
            ];
        } else if (profileType === 1) {
            // T-shape (flange on top).
            const webW = w * 0.22;
            const flangeH = h * 0.18;
            const webX = cx - webW / 2;
            pts = [
                ox, oy,
                ox + w, oy,
                ox + w, oy + flangeH,
                webX + webW, oy + flangeH,
                webX + webW, oy + h,
                webX, oy + h,
                webX, oy + flangeH,
                ox, oy + flangeH,
                ox, oy,
            ];
            this.#add(drawing, 'dashed', [cx, oy - 10 * s, cx, oy + h + 10 * s]);
        } else if (profileType === 2) {
            // U-shape (channel).
            pts = [
                ox, oy,
                ox + t, oy,
                ox + t, oy + h - t,
                ox + w - t, oy + h - t,
                ox + w - t, oy,
                ox + w, oy,
                ox + w, oy + h,
                ox, oy + h,
                ox, oy,
            ];
            this.#add(drawing, 'dashed', [cx, oy - 10 * s, cx, oy + h + 10 * s]);
        } else {
            // Z / S-shape.
            const midY = cy;
            pts = [
                ox, oy,
                ox + w * 0.65, oy,
                ox + w * 0.65, midY,
                ox + w, midY,
                ox + w, oy + h,
                ox + w * 0.35, oy + h,
                ox + w * 0.35, midY,
                ox, midY,
                ox, oy,
            ];
        }

        this.#add(drawing, 'polyline', pts);

        // Cross-section hatch (diagonal lines inside the profile area).
        const hatchSpacing = 7 * s;
        const hatchDiag = w + h;
        for (let hd = 0; hd < hatchDiag; hd += hatchSpacing) {
            const hx1 = ox + hd;
            const hy1 = oy;
            const hx2 = ox;
            const hy2 = oy + hd;
            // Clip to bounding box (approximate — full lines across the box).
            const clipX1 = Math.max(hx1, ox);
            const clipX2 = Math.min(hx1 + h, ox + w);
            if (clipX2 > clipX1) {
                this.#add(drawing, 'line', [clipX1, hy1 + (clipX1 - hx1), clipX2, hy1 + (clipX2 - hx1)]);
            }
            void hx2; void hy2;
        }

        // Dimensions.
        this.#add(drawing, 'dimension', [ox, oy - dimOff, ox + w, oy - dimOff]);
        this.#add(drawing, 'dimension', [ox - dimOff, oy, ox - dimOff, oy + h]);
        this.#add(drawing, 'dimension', [ox, oy + h + dimOff * 0.6, ox + t, oy + h + dimOff * 0.6]);
    }

    // 6. Geometric construction — compass/ruler style intersecting arcs and lines.
    #generateConstruction(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const complexity = this.#complexity;
        const dimOff = 18 * s;
        const span = size * (0.55 + MULBERRY.next() * 0.2);

        // Base line AB.
        const ax = cx - span / 2;
        const ay = cy;
        const bx = cx + span / 2;
        const by = cy;
        this.#add(drawing, 'line', [ax - 10 * s, ay, bx + 10 * s, by]);

        // Arcs from A and B intersecting above and below (perpendicular bisector).
        const arcR = span * (0.55 + MULBERRY.next() * 0.1);
        this.#add(drawing, 'arc', [ax, ay, arcR, -Math.PI * 0.75, Math.PI * 0.75]);
        this.#add(drawing, 'arc', [bx, by, arcR, Math.PI * 0.25, Math.PI * 1.75]);

        // Perpendicular bisector through intersection points.
        const bisectH = Math.sqrt(arcR * arcR - (span / 2) * (span / 2));
        const topY = ay - bisectH;
        const botY = ay + bisectH;
        if (!isNaN(bisectH)) {
            this.#add(drawing, 'dashed', [cx, topY - 10 * s, cx, botY + 10 * s]);
            // Small circles marking intersection points.
            this.#add(drawing, 'circle', [cx, topY, 3 * s]);
            this.#add(drawing, 'circle', [cx, botY, 3 * s]);
        }

        // Small circles marking A and B.
        this.#add(drawing, 'circle', [ax, ay, 3 * s]);
        this.#add(drawing, 'circle', [bx, by, 3 * s]);

        // Optional: angle bisection — a third point and its arc.
        if (complexity > 3) {
            const cAngle = MULBERRY.next() * Math.PI * 0.5 - Math.PI * 0.25;
            const cr = span * 0.6;
            const cpx = cx + Math.cos(cAngle) * cr * 0.5;
            const cpy = cy - cr * 0.4;
            this.#add(drawing, 'arc', [cpx, cpy, span * 0.35, cAngle, cAngle + Math.PI * 1.2]);
            this.#add(drawing, 'dashed', [ax, ay, cpx, cpy]);
            this.#add(drawing, 'dashed', [bx, by, cpx, cpy]);
            this.#add(drawing, 'circle', [cpx, cpy, 3 * s]);
        }

        // Dimension of base line.
        this.#add(drawing, 'dimension', [ax, ay + dimOff, bx, by + dimOff]);
        if (!isNaN(bisectH)) {
            this.#add(drawing, 'dimension', [cx - dimOff * 0.5, ay, cx - dimOff * 0.5, topY]);
        }
    }

    // 7. Two orthographic views of the same object connected by projection lines.
    #generateOrthographicViews(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const dimOff = 18 * s;
        const gap = size * 0.12;
        const viewW = size * 0.36;
        const viewH = size * 0.36;

        // Top view (left).
        const tvX = cx - gap / 2 - viewW;
        const tvY = cy - viewH / 2;

        // Front view (right).
        const fvX = cx + gap / 2;
        const fvY = cy - viewH / 2;

        // Decide on a shape: rect with circular cutout, or stepped.
        const shapeType = MULBERRY.next() > 0.5;

        // Top view outline.
        this.#add(drawing, 'rect', [tvX, tvY, viewW, viewH]);

        // Front view outline.
        this.#add(drawing, 'rect', [fvX, fvY, viewW, viewH]);

        if (shapeType) {
            // Circular hole — visible in top view, hidden line in front view.
            const r = Math.min(viewW, viewH) * 0.25;
            const holeCX = tvX + viewW * 0.5;
            const holeCY = tvY + viewH * 0.5;
            this.#add(drawing, 'circle', [holeCX, holeCY, r]);

            // In front view: hidden (dashed) horizontal lines showing the hole depth.
            const fvCX = fvX + viewW * 0.5;
            this.#add(drawing, 'dashed', [fvCX - r, fvY + viewH * 0.3, fvCX + r, fvY + viewH * 0.3]);
            this.#add(drawing, 'dashed', [fvCX - r, fvY + viewH * 0.7, fvCX + r, fvY + viewH * 0.7]);
        } else {
            // Stepped cutout — L-shape in top, step line in front.
            const stepX = tvX + viewW * 0.55;
            const stepY = tvY + viewH * 0.45;
            this.#add(drawing, 'line', [stepX, tvY, stepX, stepY]);
            this.#add(drawing, 'line', [stepX, stepY, tvX + viewW, stepY]);

            // Corresponding step in front view (dashed, hidden).
            const fvStepX = fvX + viewW * (1 - 0.55);
            this.#add(drawing, 'dashed', [fvX, fvY + viewH * 0.45, fvStepX, fvY + viewH * 0.45]);
        }

        // Projection lines between views (thin dashed).
        this.#add(drawing, 'dashed', [tvX + viewW, tvY, fvX, tvY]);
        this.#add(drawing, 'dashed', [tvX + viewW, tvY + viewH, fvX, tvY + viewH]);

        // Dimension lines.
        this.#add(drawing, 'dimension', [tvX, tvY - dimOff, tvX + viewW, tvY - dimOff]);
        this.#add(drawing, 'dimension', [fvX, tvY - dimOff, fvX + viewW, tvY - dimOff]);
        this.#add(drawing, 'dimension', [tvX - dimOff, tvY, tvX - dimOff, tvY + viewH]);
    }

    // 8. Nested geometric shapes with angular offsets and cross-connecting lines.
    #generateNestedShapes(drawing: BlueprintDrawing, cx: number, cy: number, size: number, s: number): void {
        const complexity = this.#complexity;
        const dimOff = 18 * s;
        const layerCount = 2 + Math.floor(MULBERRY.next() * Math.min(complexity - 1, 3));
        const sides = 3 + Math.floor(MULBERRY.next() * 5);
        const maxR = size * 0.42;
        const baseRotation = MULBERRY.next() * TWO_PI;
        const rotationStep = Math.PI / sides;

        for (let layer = 0; layer < layerCount; layer++) {
            const r = maxR * (0.3 + (layer / (layerCount - 1)) * 0.7);
            const rot = baseRotation + layer * rotationStep;

            // Polygon at this layer.
            const pts: number[] = [];
            for (let vertex = 0; vertex <= sides; vertex++) {
                const angle = rot + (vertex / sides) * TWO_PI;
                pts.push(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            }
            this.#add(drawing, 'polyline', pts);

            // Connect vertices of this layer to next layer (selective).
            if (layer < layerCount - 1) {
                const nextR = maxR * (0.3 + ((layer + 1) / (layerCount - 1)) * 0.7);
                const nextRot = baseRotation + (layer + 1) * rotationStep;
                const connectors = Math.floor(MULBERRY.next() * sides);

                for (let conn = 0; conn < connectors; conn++) {
                    const angle1 = rot + (conn / sides) * TWO_PI;
                    const angle2 = nextRot + (conn / sides) * TWO_PI;
                    this.#add(drawing, 'dashed', [
                        cx + Math.cos(angle1) * r, cy + Math.sin(angle1) * r,
                        cx + Math.cos(angle2) * nextR, cy + Math.sin(angle2) * nextR,
                    ]);
                }
            }
        }

        // Center circle.
        this.#add(drawing, 'circle', [cx, cy, maxR * 0.08]);

        // Extended center cross.
        const extR = maxR + 14 * s;
        this.#add(drawing, 'dashed', [cx - extR, cy, cx + extR, cy]);
        this.#add(drawing, 'dashed', [cx, cy - extR, cx, cy + extR]);

        // Dimension.
        this.#add(drawing, 'dimension', [cx - maxR, cy + maxR + dimOff, cx + maxR, cy + maxR + dimOff]);
    }
}
