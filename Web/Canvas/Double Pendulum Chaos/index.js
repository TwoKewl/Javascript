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

class DoublePendulum {
    constructor(angle1, angle2, r, g, b) {
        this.g = 9.81;
        this.l1 = 150;
        this.l2 = 150;
        this.m1 = 10;
        this.m2 = 10;
        this.a1 = angle1;
        this.a2 = angle2;
        this.a1_v = 0;
        this.a2_v = 0;
        this.originX = canvas.width / 2;
        this.originY = canvas.height / 2;
        this.dt = 0.05;

        this.red = r;
        this.green = g;
        this.blue = b;
    }

    update() {
        let num1 = -this.g * (2 * this.m1 + this.m2) * Math.sin(this.a1);
        let num2 = -this.m2 * this.g * Math.sin(this.a1 - 2 * this.a2);
        let num3 = -2 * Math.sin(this.a1 - this.a2) * this.m2;
        let num4 = this.a2_v * this.a2_v * this.l2 + this.a1_v * this.a1_v * this.l1 * Math.cos(this.a1 - this.a2);
        let den = this.l1 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
        let a1_a = (num1 + num2 + num3 * num4) / den;

        num1 = 2 * Math.sin(this.a1 - this.a2);
        num2 = (this.a1_v * this.a1_v * this.l1 * (this.m1 + this.m2));
        num3 = this.g * (this.m1 + this.m2) * Math.cos(this.a1);
        num4 = this.a2_v * this.a2_v * this.l2 * this.m2 * Math.cos(this.a1 - this.a2);
        den = this.l2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
        let a2_a = (num1 * (num2 + num3 + num4)) / den;

        this.a1_v += a1_a * this.dt;
        this.a2_v += a2_a * this.dt;
        this.a1 += this.a1_v * this.dt;
        this.a2 += this.a2_v * this.dt;
    }

    render() {
        let x1 = this.l1 * Math.sin(this.a1) + this.originX;
        let y1 = this.l1 * Math.cos(this.a1) + this.originY;

        let x2 = x1 + this.l2 * Math.sin(this.a2);
        let y2 = y1 + this.l2 * Math.cos(this.a2);

        line(this.originX, this.originY, x1, y1, this.red, this.green, this.blue, 1, 1);
        line(x1, y1, x2, y2, this.red, this.green, this.blue, 1, 1);
    }
}

const doublePends = [];
const numPends = 500;
for (let i = 0; i < numPends; i++) {
    const red = ((i + 1) * 255 / numPends);
    const green = 255 - red / 2;
    const blue = 0;
    doublePends.push(new DoublePendulum(Math.PI / 2, Math.PI / 2 + i * 0.00001, red, green, blue));
}

function tick() {
    clearScreen(0, 0, 0);

    doublePends.forEach(pend => {
        pend.update();
        pend.render();
    });

    requestAnimationFrame(tick);
}

clearScreen(0, 0, 0);
doublePends.forEach(pend => {
    pend.render();
});

tick();