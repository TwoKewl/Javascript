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

function circleHSL(x, y, radius, h, s, l, a, fill = true, thickness = 2) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill){
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx.fill();
    } else {
        ctx.lineWidth = thickness;
        ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
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

class Ball {
    constructor() {
        this.radius = Math.random() * 25 + 15;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
        this.mass = this.radius; // Mass is proportional to the radius
        this.speed = 2;
        this.direction = Math.random() * Math.PI * 2;

        this.dx = Math.cos(this.direction) * this.speed;
        this.dy = Math.sin(this.direction) * this.speed;

        this.r = Math.random() * 150;
        this.g = 0;
        this.b = Math.random() * 150 + 50;

        this.multi = 255 / (Math.max(this.r, this.g, this.b) + 1);

        this.r *= this.multi;
        this.g *= this.multi;
        this.b *= this.multi;
    }

    draw() {
        circle(this.x, this.y, this.radius, this.r, this.g, this.b, 1);
    }

    tick(otherBalls) {
        this.checkCollisions(otherBalls);
        
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.dx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.dy *= -1;

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }

    checkCollisions(otherBalls) {
        for (const other of otherBalls) {
            if (other === this) continue;

            const distance = Math.sqrt(((this.x + this.dx) - other.x) ** 2 + ((this.y + this.dy) - other.y) ** 2);
            if (distance < this.radius + other.radius) {
                if (distance === 0) continue; // Avoid division by zero
                this.handleCollision(other);
                return;
            }
        }
    }

    handleCollision(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const nx = dx / dist;
        const ny = dy / dist;

        const tx = -ny;
        const ty = nx;

        const dpTan1 = this.dx * tx + this.dy * ty;
        const dpTan2 = other.dx * tx + other.dy * ty;

        const dpNorm1 = this.dx * nx + this.dy * ny;
        const dpNorm2 = other.dx * nx + other.dy * ny;

        const m1 = (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) / (this.mass + other.mass);
        const m2 = (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) / (this.mass + other.mass);

        this.dx = tx * dpTan1 + nx * m1;
        this.dy = ty * dpTan1 + ny * m1;
        other.dx = tx * dpTan2 + nx * m2;
        other.dy = ty * dpTan2 + ny * m2;
    }
}

const balls = [];
for (let i = 0; i < 100; i++) {
    let newBall;
    let overlapping;
    do {
        overlapping = false;
        newBall = new Ball();
        for (const ball of balls) {
            const distance = Math.sqrt((newBall.x - ball.x) ** 2 + (newBall.y - ball.y) ** 2);
            if (distance < newBall.radius + ball.radius) {
                overlapping = true;
                break;
            }
        }
    } while (overlapping);
    balls.push(newBall);
}

function update() {
    clearScreen(0, 0, 0);
    for (let i = 0; i < balls.length; i++) {
        balls[i].tick(balls);
    }

    requestAnimationFrame(update);
} update();