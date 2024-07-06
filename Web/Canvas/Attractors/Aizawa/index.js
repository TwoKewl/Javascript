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

function perspectiveProjection(x, y, z, rx, ry, rz) {
    const focalLength = 500;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const rotatedY1 = y * Math.cos(rx) - z * Math.sin(rx);
    const rotatedZ1 = y * Math.sin(rx) + z * Math.cos(rx);

    const rotatedX2 = x * Math.cos(ry) + rotatedZ1 * Math.sin(ry);
    const rotatedZ2 = -x * Math.sin(ry) + rotatedZ1 * Math.cos(ry);

    const rotatedX3 = rotatedX2 * Math.cos(rz) - rotatedY1 * Math.sin(rz);
    const rotatedY3 = rotatedX2 * Math.sin(rz) + rotatedY1 * Math.cos(rz);

    const u = (focalLength * rotatedX3) / (rotatedZ2 + 4) + cx;
    const v = (focalLength * rotatedY3) / (rotatedZ2 + 4) + cy;

    return { x: u, y: v };
}

function aizawa(x, y, z) {
    const dx = (z - b) * x - d * y;
    const dy = d * x + (z - b) * y;
    const dz = c + a * z - (z ** 3) / 3 - (x ** 2 + y ** 2) * (1 + e * z) + f * z * (x ** 3);

    return {x: x + dx * dt, y: y + dy * dt, z: z + dz * dt};
}

let x = 0.01, y = 0, z = 0;
const dt = 0.005;
const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;

class Particle {
    constructor(x, y, z, hue) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.hue = hue;
    }

    update() {
        const next = aizawa(this.x, this.y, this.z);

        const {x: u, y: v} = perspectiveProjection(this.x, this.y, this.z, 0, Math.PI / 4 * 3, Math.PI / 2 * 3);
        this.x = next.x;
        this.y = next.y;
        this.z = next.z;
        const {x: u2, y: v2} = perspectiveProjection(this.x, this.y, this.z, 0, Math.PI / 4 * 3, Math.PI / 2 * 3);
        lineHSL(u, v, u2, v2, this.hue, 100, 50, 1);
    }
}

const particles = [];
for (let i = 0; i < 0.1; i += 0.025) {
    const p = new Particle(0.01 + i, 0, 0, i * 3600);
    particles.push(p);
}

function tick() {
    for (const p of particles) p.update();

    requestAnimationFrame(tick);
}

clearScreen(0, 0, 0);

setTimeout(tick, 1000);