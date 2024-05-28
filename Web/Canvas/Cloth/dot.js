
export class Dot {
    constructor(x, y, fixed) {
        this.x = x;
        this.y = y;
        this.fixed = fixed;
        this.bx = x;
        this.by = y;
    }

    tick() {
        if (this.fixed) return;

        let dx = this.x- this.bx;
        let dy = this.y - this.by + 0.001;

        this.bx = this.x;
        this.by = this.y;


        this.x += dx;
        this.y += dy;
    }

    setFixed(fixed) {
        this.fixed = fixed;
    }
}