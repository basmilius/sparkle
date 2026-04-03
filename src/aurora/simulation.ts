import { hexToRGB } from '@basmilius/utils';
import { LimitedFrameRateCanvas } from '../canvas';
import { MULBERRY } from './consts';
import type { AuroraBand, AuroraShootingStar, AuroraStar } from './types';

export interface AuroraSimulationConfig {
    readonly bands?: number;
    readonly colors?: string[];
    readonly speed?: number;
    readonly intensity?: number;
    readonly waveAmplitude?: number;
    readonly verticalPosition?: number;
    readonly scale?: number;
    readonly shootingStars?: boolean;
    readonly shootingInterval?: [number, number];
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const DEFAULT_COLORS = ['#9922ff', '#4455ff', '#0077ee', '#00aabb', '#22ddff'];
const TOP_HUE = 265;

export class AuroraSimulation extends LimitedFrameRateCanvas {
    readonly #speed: number;
    readonly #intensity: number;
    readonly #waveAmplitude: number;
    readonly #verticalPosition: number;
    readonly #shootingStars: boolean;
    readonly #shootingInterval: [number, number];
    #time: number = 0;
    #shootingCooldown: number = 0;
    #bands: AuroraBand[] = [];
    #stars: AuroraStar[] = [];
    #shootingStarsList: AuroraShootingStar[] = [];

    constructor(canvas: HTMLCanvasElement, config: AuroraSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        const bandCount = config.bands ?? 5;
        const colors = config.colors ?? DEFAULT_COLORS;
        this.#speed = config.speed ?? 1;
        this.#intensity = config.intensity ?? 0.8;
        this.#waveAmplitude = config.waveAmplitude ?? 1;
        this.#verticalPosition = config.verticalPosition ?? 0.68;
        this.#shootingStars = config.shootingStars ?? true;
        this.#shootingInterval = config.shootingInterval ?? [300, 600];
        this.#shootingCooldown = this.#shootingInterval[0] + MULBERRY.next() * (this.#shootingInterval[1] - this.#shootingInterval[0]);

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        // Two loose clusters (left + right), rays within each cluster overlap into a whole
        const clusterCenters = [0.35, 0.65];

        for (let i = 0; i < bandCount; i++) {
            const color = colors[i % colors.length];
            const [r, g, b] = hexToRGB(color);
            const hue = this.#rgbToHue(r, g, b);
            const cluster = clusterCenters[i % clusterCenters.length];

            this.#bands.push({
                x: cluster + (MULBERRY.next() - 0.5) * 0.22,
                baseY: this.#verticalPosition + (MULBERRY.next() - 0.5) * 0.08,
                height: 0.5 + MULBERRY.next() * 0.3,
                sigma: 160 + MULBERRY.next() * 110,
                phase1: MULBERRY.next() * Math.PI * 2,
                phase2: MULBERRY.next() * Math.PI * 2,
                amplitude1: 0.015 + MULBERRY.next() * 0.025,
                frequency1: 0.003 + MULBERRY.next() * 0.004,
                speed: (0.4 + MULBERRY.next() * 0.6) * this.#speed,
                hue,
                opacity: (0.5 + MULBERRY.next() * 0.3) * this.#intensity
            });
        }

        for (let i = 0; i < 130; i++) {
            this.#stars.push({
                x: MULBERRY.next(),
                y: MULBERRY.next() * 0.75,
                size: 0.5 + MULBERRY.next() * 1.5,
                opacity: 0.3 + MULBERRY.next() * 0.7,
                twinkleSpeed: 0.5 + MULBERRY.next() * 2,
                twinklePhase: MULBERRY.next() * Math.PI * 2
            });
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;

        // Dark sky background gradient
        const bg = ctx.createLinearGradient(0, 0, 0, this.height);
        bg.addColorStop(0, '#000000');
        bg.addColorStop(0.5, '#050012');
        bg.addColorStop(1, '#0a0025');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, this.width, this.height);

        // Stars with subtle twinkle
        ctx.globalCompositeOperation = 'source-over';

        for (const star of this.#stars) {
            const twinkle = 0.6 + 0.4 * Math.sin(this.#time * star.twinkleSpeed + star.twinklePhase);
            ctx.beginPath();
            ctx.arc(star.x * this.width, star.y * this.height, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
            ctx.fill();
        }

        // Shooting stars
        if (this.#shootingStars) {
            ctx.globalCompositeOperation = 'lighter';

            for (const shooting of this.#shootingStarsList) {
                for (let t = 0; t < shooting.trail.length; t++) {
                    const progress = t / shooting.trail.length;
                    const trailAlpha = shooting.alpha * progress * 0.5;
                    const trailSize = shooting.size * progress;

                    if (trailAlpha < 0.01) {
                        continue;
                    }

                    ctx.globalAlpha = trailAlpha;
                    ctx.beginPath();
                    ctx.arc(shooting.trail[t].x, shooting.trail[t].y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgb(200, 230, 255)';
                    ctx.fill();
                }

                const headSize = shooting.size * 2;
                const glow = ctx.createRadialGradient(shooting.x, shooting.y, 0, shooting.x, shooting.y, headSize);
                glow.addColorStop(0, `rgba(220, 240, 255, ${shooting.alpha})`);
                glow.addColorStop(0.5, `rgba(180, 210, 255, ${shooting.alpha * 0.3})`);
                glow.addColorStop(1, 'rgba(180, 210, 255, 0)');

                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.arc(shooting.x, shooting.y, headSize, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        }

        // Aurora curtain rays — vertical bands with Gaussian horizontal falloff
        ctx.globalCompositeOperation = 'screen';

        const step = 4;
        const scale = this.width / 1920;

        for (const band of this.#bands) {
            const swayX = band.amplitude1 * this.width * Math.sin(band.phase1);
            const cx = band.x * this.width + swayX;
            const baseY = band.baseY * this.height;
            const rayHeight = band.height * this.height * (this.height / 800);
            const sigma = band.sigma * scale;
            const cutoff = sigma * 3.5;
            const sigmaSq2 = 2 * sigma * sigma;
            const midHue = (band.hue + TOP_HUE) / 2;
            const waveRange = this.height * 0.035 * this.#waveAmplitude;

            const xStart = Math.max(0, Math.floor((cx - cutoff) / step) * step);
            const xEnd = Math.min(this.width, Math.ceil((cx + cutoff) / step) * step);

            for (let x = xStart; x < xEnd; x += step) {
                const dx = x - cx;
                const alpha = Math.exp(-dx * dx / sigmaSq2);

                if (alpha < 0.015) {
                    continue;
                }

                const waveOffset = Math.sin(band.frequency1 * x + band.phase2) * waveRange;
                const colBase = baseY + waveOffset;
                const colTop = colBase - rayHeight;
                const fadeBottom = colBase + rayHeight * 0.1;
                const eff = alpha * band.opacity;

                const gradient = ctx.createLinearGradient(0, fadeBottom, 0, colTop);
                gradient.addColorStop(0, `hsla(${band.hue}, 100%, 90%, 0)`);
                gradient.addColorStop(0.04, `hsla(${band.hue}, 100%, 90%, ${eff * 0.55})`);
                gradient.addColorStop(0.1, `hsla(${band.hue}, 90%, 72%, ${eff})`);
                gradient.addColorStop(0.32, `hsla(${band.hue}, 85%, 62%, ${eff * 0.75})`);
                gradient.addColorStop(0.62, `hsla(${midHue}, 80%, 56%, ${eff * 0.35})`);
                gradient.addColorStop(0.86, `hsla(${TOP_HUE}, 75%, 50%, ${eff * 0.12})`);
                gradient.addColorStop(1, `hsla(${TOP_HUE}, 70%, 45%, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(x, colTop, step, fadeBottom - colTop + 1);
            }
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;

        this.#time += 0.016 * dt * this.#speed;

        for (const band of this.#bands) {
            band.phase1 += 0.005 * band.speed * dt;
            band.phase2 += 0.008 * band.speed * dt;
        }

        if (this.#shootingStars) {
            this.#shootingCooldown -= dt;

            if (this.#shootingCooldown <= 0) {
                this.#shootingStarsList.push(this.#createShootingStar());
                this.#shootingCooldown = this.#shootingInterval[0] + MULBERRY.next() * (this.#shootingInterval[1] - this.#shootingInterval[0]);
            }

            let alive = 0;

            for (let i = 0; i < this.#shootingStarsList.length; i++) {
                const shooting = this.#shootingStarsList[i];

                shooting.trail.push({x: shooting.x, y: shooting.y});

                if (shooting.trail.length > 18) {
                    shooting.trail.shift();
                }

                shooting.x += shooting.vx * dt;
                shooting.y += shooting.vy * dt;
                shooting.alpha -= shooting.decay * dt;

                if (shooting.alpha > 0 && shooting.x < this.width + 50 && shooting.y < this.height + 50) {
                    this.#shootingStarsList[alive++] = shooting;
                }
            }

            this.#shootingStarsList.length = alive;
        }
    }

    #createShootingStar(): AuroraShootingStar {
        const startX = MULBERRY.next() * this.width * 0.8;
        const startY = MULBERRY.next() * this.height * 0.4;
        const angle = 0.3 + MULBERRY.next() * 0.5;
        const speed = 8 + MULBERRY.next() * 12;

        return {
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 0.7 + MULBERRY.next() * 0.3,
            size: 1.5 + MULBERRY.next() * 2,
            decay: 0.008 + MULBERRY.next() * 0.01,
            trail: []
        };
    }

    #rgbToHue(r: number, g: number, b: number): number {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        if (delta === 0) {
            return 0;
        }

        let hue: number;

        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }

        hue = Math.round(hue * 60);

        if (hue < 0) {
            hue += 360;
        }

        return hue;
    }
}
