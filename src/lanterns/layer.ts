import { hexToRGB } from '@basmilius/utils';
import { SimulationLayer } from '../layer';
import { LANTERN_COLORS, MULBERRY } from './consts';
import type { LanternSimulationConfig } from './simulation';
import type { Lantern } from './types';

export class LanternLayer extends SimulationLayer {
    readonly #scale: number;
    readonly #speed: number;
    readonly #size: number;
    readonly #colorRGBs: [number, number, number][];
    #maxCount: number;
    #time: number = 0;
    #lanterns: Lantern[] = [];

    constructor(config: LanternSimulationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxCount = config.count ?? 25;
        this.#size = (config.size ?? 20) * this.#scale;
        this.#speed = config.speed ?? 0.5;

        const colors = config.colors ?? LANTERN_COLORS;
        this.#colorRGBs = colors.map(c => hexToRGB(c));

        if (innerWidth < 991) {
            this.#maxCount = Math.floor(this.#maxCount / 2);
        }

        for (let i = 0; i < this.#maxCount; ++i) {
            this.#lanterns.push(this.#createLantern(true));
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.02 * dt * this.#speed;

        for (let i = 0; i < this.#lanterns.length; i++) {
            const lantern = this.#lanterns[i];

            lantern.y -= (lantern.vy * this.#speed * dt) / (height * 1.5);

            const sway = Math.sin(this.#time * lantern.swaySpeed + lantern.swayPhase) * lantern.swayAmplitude;
            lantern.x += sway / (width * 8);

            if (lantern.y < -0.15) {
                this.#lanterns[i] = this.#createLantern(false);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

        const sorted = [...this.#lanterns].sort((a, b) => a.size - b.size);

        for (const lantern of sorted) {
            const px = lantern.x * width;
            const py = lantern.y * height;
            const size = lantern.size;
            const [r, g, b] = this.#colorRGBs[lantern.colorIndex];

            const glowPulse = 0.6 + 0.4 * Math.sin(this.#time * lantern.glowSpeed + lantern.glowPhase);
            const alpha = lantern.opacity * glowPulse;

            const glowRadius = size * 3;
            const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
            glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`);
            glowGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
            glowGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.05})`);
            glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.translate(px, py);

            const bodyW = size * 0.8;
            const bodyH = size;
            const topW = bodyW * 0.6;

            ctx.beginPath();
            ctx.moveTo(-topW, -bodyH * 0.5);
            ctx.quadraticCurveTo(-bodyW, 0, -bodyW * 0.7, bodyH * 0.5);
            ctx.lineTo(bodyW * 0.7, bodyH * 0.5);
            ctx.quadraticCurveTo(bodyW, 0, topW, -bodyH * 0.5);
            ctx.closePath();

            const bodyGradient = ctx.createLinearGradient(0, -bodyH * 0.5, 0, bodyH * 0.5);
            bodyGradient.addColorStop(0, `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 30)}, ${alpha * 0.9})`);
            bodyGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`);
            bodyGradient.addColorStop(1, `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 20)}, ${alpha * 0.8})`);

            ctx.fillStyle = bodyGradient;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-topW * 0.7, -bodyH * 0.55);
            ctx.lineTo(topW * 0.7, -bodyH * 0.55);
            ctx.lineWidth = size * 0.06;
            ctx.strokeStyle = `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, ${alpha * 0.7})`;
            ctx.stroke();

            const flameH = bodyH * 0.3;
            const flameW = bodyW * 0.15;
            const flameFlicker = Math.sin(this.#time * 8 + lantern.glowPhase) * flameW * 0.3;

            const flameGradient = ctx.createRadialGradient(
                flameFlicker, -flameH * 0.1, 0,
                flameFlicker, -flameH * 0.1, flameH
            );
            flameGradient.addColorStop(0, `rgba(255, 255, 200, ${alpha * 0.95})`);
            flameGradient.addColorStop(0.3, `rgba(255, 200, 80, ${alpha * 0.7})`);
            flameGradient.addColorStop(0.7, `rgba(255, 140, 40, ${alpha * 0.3})`);
            flameGradient.addColorStop(1, `rgba(255, 100, 20, 0)`);

            ctx.beginPath();
            ctx.moveTo(-flameW + flameFlicker, flameH * 0.2);
            ctx.quadraticCurveTo(-flameW * 0.5 + flameFlicker, -flameH * 0.3, flameFlicker, -flameH);
            ctx.quadraticCurveTo(flameW * 0.5 + flameFlicker, -flameH * 0.3, flameW + flameFlicker, flameH * 0.2);
            ctx.closePath();
            ctx.fillStyle = flameGradient;
            ctx.fill();

            const stringLen = size * 0.6;
            const stringDrift = Math.sin(this.#time * 1.5 + lantern.swayPhase) * size * 0.1;

            ctx.beginPath();
            ctx.moveTo(0, bodyH * 0.5);
            ctx.quadraticCurveTo(
                stringDrift,
                bodyH * 0.5 + stringLen * 0.5,
                -stringDrift * 0.5,
                bodyH * 0.5 + stringLen
            );
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`;
            ctx.lineWidth = size * 0.04;
            ctx.stroke();

            ctx.restore();
        }
    }

    #createLantern(initialSpread: boolean): Lantern {
        const colorIndex = Math.floor(MULBERRY.next() * this.#colorRGBs.length);
        const sizeVariation = 0.6 + MULBERRY.next() * 0.8;

        return {
            x: 0.05 + MULBERRY.next() * 0.9,
            y: initialSpread ? MULBERRY.next() * 1.3 : 1.15 + MULBERRY.next() * 0.2,
            vx: 0,
            vy: 0.2 + MULBERRY.next() * 0.6,
            size: this.#size * sizeVariation,
            glowPhase: MULBERRY.next() * Math.PI * 2,
            glowSpeed: 0.8 + MULBERRY.next() * 1.2,
            swayPhase: MULBERRY.next() * Math.PI * 2,
            swaySpeed: 0.4 + MULBERRY.next() * 0.8,
            swayAmplitude: 0.3 + MULBERRY.next() * 0.7,
            colorIndex,
            opacity: 0.7 + MULBERRY.next() * 0.3
        };
    }
}
