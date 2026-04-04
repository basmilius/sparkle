import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { FluidCell } from './types';

export interface FluidConfig {
    readonly speed?: number;
    readonly resolution?: number;
    readonly colors?: string[];
    readonly viscosity?: number;
    readonly diffusion?: number;
    readonly mouseForce?: number;
    readonly scale?: number;
}

const DEFAULT_COLORS = ['#ff3366', '#33ccff', '#66ff33', '#ff9933', '#cc33ff'];

export class Fluid extends Effect<FluidConfig> {
    #speed: number;
    #resolution: number;
    #viscosity: number;
    #diffusion: number;
    #mouseForce: number;
    #scale: number;
    readonly #colorsRGB: [number, number, number][];
    readonly #onMouseMoveBound: (evt: MouseEvent) => void;
    readonly #onMouseLeaveBound: () => void;
    #time: number = 0;
    #gridWidth: number = 0;
    #gridHeight: number = 0;
    #vx: Float32Array = new Float32Array(0);
    #vy: Float32Array = new Float32Array(0);
    #dyeR: Float32Array = new Float32Array(0);
    #dyeG: Float32Array = new Float32Array(0);
    #dyeB: Float32Array = new Float32Array(0);
    #tmpR: Float32Array = new Float32Array(0);
    #tmpG: Float32Array = new Float32Array(0);
    #tmpB: Float32Array = new Float32Array(0);
    #tmpVx: Float32Array = new Float32Array(0);
    #tmpVy: Float32Array = new Float32Array(0);
    #mouseX: number = -1;
    #mouseY: number = -1;
    #mousePrevX: number = -1;
    #mousePrevY: number = -1;
    #mouseOnCanvas: boolean = false;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #imageData: ImageData | null = null;
    #dyeSourceTimer: number = 0;
    #initialized: boolean = false;

    constructor(config: FluidConfig = {}) {
        super();

        this.#speed = config.speed ?? 1;
        this.#resolution = config.resolution ?? 128;
        this.#viscosity = config.viscosity ?? 0.5;
        this.#diffusion = config.diffusion ?? 0.5;
        this.#mouseForce = config.mouseForce ?? 1;
        this.#scale = config.scale ?? 1;
        this.#colorsRGB = (config.colors ?? DEFAULT_COLORS).map((color) => hexToRGB(color));

        this.#onMouseMoveBound = this.#onMouseMove.bind(this);
        this.#onMouseLeaveBound = this.#onMouseLeave.bind(this);
    }

    configure(config: Partial<FluidConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.viscosity !== undefined) {
            this.#viscosity = config.viscosity;
        }
        if (config.diffusion !== undefined) {
            this.#diffusion = config.diffusion;
        }
        if (config.mouseForce !== undefined) {
            this.#mouseForce = config.mouseForce;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    onResize(width: number, height: number): void {
        const resolution = this.#resolution;
        const aspect = width / height;
        this.#gridWidth = Math.ceil(resolution * aspect);
        this.#gridHeight = resolution;

        const total = this.#gridWidth * this.#gridHeight;
        this.#vx = new Float32Array(total);
        this.#vy = new Float32Array(total);
        this.#dyeR = new Float32Array(total);
        this.#dyeG = new Float32Array(total);
        this.#dyeB = new Float32Array(total);
        this.#tmpR = new Float32Array(total);
        this.#tmpG = new Float32Array(total);
        this.#tmpB = new Float32Array(total);
        this.#tmpVx = new Float32Array(total);
        this.#tmpVy = new Float32Array(total);

        this.#offscreen = null;
        this.#offscreenCtx = null;
        this.#imageData = null;
        this.#initialized = true;
    }

    onMount(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('mousemove', this.#onMouseMoveBound, {passive: true});
        canvas.addEventListener('mouseleave', this.#onMouseLeaveBound, {passive: true});
    }

    onUnmount(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.#onMouseMoveBound);
        canvas.removeEventListener('mouseleave', this.#onMouseLeaveBound);
    }

    tick(dt: number, width: number, height: number): void {
        if (!this.#initialized) {
            return;
        }

        const speed = this.#speed;
        const gridW = this.#gridWidth;
        const gridH = this.#gridHeight;
        const dtNorm = (dt / 16.667) * speed;

        this.#time += 0.01 * dtNorm;

        // Add gentle autonomous flow field.
        const time = this.#time;
        const flowStrength = 0.02 * dtNorm;

        for (let gy = 1; gy < gridH - 1; gy++) {
            for (let gx = 1; gx < gridW - 1; gx++) {
                const idx = gy * gridW + gx;
                const nx = gx / gridW;
                const ny = gy / gridH;

                const flowX = Math.sin(ny * 3 + time * 0.7) * Math.cos(nx * 2.5 + time * 0.5)
                    + Math.sin((nx + ny) * 2 + time * 1.1) * 0.4;
                const flowY = Math.cos(nx * 3 + time * 0.6) * Math.sin(ny * 2.5 + time * 0.8)
                    + Math.cos((nx - ny) * 1.5 + time * 0.9) * 0.4;

                this.#vx[idx] += flowX * flowStrength;
                this.#vy[idx] += flowY * flowStrength;
            }
        }

        // Apply mouse force.
        if (this.#mouseOnCanvas && this.#mousePrevX >= 0) {
            const dx = this.#mouseX - this.#mousePrevX;
            const dy = this.#mouseY - this.#mousePrevY;
            const mouseGridX = (this.#mouseX / width) * gridW;
            const mouseGridY = (this.#mouseY / height) * gridH;
            const radius = 4 * this.#scale;
            const force = this.#mouseForce;

            const minGy = Math.max(1, Math.floor(mouseGridY - radius));
            const maxGy = Math.min(gridH - 1, Math.ceil(mouseGridY + radius));
            const minGx = Math.max(1, Math.floor(mouseGridX - radius));
            const maxGx = Math.min(gridW - 1, Math.ceil(mouseGridX + radius));

            for (let gy = minGy; gy < maxGy; gy++) {
                for (let gx = minGx; gx < maxGx; gx++) {
                    const distX = gx - mouseGridX;
                    const distY = gy - mouseGridY;
                    const dist = Math.sqrt(distX * distX + distY * distY);

                    if (dist < radius) {
                        const falloff = (1 - dist / radius);
                        const falloffSq = falloff * falloff;
                        const idx = gy * gridW + gx;
                        this.#vx[idx] += dx * force * falloffSq * 0.3;
                        this.#vy[idx] += dy * force * falloffSq * 0.3;

                        const colorIdx = Math.floor(this.#time * 1.5) % this.#colorsRGB.length;
                        const [cr, cg, cb] = this.#colorsRGB[colorIdx];
                        const dyeAmount = falloffSq * 80;
                        this.#dyeR[idx] = Math.min(255, this.#dyeR[idx] + cr / 255 * dyeAmount);
                        this.#dyeG[idx] = Math.min(255, this.#dyeG[idx] + cg / 255 * dyeAmount);
                        this.#dyeB[idx] = Math.min(255, this.#dyeB[idx] + cb / 255 * dyeAmount);
                    }
                }
            }
        }

        this.#mousePrevX = this.#mouseX;
        this.#mousePrevY = this.#mouseY;

        // Periodically add dye sources.
        this.#dyeSourceTimer += dtNorm;

        if (this.#dyeSourceTimer > 3) {
            this.#dyeSourceTimer = 0;
            this.#addDyeSource();
        }

        // Diffuse velocity.
        this.#diffuseField(this.#vx, this.#tmpVx, this.#diffusion * 0.3, gridW, gridH);
        this.#diffuseField(this.#vy, this.#tmpVy, this.#diffusion * 0.3, gridW, gridH);

        // Advect velocity.
        this.#advectField(this.#vx, this.#tmpVx, gridW, gridH);
        this.#advectField(this.#vy, this.#tmpVy, gridW, gridH);

        // Advect dye.
        this.#advectField(this.#dyeR, this.#tmpR, gridW, gridH);
        this.#advectField(this.#dyeG, this.#tmpG, gridW, gridH);
        this.#advectField(this.#dyeB, this.#tmpB, gridW, gridH);

        // Damping.
        const velDamping = Math.pow(1 - this.#viscosity * 0.05, dtNorm);
        const dyeFade = Math.pow(0.997, dtNorm);

        for (let idx = 0; idx < gridW * gridH; idx++) {
            this.#vx[idx] *= velDamping;
            this.#vy[idx] *= velDamping;
            this.#dyeR[idx] *= dyeFade;
            this.#dyeG[idx] *= dyeFade;
            this.#dyeB[idx] *= dyeFade;
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        if (!this.#initialized) {
            return;
        }

        const gridW = this.#gridWidth;
        const gridH = this.#gridHeight;

        if (!this.#offscreen || this.#offscreen.width !== gridW || this.#offscreen.height !== gridH) {
            this.#offscreen = document.createElement('canvas');
            this.#offscreen.width = gridW;
            this.#offscreen.height = gridH;
            this.#offscreenCtx = this.#offscreen.getContext('2d');
            this.#imageData = this.#offscreenCtx!.createImageData(gridW, gridH);
        }

        const data = this.#imageData!.data;

        for (let idx = 0; idx < gridW * gridH; idx++) {
            const offset = idx * 4;
            data[offset] = Math.min(255, Math.max(0, this.#dyeR[idx] | 0));
            data[offset + 1] = Math.min(255, Math.max(0, this.#dyeG[idx] | 0));
            data[offset + 2] = Math.min(255, Math.max(0, this.#dyeB[idx] | 0));
            data[offset + 3] = 255;
        }

        this.#offscreenCtx!.putImageData(this.#imageData!, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(this.#offscreen!, 0, 0, width, height);
    }

    #addDyeSource(): void {
        const gridW = this.#gridWidth;
        const gridH = this.#gridHeight;
        const sourceX = 2 + Math.floor(MULBERRY.next() * (gridW - 4));
        const sourceY = 2 + Math.floor(MULBERRY.next() * (gridH - 4));
        const colorIdx = Math.floor(MULBERRY.next() * this.#colorsRGB.length);
        const [cr, cg, cb] = this.#colorsRGB[colorIdx];
        const radius = 4 + MULBERRY.next() * 6;

        const minGy = Math.max(1, Math.floor(sourceY - radius));
        const maxGy = Math.min(gridH - 1, Math.ceil(sourceY + radius));
        const minGx = Math.max(1, Math.floor(sourceX - radius));
        const maxGx = Math.min(gridW - 1, Math.ceil(sourceX + radius));

        for (let gy = minGy; gy < maxGy; gy++) {
            for (let gx = minGx; gx < maxGx; gx++) {
                const distX = gx - sourceX;
                const distY = gy - sourceY;
                const dist = Math.sqrt(distX * distX + distY * distY);

                if (dist < radius) {
                    const falloff = 1 - dist / radius;
                    const amount = falloff * falloff * 180;
                    const idx = gy * gridW + gx;
                    this.#dyeR[idx] = Math.min(255, this.#dyeR[idx] + (cr / 255) * amount);
                    this.#dyeG[idx] = Math.min(255, this.#dyeG[idx] + (cg / 255) * amount);
                    this.#dyeB[idx] = Math.min(255, this.#dyeB[idx] + (cb / 255) * amount);
                }
            }
        }
    }

    #diffuseField(field: Float32Array, tmp: Float32Array, amount: number, gridW: number, gridH: number): void {
        const alpha = amount;
        const beta = 1 + 4 * alpha;

        tmp.set(field);

        for (let iter = 0; iter < 4; iter++) {
            for (let gy = 1; gy < gridH - 1; gy++) {
                for (let gx = 1; gx < gridW - 1; gx++) {
                    const idx = gy * gridW + gx;
                    field[idx] = (tmp[idx] + alpha * (
                        field[idx - 1] + field[idx + 1] +
                        field[(gy - 1) * gridW + gx] + field[(gy + 1) * gridW + gx]
                    )) / beta;
                }
            }
        }
    }

    #advectField(field: Float32Array, tmp: Float32Array, gridW: number, gridH: number): void {
        tmp.set(field);

        for (let gy = 1; gy < gridH - 1; gy++) {
            for (let gx = 1; gx < gridW - 1; gx++) {
                const idx = gy * gridW + gx;

                // Trace back using velocity.
                let srcX = gx - this.#vx[idx] * 0.5;
                let srcY = gy - this.#vy[idx] * 0.5;

                srcX = Math.max(0.5, Math.min(gridW - 1.5, srcX));
                srcY = Math.max(0.5, Math.min(gridH - 1.5, srcY));

                const x0 = srcX | 0;
                const y0 = srcY | 0;
                const sx = srcX - x0;
                const sy = srcY - y0;

                const i00 = y0 * gridW + x0;
                const i10 = i00 + 1;
                const i01 = i00 + gridW;
                const i11 = i01 + 1;

                field[idx] = (tmp[i00] * (1 - sx) + tmp[i10] * sx) * (1 - sy)
                    + (tmp[i01] * (1 - sx) + tmp[i11] * sx) * sy;
            }
        }
    }

    #onMouseMove(evt: MouseEvent): void {
        const target = evt.currentTarget as HTMLCanvasElement;
        const rect = target.getBoundingClientRect();
        this.#mouseX = evt.clientX - rect.left;
        this.#mouseY = evt.clientY - rect.top;
        this.#mouseOnCanvas = true;
    }

    #onMouseLeave(): void {
        this.#mouseOnCanvas = false;
        this.#mousePrevX = -1;
        this.#mousePrevY = -1;
    }
}
