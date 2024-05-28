import { Dot } from './dot.js';
import { Connection } from './connection.js';

export class Simulation {
    constructor(dotsAcross, dotsDown) {
        this.dots = [];
        this.connections = [];
        this.dotsAcross = dotsAcross;
        this.dotsDown = dotsDown;

        for (let y = 0; y < dotsDown; y++) {
            for (let x = 0; x < dotsAcross; x++) {
                this.dots.push(new Dot(x, y));
            }
        }

        this.addConnections();
    }

    addConnections() {
        for (let y = 0; y < this.dotsDown; y++) {
            for (let x = 0; x < this.dotsAcross; x++) {
                if (x < this.dotsAcross - 1) this.connections.push(new Connection(this.dots[x + y * this.dotsAcross], this.dots[x + 1 + y * this.dotsAcross], 1.2));
                if (y < this.dotsDown - 1) this.connections.push(new Connection(this.dots[x + y * this.dotsAcross], this.dots[x + (y + 1) * this.dotsAcross], 1.2));

                if (y == 0 && x % 12 == 0) {
                    this.dots[x + y * this.dotsAcross].setFixed(true);
                }
            }  
        }
    }

    tick() {
        this.dots.forEach((dot) => dot.tick());
        this.connections.forEach(connection => connection.tick());
        this.connections.forEach(connection => connection.tick());
    }
}