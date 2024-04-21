var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.classList.add("remove-scrolling");

function rect(x, y, width, height, r, g, b, a, fill){
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

function circle(x, y, radius, r, g, b, a, fill){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill){
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    }
    else{
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.stroke();
    }
}

function line(sx, sy, ex, ey, r, g, b, a, thickness){
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.stroke();
}

function clearScreen(r, g, b, a){
    rect(0, 0, canvas.width, canvas.height, r, g, b, a, true);
}


class Circle{
    constructor(){
        this.x = Math.random() * (canvas.width - 100) + 50;
        this.y = Math.random() * (canvas.height - 100) + 50;
        this.radius = Math.floor(Math.random() * 15) + 15;
        this.speed = (35 - this.radius) / 5;
        this.startAngle = Math.random() * 2 * Math.PI;
        this.dx = Math.cos(this.startAngle) * this.speed;
        this.dy = Math.sin(this.startAngle) * this.speed;
        this.colour = [255, 0, 0, 1];
    }

    draw(){
        circle(this.x, this.y, this.radius, this.colour[0], this.colour[1], this.colour[2], this.colour[3], true);
    }

    tick(){
        this.checkWallCollision();
        this.checkCollision();
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

    checkWallCollision(){
        if (this.x + this.dx - this.radius < 0 || this.x + this.dx + this.radius > canvas.width){
            this.dx *= -1;
        }
        
        if (this.y + this.dy - this.radius < 0 || this.y + this.dy + this.radius > canvas.height){
            this.dy *= -1;
        }
    }

    checkCollision(){
        circles.every((i) => {
            if (i != this){
                let a = this.radius + i.radius;
                let x = this.x - i.x;
                let y = this.y - i.y;
    
                if (a > Math.sqrt((x * x) + (y * y))) {
                    this.collision(i);
                    return false;
                }
            }

            return true;
        });
    }

    collision(other) {
        const xVelocityDiff = this.dx - other.dx;
        const yVelocityDiff = this.dy - other.dy;

        const xDist = other.x - this.x;
        const yDist = other.y - this.y;

        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
            const angle = -Math.atan2(other.y - this.y, other.x - this.x);

            const m1 = this.radius;
            const m2 = other.radius;

            const u1 = { x: this.dx * Math.cos(angle) - this.dy * Math.sin(angle), y: this.dx * Math.sin(angle) + this.dy * Math.cos(angle) };
            const u2 = { x: other.dx * Math.cos(angle) - other.dy * Math.sin(angle), y: other.dx * Math.sin(angle) + other.dy * Math.cos(angle) };

            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            const vFinal1 = { x: v1.x * Math.cos(-angle) - v1.y * Math.sin(-angle), y: v1.x * Math.sin(-angle) + v1.y * Math.cos(-angle) };
            const vFinal2 = { x: v2.x * Math.cos(-angle) - v2.y * Math.sin(-angle), y: v2.x * Math.sin(-angle) + v2.y * Math.cos(-angle) };

            this.dx = vFinal1.x;
            this.dy = vFinal1.y;

            other.dx = vFinal2.x;
            other.dy = vFinal2.y;
        }
    }   
}

var circles = [];
for (let i = 0; i < 100; i++){
    circles.push(new Circle());
}

function main(){
    clearScreen(15, 15, 30, 1);

    circles.forEach((i) => {
        i.tick();
    });
}

setInterval(main, 1000/60, false);