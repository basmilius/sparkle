import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { LightningConfig } from './types';
import { LightningSystem } from './system';

export class Lightning extends Effect<LightningConfig> {
    readonly #system: LightningSystem;
    readonly #enableFlash: boolean;

    constructor(config: LightningConfig = {}) {
        super();

        this.#enableFlash = config.flash ?? true;

        const [r, g, b] = hexToRGB(config.color ?? '#b4c8ff');
        this.#system = new LightningSystem(
            {
                frequency: config.frequency ?? 1,
                color: [r, g, b],
                branches: config.branches ?? true,
                flash: this.#enableFlash,
                scale: config.scale ?? 1
            },
            () => MULBERRY.next()
        );
    }

    configure(config: Partial<LightningConfig>): void {
        const frequency = config.frequency;
        const color = config.color !== undefined ? hexToRGB(config.color) as [number, number, number] : undefined;
        const branches = config.branches;
        const flash = config.flash;

        this.#system.update({frequency, color, branches, flash});
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#system.tick(dt);
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        if (this.#system.flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.#system.flashAlpha})`;
            ctx.fillRect(0, 0, width, height);
        }

        this.#system.draw(ctx, width, height);
    }
}
