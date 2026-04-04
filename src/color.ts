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

let supportsP3: boolean | null = null;

export function detectP3Support(): boolean {
    if (supportsP3 !== null) {
        return supportsP3;
    }

    try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d', {colorSpace: 'display-p3'});

        if (!ctx) {
            supportsP3 = false;
            return false;
        }

        ctx.fillStyle = '#000';
        ctx.fillStyle = 'color(display-p3 1 0 0)';
        supportsP3 = ctx.fillStyle !== '#000000';
    } catch {
        supportsP3 = false;
    }

    return supportsP3;
}

function p3Impl(r: number, g: number, b: number): string {
    return `color(display-p3 ${r / 255} ${g / 255} ${b / 255})`;
}

function p3Fallback(r: number, g: number, b: number): string {
    return `rgb(${r}, ${g}, ${b})`;
}

function p3aImpl(r: number, g: number, b: number, a: number): string {
    return `color(display-p3 ${r / 255} ${g / 255} ${b / 255} / ${a})`;
}

function p3aFallback(r: number, g: number, b: number, a: number): string {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export let p3: (r: number, g: number, b: number) => string = (r, g, b) => {
    p3 = detectP3Support() ? p3Impl : p3Fallback;
    return p3(r, g, b);
};

export let p3a: (r: number, g: number, b: number, a: number) => string = (r, g, b, a) => {
    p3a = detectP3Support() ? p3aImpl : p3aFallback;
    return p3a(r, g, b, a);
};

export function defaultContextSettings(): CanvasRenderingContext2DSettings {
    return detectP3Support() ? {colorSpace: 'display-p3'} : {};
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
