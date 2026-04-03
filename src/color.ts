export function parseColor(fillStyle: string): { r: number; g: number; b: number; a: number } {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return {r: data[0], g: data[1], b: data[2], a: data[3] / 255};
}
