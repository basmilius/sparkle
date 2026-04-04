export function createGlowSprite(
    r: number,
    g: number,
    b: number,
    size: number,
    stops: readonly [number, number][]
): HTMLCanvasElement {
    const center = size / 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);

    for (const [stop, alpha] of stops) {
        gradient.addColorStop(stop, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
}
