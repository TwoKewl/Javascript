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

class Hand {
    constructor(length, angle, speed) {
        this.length = length;
        this.angle = angle;
        this.speed = speed;
        this.ex = 0;
        this.ey = 0;
    }

    tick(x, y) {
        this.angle += this.speed / 1000;

        this.ex = x + this.length * Math.sin(this.angle);
        this.ey = y + this.length * Math.cos(this.angle);
    }

    render(sx, sy) {
        line(sx, sy, this.ex, this.ey, 255, 255, 255, 0.2, 2);
    }
}

const hands = [];
hands.push(new Hand(200, -Math.PI / 4, 5));
hands.push(new Hand(200, -Math.PI / 2, 18));
const points = [];
var frame = 0;

function tick() {
    frame++;
    if (frame > 6300) return;
    hands.forEach((hand) => {
        if (hands.indexOf(hand) == 0) {
            hand.tick(canvas.width / 2, canvas.height / 2);
        } else {
            hand.tick(hands[hands.indexOf(hand) - 1].ex, hands[hands.indexOf(hand) - 1].ey);
        }

        if (hands.indexOf(hand) == hands.length - 1) points.push({x: hand.ex, y: hand.ey});
    });

    if (points.length == 2) line(points[1].x, points[1].y, points[0].x, points[0].y, 255, 255, 255, 1, 1);

    if (points.length > 1) points.shift();

    requestAnimationFrame(tick);
}

clearScreen(0, 0, 0);
setTimeout(tick, 1000);