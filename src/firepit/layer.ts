import { SimulationLayer } from '../layer';
import { MULBERRY } from './consts';
import type { FirepitSimulationConfig } from './simulation';
import type { Ember, FlameLayer } from './types';

export class FirepitLayer extends SimulationLayer {
    readonly #scale: number;
    readonly #flameWidth: number;
    readonly #flameHeight: number;
    readonly #intensity: number;
    #maxEmbers: number;
    #time: number = 0;
    #embers: Ember[] = [];
    #flameLayers: FlameLayer[] = [];

    constructor(config: FirepitSimulationConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#maxEmbers = config.embers ?? 60;
        this.#flameWidth = config.flameWidth ?? 0.4;
        this.#flameHeight = config.flameHeight ?? 0.35;
        this.#intensity = config.intensity ?? 1;

        if (innerWidth < 991) {
            this.#maxEmbers = Math.floor(this.#maxEmbers / 2);
        }

        for (let i = 0; i < 5; i++) {
            this.#flameLayers.push({
                x: 0.5 + (MULBERRY.next() - 0.5) * 0.1,
                phase: MULBERRY.next() * Math.PI * 2,
                speed: 1.5 + MULBERRY.next() * 2,
                amplitude: 0.02 + MULBERRY.next() * 0.03,
                width: this.#flameWidth * (0.6 + MULBERRY.next() * 0.4),
                height: this.#flameHeight * (0.7 + MULBERRY.next() * 0.3)
            });
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.03 * dt * this.#intensity;

        if (this.#embers.length < this.#maxEmbers && MULBERRY.next() < 0.3 * this.#intensity * dt) {
            this.#embers.push(this.#createEmber());
        }

        let alive = 0;

        for (let i = 0; i < this.#embers.length; i++) {
            const ember = this.#embers[i];

            ember.x += ember.vx * dt;
            ember.y += ember.vy * dt;
            ember.vx += (MULBERRY.next() - 0.5) * 0.0002 * dt;
            ember.vy -= 0.00005 * dt;
            ember.life -= dt;
            ember.flicker = 0.6 + Math.sin(this.#time * 8 + ember.brightness * 20) * 0.4;

            if (ember.life > 0) {
                this.#embers[alive++] = ember;
            }
        }

        this.#embers.length = alive;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        this.#drawFlames(ctx, width, height);
        this.#drawEmbers(ctx, width, height);
    }

    #drawFlames(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const baseY = height * 0.85;
        const centerX = width * 0.5;

        ctx.globalCompositeOperation = 'lighter';

        for (let layerIndex = 0; layerIndex < this.#flameLayers.length; layerIndex++) {
            const layer = this.#flameLayers[layerIndex];
            const wobbleX = Math.sin(this.#time * layer.speed + layer.phase) * layer.amplitude * width;
            const flameW = layer.width * width * this.#scale * 0.5;
            const flameH = layer.height * height * this.#scale;

            const gradient = ctx.createRadialGradient(
                centerX + wobbleX, baseY, 0,
                centerX + wobbleX, baseY - flameH * 0.5, flameH * 0.6
            );

            const alphaBase = (0.15 + layerIndex * 0.03) * this.#intensity;
            const flicker = 0.85 + Math.sin(this.#time * (3 + layerIndex) + layer.phase) * 0.15;
            const alpha = alphaBase * flicker;

            if (layerIndex < 2) {
                gradient.addColorStop(0, `rgba(255, 255, 200, ${alpha})`);
                gradient.addColorStop(0.3, `rgba(255, 180, 50, ${alpha * 0.8})`);
                gradient.addColorStop(0.6, `rgba(255, 100, 20, ${alpha * 0.5})`);
                gradient.addColorStop(1, `rgba(200, 30, 0, 0)`);
            } else {
                gradient.addColorStop(0, `rgba(255, 200, 80, ${alpha * 0.7})`);
                gradient.addColorStop(0.4, `rgba(255, 120, 30, ${alpha * 0.5})`);
                gradient.addColorStop(1, `rgba(180, 40, 0, 0)`);
            }

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(centerX + wobbleX, baseY, flameW, flameH, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        const glowGradient = ctx.createRadialGradient(
            centerX, height * 0.85, 0,
            centerX, height * 0.85, width * 0.35 * this.#scale
        );
        const glowAlpha = 0.06 * this.#intensity * (0.9 + Math.sin(this.#time * 2) * 0.1);
        glowGradient.addColorStop(0, `rgba(255, 150, 50, ${glowAlpha})`);
        glowGradient.addColorStop(0.5, `rgba(255, 80, 20, ${glowAlpha * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'source-over';
    }

    #drawEmbers(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalCompositeOperation = 'lighter';

        for (const ember of this.#embers) {
            const px = ember.x * width;
            const py = ember.y * height;
            const lifeRatio = ember.life / ember.maxLife;
            const alpha = lifeRatio * ember.flicker * this.#intensity;
            const size = ember.size * this.#scale * (0.5 + lifeRatio * 0.5);

            if (alpha < 0.02) {
                continue;
            }

            const gradient = ctx.createRadialGradient(px, py, 0, px, py, size * 3);
            gradient.addColorStop(0, `rgba(255, ${180 + ember.brightness * 75}, ${50 + ember.brightness * 100}, ${alpha})`);
            gradient.addColorStop(0.3, `rgba(255, ${120 + ember.brightness * 50}, 20, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 80, 0, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(px, py, size * 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, ${200 + ember.brightness * 55}, ${100 + ember.brightness * 100}, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(px, py, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    #createEmber(): Ember {
        const baseY = 0.85;
        const maxLife = 60 + MULBERRY.next() * 120;

        return {
            x: 0.5 + (MULBERRY.next() - 0.5) * this.#flameWidth * 0.6,
            y: baseY - MULBERRY.next() * this.#flameHeight * 0.3,
            vx: (MULBERRY.next() - 0.5) * 0.002,
            vy: -(0.001 + MULBERRY.next() * 0.003),
            size: (1 + MULBERRY.next() * 2.5) * this.#scale,
            life: maxLife,
            maxLife,
            brightness: MULBERRY.next(),
            flicker: 1
        };
    }
}
