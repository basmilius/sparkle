import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { ArmSegment, NeuronCell, SynapticPulse } from './types';

export interface NeuralNetworkConfig {
    readonly speed?: number;
    readonly neurons?: number;
    readonly color?: string;
    readonly pulseColor?: string;
    readonly connectionDistance?: number;
    readonly scale?: number;
}

const TWO_PI = Math.PI * 2;

export class NeuralNetwork extends Effect<NeuralNetworkConfig> {
    #vscale: number;
    #lr: number;
    #lg: number;
    #lb: number;
    #pr: number;
    #pg: number;
    #pb: number;
    readonly #cellCount: number;
    #speed: number;
    #connectionDistance: number;
    #width: number = 0;
    #height: number = 0;
    #cells: NeuronCell[] = [];
    #pulses: SynapticPulse[] = [];

    constructor(config: NeuralNetworkConfig = {}) {
        super();

        this.#vscale = config.scale ?? 1;
        this.#cellCount = config.neurons ?? 16;
        this.#speed = config.speed ?? 1;
        this.#connectionDistance = config.connectionDistance ?? 0;

        const [lr, lg, lb] = hexToRGB(config.color ?? '#4488ff');
        this.#lr = lr;
        this.#lg = lg;
        this.#lb = lb;

        const [pr, pg, pb] = hexToRGB(config.pulseColor ?? '#88ccff');
        this.#pr = pr;
        this.#pg = pg;
        this.#pb = pb;
    }

    configure(config: Partial<NeuralNetworkConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.color !== undefined) {
            const [lr, lg, lb] = hexToRGB(config.color);
            this.#lr = lr;
            this.#lg = lg;
            this.#lb = lb;
        }
        if (config.pulseColor !== undefined) {
            const [pr, pg, pb] = hexToRGB(config.pulseColor);
            this.#pr = pr;
            this.#pg = pg;
            this.#pb = pb;
        }
        if (config.connectionDistance !== undefined) {
            this.#connectionDistance = config.connectionDistance;
            this.#buildCells();
        }
        if (config.scale !== undefined) {
            this.#vscale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        this.#width = width;
        this.#height = height;
        this.#buildCells();
    }

    #buildCells(): void {
        const w = this.#width;
        const h = this.#height;
        const s = this.#vscale;
        const minDim = Math.min(w, h);

        this.#cells = [];
        this.#pulses = [];

        // Scatter cells across the full canvas with modest padding.
        const pad = minDim * 0.06;

        for (let i = 0; i < this.#cellCount; i++) {
            const cx = pad + MULBERRY.next() * (w - pad * 2);
            const cy = pad + MULBERRY.next() * (h - pad * 2);
            const somaRadius = (5 + MULBERRY.next() * 8) * s;
            const armLength = minDim * (0.10 + MULBERRY.next() * 0.13);
            const armCount = 5 + Math.floor(MULBERRY.next() * 4);
            const baseThickness = (2.0 + MULBERRY.next() * 2.0) * s;

            const arms: ArmSegment[] = [];

            for (let j = 0; j < armCount; j++) {
                const angle = (j / armCount) * TWO_PI + (MULBERRY.next() - 0.5) * (TWO_PI / armCount) * 0.7;
                arms.push(this.#buildArm(cx, cy, angle, armLength, baseThickness, 0));
            }

            this.#cells.push({
                x: cx,
                y: cy,
                somaRadius,
                brightness: 0.18 + MULBERRY.next() * 0.12,
                glowTimer: 0,
                fireTimer: MULBERRY.next() * 4,
                fireInterval: 2.0 + MULBERRY.next() * 3.0,
                arms,
                connections: [],
            });
        }

        // Connect nearby cells.
        const maxDist = this.#connectionDistance > 0 ? this.#connectionDistance : Math.max(w, h) * 0.45;

        for (let i = 0; i < this.#cells.length; i++) {
            const ca = this.#cells[i];

            for (let j = i + 1; j < this.#cells.length; j++) {
                const cb = this.#cells[j];
                const dx = ca.x - cb.x;
                const dy = ca.y - cb.y;

                if (dx * dx + dy * dy <= maxDist * maxDist && MULBERRY.next() < 0.65) {
                    ca.connections.push(j);
                    cb.connections.push(i);
                }
            }
        }
    }

    #buildArm(
        fromX: number,
        fromY: number,
        angle: number,
        length: number,
        thickness: number,
        depth: number
    ): ArmSegment {
        const len = length * (0.7 + MULBERRY.next() * 0.6);
        const curve = (MULBERRY.next() - 0.5) * len * 0.55;
        const perpX = -Math.sin(angle);
        const perpY = Math.cos(angle);
        const toX = fromX + Math.cos(angle) * len;
        const toY = fromY + Math.sin(angle) * len;
        const cpX = fromX + Math.cos(angle) * len * 0.5 + perpX * curve;
        const cpY = fromY + Math.sin(angle) * len * 0.5 + perpY * curve;

        const children: ArmSegment[] = [];

        if (depth < 2) {
            const childCount = depth === 0
                ? 2 + Math.floor(MULBERRY.next() * 2)
                : 1 + Math.floor(MULBERRY.next() * 2);
            const spread = depth === 0 ? 0.55 : 0.45;

            for (let k = 0; k < childCount; k++) {
                const offset = (k - (childCount - 1) / 2) * spread + (MULBERRY.next() - 0.5) * 0.15;
                children.push(this.#buildArm(
                    toX,
                    toY,
                    angle + offset,
                    len * (0.40 + MULBERRY.next() * 0.25),
                    thickness * (depth === 0 ? 0.50 : 0.60),
                    depth + 1
                ));
            }
        }

        return { toX, toY, cpX, cpY, thickness, children };
    }

    tick(dt: number): void {
        const dtSec = (dt / 1000) * this.#speed;

        for (let i = 0; i < this.#cells.length; i++) {
            const cell = this.#cells[i];

            // Spontaneous firing rhythm.
            cell.fireTimer -= dtSec;

            if (cell.fireTimer <= 0) {
                cell.fireTimer = cell.fireInterval;
                this.#fireCell(i);
            }

            // Decay glow.
            if (cell.glowTimer > 0) {
                cell.glowTimer = Math.max(0, cell.glowTimer - dtSec);
            }

            const target = cell.glowTimer > 0 ? 1.0 : 0.18;
            cell.brightness += (target - cell.brightness) * Math.min(1, dtSec * 4);
        }

        // Advance pulses with in-place compaction.
        let write = 0;

        for (let i = 0; i < this.#pulses.length; i++) {
            const pulse = this.#pulses[i];
            pulse.t += dtSec * 0.9;

            if (pulse.t >= 1) {
                this.#fireCell(pulse.toCell);
                continue;
            }

            this.#pulses[write++] = pulse;
        }

        this.#pulses.length = write;
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        this.#drawConnections(ctx);
        this.#drawCells(ctx);
    }

    #drawConnections(ctx: CanvasRenderingContext2D): void {
        const lr = this.#lr;
        const lg = this.#lg;
        const lb = this.#lb;
        const pr = this.#pr;
        const pg = this.#pg;
        const pb = this.#pb;
        const s = this.#vscale;

        // Thin inter-cell threads.
        for (let i = 0; i < this.#cells.length; i++) {
            const ca = this.#cells[i];

            for (const j of ca.connections) {
                if (j <= i) continue;

                const cb = this.#cells[j];
                const opacity = ((ca.brightness + cb.brightness) / 2) * 0.22;

                ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${opacity})`;
                ctx.lineWidth = 1.2 * s;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(ca.x, ca.y);
                ctx.lineTo(cb.x, cb.y);
                ctx.stroke();
            }
        }

        // Draw active pulses.
        for (const pulse of this.#pulses) {
            const t = pulse.t;
            const mt = 1 - t;
            const px = mt * mt * pulse.fromX + 2 * mt * t * pulse.cpX + t * t * pulse.toX;
            const py = mt * mt * pulse.fromY + 2 * mt * t * pulse.cpY + t * t * pulse.toY;
            const size = 10 * s;

            const grad = ctx.createRadialGradient(px, py, 0, px, py, size);
            grad.addColorStop(0, `rgba(255, 255, 255, 0.95)`);
            grad.addColorStop(0.2, `rgba(${pr}, ${pg}, ${pb}, 0.7)`);
            grad.addColorStop(1, `rgba(${pr}, ${pg}, ${pb}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, TWO_PI);
            ctx.fill();
        }
    }

    #drawCells(ctx: CanvasRenderingContext2D): void {
        for (const cell of this.#cells) {
            this.#drawCell(ctx, cell);
        }
    }

    #drawCell(ctx: CanvasRenderingContext2D, cell: NeuronCell): void {
        const b = cell.brightness;

        // Draw all arms radiating from soma.
        for (const arm of cell.arms) {
            this.#drawArm(ctx, cell.x, cell.y, arm, b);
        }

        // Soma — layered radial gradient glow.
        const r = cell.somaRadius;
        const glow = r * (1.5 + b * 3.0);

        const grad = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, glow);
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, b * 1.1)})`);
        grad.addColorStop(0.12, `rgba(${this.#pr}, ${this.#pg}, ${this.#pb}, ${b * 0.9})`);
        grad.addColorStop(0.35, `rgba(${this.#lr}, ${this.#lg}, ${this.#lb}, ${b * 0.45})`);
        grad.addColorStop(1, `rgba(${this.#lr}, ${this.#lg}, ${this.#lb}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, glow, 0, TWO_PI);
        ctx.fill();
    }

    #drawArm(
        ctx: CanvasRenderingContext2D,
        fromX: number,
        fromY: number,
        arm: ArmSegment,
        brightness: number
    ): void {
        const lr = this.#lr;
        const lg = this.#lg;
        const lb = this.#lb;

        // Outer glow pass — wide and faint.
        ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${brightness * 0.12})`;
        ctx.lineWidth = arm.thickness * 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(arm.cpX, arm.cpY, arm.toX, arm.toY);
        ctx.stroke();

        // Mid glow.
        ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${brightness * 0.35})`;
        ctx.lineWidth = arm.thickness * 2.2;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(arm.cpX, arm.cpY, arm.toX, arm.toY);
        ctx.stroke();

        // Bright core.
        ctx.strokeStyle = `rgba(${this.#pr}, ${this.#pg}, ${this.#pb}, ${brightness * 0.80})`;
        ctx.lineWidth = arm.thickness;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(arm.cpX, arm.cpY, arm.toX, arm.toY);
        ctx.stroke();

        // Recurse for children.
        for (const child of arm.children) {
            this.#drawArm(ctx, arm.toX, arm.toY, child, brightness);
        }
    }

    #fireCell(index: number): void {
        const cell = this.#cells[index];

        if (cell.glowTimer > 0.1) return;

        cell.glowTimer = 0.55;
        cell.brightness = 1.0;

        for (const connIdx of cell.connections) {
            if (MULBERRY.next() > 0.4) continue;

            const target = this.#cells[connIdx];
            const dx = target.x - cell.x;
            const dy = target.y - cell.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const curve = (MULBERRY.next() - 0.5) * len * 0.3;

            this.#pulses.push({
                toCell: connIdx,
                fromX: cell.x,
                fromY: cell.y,
                toX: target.x,
                toY: target.y,
                cpX: (cell.x + target.x) / 2 + (-dy / len) * curve,
                cpY: (cell.y + target.y) / 2 + (dx / len) * curve,
                t: 0,
            });
        }
    }
}
