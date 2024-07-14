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

function clearScreen(r, g, b) {
    rect(0, 0, canvas.width, canvas.height, r, g, b, 1);
}

class Triangle {
    constructor() {
        this.x = [];
        this.y = [];
        this.radius = 400;
        this.colours = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];

        for (let i = 0; i < 3; i++) {
            this.x.push(this.radius * Math.sin((Math.PI * 2 / 3) * i) + canvas.width / 2);
            this.y.push(this.radius * -Math.cos((Math.PI * 2 / 3) * i) + canvas.height / 2 + this.radius / 4);
        }
    }

    render() {
        for (let i = 0; i < 3; i++) {
            line(this.x[i], this.y[i], this.x[(i + 1) % 3], this.y[(i + 1) % 3], 255, 255, 255, 1, 1);
        }
    }

    getStartingPoint() {
        var c1 = Math.floor(Math.random() * 3);
        var c2 = Math.floor(Math.random() * 3);

        if (c1 == c2) {
            c2 = (c2 + 1) % 3;
        }

        return this.getCenterOf(this.x[c1], this.y[c1], this.x[c2], this.y[c2]);
    }

    getRandomCorner() {
        const idx = Math.floor(Math.random() * 3);

        return [this.x[idx], this.y[idx]];
    }

    getCenterOf(x, y, x1, y1) {
        return [(x + x1) / 2, (y + y1) / 2];
    }

    getRGBColour(x, y) {
        const dist1 = Math.sqrt((x - this.x[0]) ** 2 + (y - this.y[0]) ** 2);
        const dist2 = Math.sqrt((x - this.x[1]) ** 2 + (y - this.y[1]) ** 2);
        const dist3 = Math.sqrt((x - this.x[2]) ** 2 + (y - this.y[2]) ** 2);

        const total = dist1 + dist2 + dist3;
        const weight1 = dist1 / total;
        const weight2 = dist2 / total;
        const weight3 = dist3 / total;

        var red = this.colours[0][0] * weight1 + this.colours[1][0] * weight2 + this.colours[2][0] * weight3;
        var green = this.colours[0][1] * weight1 + this.colours[1][1] * weight2 + this.colours[2][1] * weight3;
        var blue = this.colours[0][2] * weight1 + this.colours[1][2] * weight2 + this.colours[2][2] * weight3;

        const max = Math.max(red, green, blue);
        const multiplier = 255 / max;

        red *= multiplier;
        green *= multiplier;
        blue *= multiplier;

        return [red, green, blue];
    }
}

const t = new Triangle(100, 100, 200, 200, 300, 100);
const point = t.getStartingPoint();
var x = point[0];
var y = point[1];

function tick() {
    for (let i = 0; i < 100; i++) {
        const corner = t.getRandomCorner();
        x = (x + corner[0]) / 2;
        y = (y + corner[1]) / 2;
        const colour = t.getRGBColour(x, y);
    
        circle(x, y, 1, colour[0], colour[1], colour[2], 1);
    }
    
    requestAnimationFrame(tick);
}

clearScreen(0, 0, 0);
requestAnimationFrame(tick);