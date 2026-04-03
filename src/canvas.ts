export class LimitedFrameRateCanvas {
    static #globalSpeed: number = 1;
    static #showFps: boolean = false;

    static get globalSpeed(): number {
        return LimitedFrameRateCanvas.#globalSpeed;
    }

    static set globalSpeed(value: number) {
        LimitedFrameRateCanvas.#globalSpeed = value;
    }

    static get showFps(): boolean {
        return LimitedFrameRateCanvas.#showFps;
    }

    static set showFps(value: boolean) {
        LimitedFrameRateCanvas.#showFps = value;
    }

    readonly #canvas: HTMLCanvasElement;
    readonly #context: CanvasRenderingContext2D;
    readonly #frameRate: number;
    readonly #target: number;
    #current: number = 0;
    #delta: number = 0;
    #frame: number = 0;
    #now: number = 0;
    #speed: number = 1;
    #then: number = 0;
    #ticks: number = 0;
    #isStopped: boolean = true;
    #height: number = 540;
    #width: number = 960;
    #fps: string = '0.0';
    #fpsFrames: number = 0;
    #fpsTime: number = 0;

    get canvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this.#context;
    }

    get delta(): number {
        return this.#delta;
    }

    get deltaFactor(): number {
        return this.#then === 0 ? 1 : (this.#target / this.#delta) * this.#speed * LimitedFrameRateCanvas.#globalSpeed;
    }

    get speed(): number {
        return this.#speed;
    }

    set speed(value: number) {
        this.#speed = value;
    }

    get frameRate(): number {
        return this.#frameRate;
    }

    get isSmall(): boolean {
        return innerWidth < 991; // dirty little fix :-)
    }

    get isTicking(): boolean {
        return !this.#isStopped;
    }

    get ticks(): number {
        return this.#ticks;
    }

    get height(): number {
        return this.#height;
    }

    get width(): number {
        return this.#width;
    }

    constructor(canvas: HTMLCanvasElement, frameRate: number, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d', options);
        this.#frameRate = frameRate;
        this.#target = 1000 / frameRate;

        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.onResize = this.onResize.bind(this);

        document.addEventListener('visibilitychange', this.onVisibilityChange, {passive: true});
        window.addEventListener('resize', this.onResize, {passive: true});
    }

    loop(): void {
        if (this.#isStopped) {
            return;
        }

        this.#current = Date.now();
        this.#frame = requestAnimationFrame(this.loop.bind(this));

        if (this.#then > 0 && this.#current - this.#then + 1 < this.#target) {
            return;
        }

        this.#now = this.#current;
        this.#delta = this.#now - this.#then;

        ++this.#ticks;

        this.tick();
        this.draw();

        if (LimitedFrameRateCanvas.#showFps) {
            ++this.#fpsFrames;

            if (this.#fpsTime === 0) {
                this.#fpsTime = this.#current;
            } else {
                const elapsed = this.#current - this.#fpsTime;

                if (elapsed >= 1000) {
                    this.#fps = (Math.round(this.#fpsFrames * 10000 / elapsed) / 10).toFixed(1);
                    this.#fpsFrames = 0;
                    this.#fpsTime = this.#current;
                }
            }

            this.#drawFps();
        }

        this.#then = this.#now;
    }

    start(): void {
        this.onResize();

        this.#isStopped = false;
        this.#frame = requestAnimationFrame(this.loop.bind(this));
    }

    stop(): void {
        this.#isStopped = true;
        cancelAnimationFrame(this.#frame);
    }

    pause(): void {
        this.#isStopped = true;
        cancelAnimationFrame(this.#frame);
    }

    resume(): void {
        if (this.#isStopped) {
            this.#isStopped = false;
            this.#frame = requestAnimationFrame(this.loop.bind(this));
        }
    }

    #drawFps(): void {
        const ctx = this.#context;
        const text = `${this.#fps} FPS`;
        const x = 8;
        const y = 8;
        const paddingX = 6;
        const paddingY = 4;

        ctx.save();
        ctx.font = '500 11px ui-monospace, monospace';

        const textWidth = ctx.measureText(text).width;
        const boxWidth = textWidth + paddingX * 2;
        const boxHeight = 11 + paddingY * 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.roundRect(x, y, boxWidth, boxHeight, 4);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + paddingX, y + boxHeight / 2);
        ctx.restore();
    }

    draw(): void {
        throw new Error('LimitedFrameRateCanvas::draw() should be overwritten.');
    }

    tick(): void {
        throw new Error('LimitedFrameRateCanvas::tick() should be overwritten.');
    }

    destroy(): void {
        this.stop();
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        window.removeEventListener('resize', this.onResize);
    }

    onResize(): void {
        const {width, height} = this.#canvas.getBoundingClientRect();
        this.#height = height;
        this.#width = width;
    }

    onVisibilityChange(): void {
        cancelAnimationFrame(this.#frame);

        if (document.visibilityState === 'visible') {
            this.#then = 0;
            this.start();
        } else {
            this.#then = 0;
            this.stop();
        }
    }
}
