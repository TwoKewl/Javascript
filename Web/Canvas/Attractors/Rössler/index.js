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

class Camera {
    convertToScreenCoordinates(x, y, z) {
        let x2 = x / (z + 75);
        let y2 = y / (z + 75);

        const scale = 3000;
        const xOffset = 0;
        const yOffset = 100;

        let xScreen = (((x2 + 1) / 2)) * scale + (canvas.width / 2 - scale / 2) + xOffset;
        let yScreen = ((1 - (y2 + 1) / 2)) * scale + (canvas.height / 2 - scale / 2) + yOffset;

        return {x: xScreen, y: yScreen};
    }

    dot(pos, r, g, b, a, radius) {
        const converted = this.convertToScreenCoordinates(pos.x, pos.y, pos.z);

        circle(converted.x, converted.y, radius, r, g, b, a);
    }

    line(pos1, pos2, r, g, b, a, thickness) {
        const start = this.convertToScreenCoordinates(pos1.x, pos1.y, pos1.z);
        const end = this.convertToScreenCoordinates(pos2.x, pos2.y, pos2.z);

        line(start.x, start.y, end.x, end.y, r, g, b, a, thickness);
    }

    rotateX3D(pos, angle) {
        const x = pos.x * Math.cos(angle) - pos.z * Math.sin(angle);
        const z = pos.x * Math.sin(angle) + pos.z * Math.cos(angle);

        return {x: x, y: pos.y, z: z};
    }

    rotateY3D(pos, angle) {
        const y = pos.y * Math.cos(angle) - pos.z * Math.sin(angle);
        const z = pos.y * Math.sin(angle) + pos.z * Math.cos(angle);

        return {x: pos.x, y: y, z: z};
    }

    rotateZ3D(pos, angle) {
        const x = pos.x * Math.cos(angle) - pos.y * Math.sin(angle);
        const y = pos.x * Math.sin(angle) + pos.y * Math.cos(angle);

        return {x: x, y: y, z: pos.z};
    }
}

class Rössler {
    constructor(x, y, z) {
        this.a = 0.2;
        this.b = 0.2;
        this.c = 5.7;

        this.x = x;
        this.y = y;
        this.z = z;

        this.red = Math.random() * 150;
        this.green = 0;
        this.blue = Math.random() * 150 + 50;

        this.multi = 255 / (Math.max(this.red, this.green, this.blue) + 1);

        this.red *= this.multi;
        this.green *= this.multi;
        this.blue *= this.multi;

        this.dt = 0.01;

        this.previousPositions = [];
    }

    update() {
        const dx = -this.y - this.z;
        const dy = this.x + this.a * this.y;
        const dz = this.b + this.z * (this.x - this.c);

        this.x += dx * this.dt;
        this.y += dy * this.dt;
        this.z += dz * this.dt;
    }

    render(camera) {
        this.previousPositions.push({x: this.x, y: this.y, z: this.z});
        if (this.previousPositions.length > 2) this.previousPositions.shift();

        for (let i = 0; i < this.previousPositions.length - 1; i++) {
            var prevPos = this.previousPositions[i];
            var pos = this.previousPositions[i + 1];
            prevPos = camera.rotateX3D(prevPos, Math.PI / 2);
            pos = camera.rotateX3D(pos, Math.PI / 2);
            prevPos = camera.rotateZ3D(prevPos, Math.PI / 2 * 3);
            pos = camera.rotateZ3D(pos, Math.PI / 2 * 3);
            prevPos = camera.rotateX3D(prevPos, Math.PI / 4 * 6);
            pos = camera.rotateX3D(pos, Math.PI / 4 * 6);
            prevPos = camera.rotateY3D(prevPos, Math.PI / 4);
            pos = camera.rotateY3D(pos, Math.PI / 4);

            camera.line(prevPos, pos, this.red, this.green, this.blue, 1, 2);
        }
    }
}

function saveCanvasAsImage(fileName) {
    var dataURL = canvas.toDataURL('image/png');
    var link = document.createElement('a');
    link.href = dataURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getFrameAsString(frame) {
    return frame.toString().padStart(4, '0');
}

const camera = new Camera();
const rössler = [];
for (let i = 0; i < 25000; i++) rössler.push(new Rössler(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5));
clearScreen(0, 0, 0);

var frame = 0;

function tick() {
    clearScreen(0, 0, 0);

    rössler.forEach(r => {
        r.update();
        r.render(camera);
    });

    saveCanvasAsImage(getFrameAsString(frame));
    frame++;

    if (frame < 5000) requestAnimationFrame(tick);
} tick();