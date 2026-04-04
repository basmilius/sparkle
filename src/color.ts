const cache = new Map<string, { r: number; g: number; b: number; a: number }>();

export function rgbToHue(r: number, g: number, b: number): number {
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

export function parseColor(fillStyle: string): { r: number; g: number; b: number; a: number } {
    const cached = cache.get(fillStyle);
    if (cached) {
        return cached;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    const result = {r: data[0], g: data[1], b: data[2], a: data[3] / 255};
    cache.set(fillStyle, result);
    return result;
}
