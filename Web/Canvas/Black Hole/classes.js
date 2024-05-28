import { circle } from "./index.js";

export class BlackHole {
    constructor(size) {
        this.x = 100 + Math.random() * (window.screen.width - 200);
        this.y = 100 + Math.random() * (window.screen.height - 200);
        this.velocity = [0, 0];
        this.size = size;
        console.clear();
    }

    getVelocity(blackholes) {
        var everything = [...blackholes, new CenterGravity(window.screen.width / 2, window.screen.height / 2)];

        everything.forEach((other) => {
            if (other != this) {
                let totalDist = Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2);
                let massFactor = other.size / this.size;
                let dists = [this.x - other.x, this.y - other.y];
    
                this.velocity[0] -= (massFactor * (1 / totalDist) * dists[0]) / 100;
                this.velocity[1] -= (massFactor * (1 / totalDist) * dists[1]) / 100;
            }
        });

        this.handleMerging(blackholes);
        this.tick();
    }

    handleMerging(blackholes) {
        blackholes.forEach((blackhole) => {
            if (blackhole != this) {
                let dist = Math.sqrt((this.x - blackhole.x)**2 + (this.y - blackhole.y)**2);

                if (dist < blackhole.size && this.size < blackhole.size) {
                    blackholes.splice(blackholes.indexOf(this), 1);
                    blackhole.size += this.size;
                }
            }
        });
    }

    tick() {
        this.x += this.velocity[0];
        this.y += this.velocity[1];

        this.velocity[0] *= 0.995;
        this.velocity[1] *= 0.995;

        this.draw();
    }
    
    draw() {
        circle(this.x, this.y, this.size, 0, 0, 0, 1, true);
        circle(this.x, this.y, this.size, 0, 0, 255, 1, false, 2);
    }
}

class CenterGravity {
    constructor(centerX, centerY) {
        this.x = centerX;
        this.y = centerY;
        this.size = 10;
    }
}