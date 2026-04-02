import './style.css';

import { AuroraSimulation, BalloonSimulation, BubbleSimulation, ConfettiSimulation, DonutSimulation, FIREWORK_VARIANTS, FireflySimulation, FireworkSimulation, ParticleSimulation, RainSimulation, SnowSimulation, SparklerSimulation, StarSimulation } from '@basmilius/sparkle';
import type { FireworkVariant } from '@basmilius/sparkle';

type Effect = 'aurora' | 'balloons' | 'bubbles' | 'confetti' | 'donuts' | 'fireflies' | 'fireworks' | 'fireworks-lab' | 'particles' | 'rain' | 'snow' | 'sparklers' | 'stars';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const variantGrid = document.getElementById('variant-grid') as HTMLDivElement;

let active: { stop(): void; destroy(): void } | null = null;
let clickHandler: ((evt: MouseEvent) => void) | null = null;

function start(effect: Effect): void {
    active?.destroy();
    active = null;
    variantGrid.hidden = true;
    variantGrid.innerHTML = '';

    if (clickHandler) {
        canvas.removeEventListener('click', clickHandler);
        clickHandler = null;
    }

    switch (effect) {
        case 'confetti': {
            const sim = new ConfettiSimulation(canvas);

            clickHandler = (evt: MouseEvent) => {
                sim.fire({
                    angle: 90,
                    spread: 60,
                    particles: 150,
                    startVelocity: 45,
                    x: evt.clientX / innerWidth,
                    y: evt.clientY / innerHeight
                });
            };

            canvas.addEventListener('click', clickHandler, {passive: true});
            active = sim;
            break;
        }
        case 'fireworks': {
            const sim = new FireworkSimulation(canvas, {scale: 1});
            sim.start();
            active = sim;
            break;
        }
        case 'fireworks-lab': {
            const sim = new FireworkSimulation(canvas, {scale: 1, autoSpawn: false});
            sim.start();
            active = sim;

            for (const variant of FIREWORK_VARIANTS) {
                const btn = document.createElement('button');
                btn.textContent = variant;
                btn.addEventListener('click', () => {
                    sim.fireExplosion(variant as FireworkVariant, {
                        x: innerWidth * 0.2 + Math.random() * innerWidth * 0.6,
                        y: innerHeight * 0.15 + Math.random() * innerHeight * 0.35
                    });
                }, {passive: true});
                variantGrid.appendChild(btn);
            }

            variantGrid.hidden = false;

            clickHandler = (evt: MouseEvent) => {
                sim.fireExplosion(
                    FIREWORK_VARIANTS[Math.floor(Math.random() * FIREWORK_VARIANTS.length)] as FireworkVariant,
                    {x: evt.clientX, y: evt.clientY}
                );
            };

            canvas.addEventListener('click', clickHandler, {passive: true});
            break;
        }
        case 'donuts': {
            const sim = new DonutSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'snow': {
            const sim = new SnowSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'fireflies': {
            const sim = new FireflySimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'rain': {
            const sim = new RainSimulation(canvas, {variant: 'thunderstorm'});
            sim.start();
            active = sim;
            break;
        }
        case 'aurora': {
            const sim = new AuroraSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'bubbles': {
            const sim = new BubbleSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'sparklers': {
            const sim = new SparklerSimulation(canvas, {hoverMode: true});
            sim.start();
            active = sim;
            break;
        }
        case 'balloons': {
            const sim = new BalloonSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'stars': {
            const sim = new StarSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'particles': {
            const sim = new ParticleSimulation(canvas, {mouseMode: 'connect'});
            sim.start();
            active = sim;
            break;
        }
    }

    document.querySelectorAll<HTMLButtonElement>('nav button').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.effect === effect);
    });
}

document.querySelectorAll<HTMLButtonElement>('nav button[data-effect]').forEach(btn => {
    btn.addEventListener('click', () => start(btn.dataset.effect as Effect), {passive: true});
});

start('fireworks');
