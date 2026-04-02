import './style.css';

import { AuroraSimulation, BalloonSimulation, BubbleSimulation, ConfettiSimulation, DonutSimulation, FIREWORK_VARIANTS, FireflySimulation, FirepitSimulation, FireworkSimulation, GlitterSimulation, LanternSimulation, LeafSimulation, LightningSimulation, MatrixSimulation, OrbitSimulation, ParticleSimulation, PetalSimulation, PlasmaSimulation, RainSimulation, SandstormSimulation, SnowSimulation, SparklerSimulation, StarSimulation, StreamerSimulation, WaveSimulation, WormholeSimulation } from '@basmilius/sparkle';
import type { FireworkVariant } from '@basmilius/sparkle';

type Effect = 'aurora' | 'balloons' | 'bubbles' | 'confetti' | 'donuts' | 'fireflies' | 'firepit' | 'fireworks' | 'fireworks-lab' | 'glitter' | 'lanterns' | 'leaves' | 'lightning' | 'matrix' | 'orbits' | 'particles' | 'petals' | 'plasma' | 'rain' | 'sandstorm' | 'snow' | 'sparklers' | 'stars' | 'streamers' | 'waves' | 'wormhole';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const variantGrid = document.getElementById('variant-grid') as HTMLDivElement;
const nav = document.getElementById('nav') as HTMLElement;
const navToggle = document.getElementById('nav-toggle') as HTMLButtonElement;

navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-hidden');
}, {passive: true});

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
        case 'leaves': {
            const sim = new LeafSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'petals': {
            const sim = new PetalSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'firepit': {
            const sim = new FirepitSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'sandstorm': {
            const sim = new SandstormSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'waves': {
            const sim = new WaveSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'lanterns': {
            const sim = new LanternSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'streamers': {
            const sim = new StreamerSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'glitter': {
            const sim = new GlitterSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'matrix': {
            const sim = new MatrixSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'wormhole': {
            const sim = new WormholeSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'plasma': {
            const sim = new PlasmaSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'lightning': {
            const sim = new LightningSimulation(canvas);
            sim.start();
            active = sim;
            break;
        }
        case 'orbits': {
            const sim = new OrbitSimulation(canvas);
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
