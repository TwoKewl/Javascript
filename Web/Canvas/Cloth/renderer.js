import { circle } from "./index.js";
import { line } from './index.js';

export class Renderer {
    constructor(simulation, scale) {
        this.simulation = simulation;
        this.scale = scale;
        this.offset = [100, 100];
    }

    render() {
        this.simulation.connections.forEach((connection) => {
            line(connection.dot1.x * this.scale + this.offset[0], connection.dot1.y * this.scale + this.offset[1], connection.dot2.x * this.scale + this.offset[0], connection.dot2.y * this.scale + this.offset[1], 255, 0, 0, 1, 1);
        });

        // this.simulation.dots.forEach((dot) => {
        //     circle(dot.x * this.scale + this.offset[0], dot.y * this.scale + this.offset[1], 3, 255, 255, 255, 1, true);
        // });
    }
}