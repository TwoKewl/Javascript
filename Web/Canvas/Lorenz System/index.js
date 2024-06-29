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
    }
    else{
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
    }
    else{
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

const sigma = 10;
const rho = 28;
const beta = 8/3;
var x = 1;
var y = 1;
var z = 2;

function perspectiveProjection(x, y, z) {
    const focalLength = 500;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const u = (focalLength * x) / (z + 20) + cx;
    const v = (focalLength * y) / (z + 20) + cy;

    return [u, v];
}

function tick() {
    const dt = 0.005;
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    x = x + dx;
    y = y + dy;
    z = z + dz;

    const [u, v] = perspectiveProjection(x, y, z);
    circle(u, v, 1, 255, 255, 255, 1);

    requestAnimationFrame(tick);
}

clearScreen(0, 0, 20);
tick();