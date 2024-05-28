
export class Dot {
    constructor(x, y, fixed) {
        this.x = x;
        this.y = y;
        this.fixed = fixed;
        this.dx = 0;
        this.dy = 0;
    }

    tick() {
        if (!this.fixed) {
            this.dy += 0.002;
            this.y += this.dy;
            this.x += this.dx;
        } else {
            this.dx = 0;
            this.dy = 0;
        }
    }

    setFixed(fixed) {
        this.fixed = fixed;
    }
}