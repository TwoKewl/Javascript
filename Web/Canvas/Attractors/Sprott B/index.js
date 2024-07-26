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
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 40;
    }

    convertToScreenCoordinates(x, y, z) {
        x -= this.x;
        y -= this.y;
        let x2 = x / (z + this.z);
        let y2 = y / (z + this.z);

        const scale = 4000;
        const xOffset = 0;
        const yOffset = 0;

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

class SprottB {
    constructor() {
        this.a = 0.4;
        this.b = 1.2;
        this.c = 1;

        this.x = Math.random() * 10 - 5;
        this.y = Math.random() * 10 - 5;
        this.z = Math.random() * 10 - 10;

        this.dt = 0.01;

        this.red = Math.random() * 150;
        this.green = 50;
        this.blue = Math.random() * 150 + 50;

        this.multi = 255 / (Math.max(this.red, this.green, this.blue) + 1);

        this.red *= this.multi;
        this.green *= this.multi;
        this.blue *= this.multi;

        this.prevPos = {x: this.x, y: this.y, z: this.z};

        this.rotationX = 2.33 + Math.PI;

        this.rotatedPos = { x: 0, y: 0, z: 0 };
        this.rotatedPrevPos = { x: 0, y: 0, z: 0 };
    }

    update() {
        const dx = this.a * this.y * this.z;
        const dy = this.x - this.b * this.y;
        const dz = this.c - this.x * this.y;

        this.x += dx * this.dt;
        this.y += dy * this.dt;
        this.z += dz * this.dt;
    }

    rotateCamera(camera) {
        var pos = {x: this.x, y: this.y, z: this.z};
        var prevPos = this.prevPos;
        pos = camera.rotateZ3D(pos, Math.PI / 8 * 3);
        prevPos = camera.rotateZ3D(prevPos, Math.PI / 8 * 3);
        pos = camera.rotateX3D(pos, Math.PI / 2);
        prevPos = camera.rotateX3D(prevPos, Math.PI / 2);
        pos = camera.rotateZ3D(pos, Math.PI / 2 * 3);
        prevPos = camera.rotateZ3D(prevPos, Math.PI / 2 * 3);
        pos = camera.rotateY3D(pos, this.rotationX);
        prevPos = camera.rotateY3D(prevPos, this.rotationX);

        this.rotatedPos = pos;
        this.rotatedPrevPos = prevPos;
    }

    render(camera) {
        camera.line(this.rotatedPrevPos, this.rotatedPos, this.red, this.green, this.blue, 1, 2);
        this.prevPos = {x: this.x, y: this.y, z: this.z};
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
const particles = [];
for (let i = 0; i < 20000; i++) particles.push(new SprottB());

var frame = 0;

function tick() {
    clearScreen(0, 0, 0);
   
    particles.forEach(particle => {
        particle.update();
        particle.rotateCamera(camera);
    });

    particles.sort((a, b) => a.rotatedPos.z - b.rotatedPos.z);

    particles.forEach(particle => {
        particle.render(camera);
    });

    if (spaceDown) console.log(particles[0].rotationX % (Math.PI * 2));

    saveCanvasAsImage(`${getFrameAsString(frame)}.png`);
    frame++;

    if (frame < 5000) requestAnimationFrame(tick);
} tick();

var spaceDown = false;
document.addEventListener('keydown', e => {
    if (e.key === ' ') spaceDown = true;
    if (e.key === 'w') camera.z -= 1;
    if (e.key === 's') camera.z += 1;
    if (e.key === 'q') camera.y -= 1;
    if (e.key === 'e') camera.y += 1;
    if (e.key === 'a') camera.x -= 1;
    if (e.key === 'd') camera.x += 1;
});

document.addEventListener('keyup', e => {
    if (e.key === ' ') spaceDown = false;
});