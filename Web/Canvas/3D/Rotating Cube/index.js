const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.classList.add("remove-scrolling");

function rect(x, y, width, height, r, g, b, a, fill = true) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    if (fill){
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    } else {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.stroke();
    }
}

function circle(x, y, radius, r, g, b, a, fill = true, thickness = 2) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill){
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    } else {
        ctx.lineWidth = thickness;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.stroke();
    }
}

function line(sx, sy, ex, ey, r, g, b, a, thickness) {
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.stroke();
}

function lineHSL(sx, sy, ex, ey, h, s, l, thickness) {
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = `hsl(${h}, ${s}%, ${l}%)`;
    ctx.stroke();
}

function clearScreen(r, g, b) {
    rect(0, 0, canvas.width, canvas.height, r, g, b, 1);
}

class Cube {
    constructor() {
        this.vertices = [[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]];
        this.edges = [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]];

        this.hue = 0;
    }

    render() {
        this.hue += 0.25;
        this.hue = this.hue % 360;

        this.edges.forEach(edge => {
            const [v1, v2] = edge;
            const [x1, y1] = this.perspectiveProjection(this.vertices[v1][0], this.vertices[v1][1], this.vertices[v1][2]);
            const [x2, y2] = this.perspectiveProjection(this.vertices[v2][0], this.vertices[v2][1], this.vertices[v2][2]);
            lineHSL(x1, y1, x2, y2, this.hue, 100, 50, 1);
        });
    }

    tick() {
        this.rotateX(0.0025);
        this.rotateY(0.0025);
        this.rotateZ(0.0025);
    }

    perspectiveProjection(x, y, z) {
        const focalLength = 500;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
    
        const u = (focalLength * x) / (z + 4) + cx;
        const v = (focalLength * y) / (z + 4) + cy;
    
        return [u, v];
    }

    rotateX(theta) {
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        this.vertices = this.vertices.map(vertex => {
            const x = vertex[0];
            const z = vertex[2];
            return [x * cosTheta - z * sinTheta, vertex[1], x * sinTheta + z * cosTheta];
        });
    }

    rotateY(theta) {
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        this.vertices = this.vertices.map(vertex => {
            const y = vertex[1];
            const z = vertex[2];
            return [vertex[0], y * cosTheta - z * sinTheta, y * sinTheta + z * cosTheta];
        });
    }

    rotateZ(theta) {
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        this.vertices = this.vertices.map(vertex => {
            const x = vertex[0];
            const y = vertex[1];
            return [x * cosTheta - y * sinTheta, x * sinTheta + y * cosTheta, vertex[2]];
        });
    }
}

clearScreen(0, 0, 0);
const c = new Cube();
c.render();

function update() {
    clearScreen(0, 0, 0);
    c.tick();
    c.render();
    requestAnimationFrame(update);
}

setTimeout(update, 1000);