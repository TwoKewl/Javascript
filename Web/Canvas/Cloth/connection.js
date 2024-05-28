
export class Connection {
    constructor(dot1, dot2, maxLength) {
        this.dot1 = dot1;
        this.dot2 = dot2;
        this.length = maxLength;
        this.factor = 0.001;
    }

    tick() {
        for (let i = 0; i < 5; i++) {
            if (this.getDistance() > this.length) {
                let ax = this.dot2.x - this.dot1.x;
                let ay = this.dot2.y - this.dot1.y;
    
                if (!this.dot1.fixed) {
                    this.dot1.dx += ax * this.factor;
                    this.dot1.dy += ay * this.factor;

                    this.dot1.x += this.dot1.dx;
                    this.dot1.y += this.dot1.dy;
                }
                
                if (!this.dot2.fixed) {
                    this.dot2.dx += -ax * this.factor;
                    this.dot2.dy += -ay * this.factor;

                    this.dot2.x += this.dot2.dx;
                    this.dot2.y += this.dot2.dy;
                }            
            }
        }
    }

    getDistance() {
        return Math.sqrt((this.dot1.x - this.dot2.x)**2 + (this.dot1.y - this.dot2.y)**2);
    }
}