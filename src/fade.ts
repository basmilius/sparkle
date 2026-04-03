import type { EdgeFade, EdgeFadeSide } from './layer';

function parseSide(side: EdgeFadeSide): [number, number] {
    return typeof side === 'number' ? [0, side] : side;
}

export function applyEdgeFade(ctx: CanvasRenderingContext2D, width: number, height: number, fade: EdgeFade): void {
    ctx.globalCompositeOperation = 'destination-out';

    if (fade.top !== undefined) {
        const [near, far] = parseSide(fade.top);
        const nearPx = near * height;
        const farPx = far * height;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(0, 0, width, nearPx);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(0, nearPx, 0, farPx);
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, nearPx, width, farPx - nearPx);
        }
    }

    if (fade.bottom !== undefined) {
        const [near, far] = parseSide(fade.bottom);
        const nearPx = near * height;
        const farPx = far * height;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(0, height - nearPx, width, nearPx);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(0, height - farPx, 0, height - nearPx);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, height - farPx, width, farPx - nearPx);
        }
    }

    if (fade.left !== undefined) {
        const [near, far] = parseSide(fade.left);
        const nearPx = near * width;
        const farPx = far * width;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(0, 0, nearPx, height);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(nearPx, 0, farPx, 0);
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(nearPx, 0, farPx - nearPx, height);
        }
    }

    if (fade.right !== undefined) {
        const [near, far] = parseSide(fade.right);
        const nearPx = near * width;
        const farPx = far * width;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(width - nearPx, 0, nearPx, height);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(width - farPx, 0, width - nearPx, 0);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(width - farPx, 0, farPx - nearPx, height);
        }
    }

    ctx.globalCompositeOperation = 'source-over';
}
