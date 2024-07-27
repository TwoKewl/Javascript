const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.classList.add("remove-scrolling");

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

function lineHSL(sx, sy, ex, ey, h, s, l, thickness) {
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = `hsl(${h}, ${s}%, ${l}%)`;
    ctx.stroke();
}

function clearScreen(r, g, b) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

class Torus {
    constructor() {
        this.divisions = 25;
        this.tubeDivisions = 100;
        this.radius = 200;
        this.tubeRadius = 50;
        this.points = [];
        this.originalPoints = [];

        this.angleDelta = 0.01;
        this.angle = 0;

        this.hue = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;

        this.wKey = false;
        this.sKey = false;
        this.aKey = false;
        this.dKey = false;
        this.shift = false;
    }

    getPoints() {
        this.points = [];
        this.originalPoints = [];
        let i = 0;

        for (let theta = 0; theta < Math.PI * 2; theta += (Math.PI * 2) / this.divisions) {
            this.points.push([]);
            this.originalPoints.push([]);
            for (let phi = 0; phi < Math.PI * 2; phi += (Math.PI * 2) / this.tubeDivisions) {
                let x = (this.radius + this.tubeRadius * Math.cos(phi + Math.PI / 4)) * Math.sin(theta);
                let y = this.tubeRadius * Math.sin(phi + Math.PI / 4);
                let z = (this.radius + this.tubeRadius * Math.cos(phi + Math.PI / 4)) * Math.cos(theta);

                this.points[i].push({x, y, z});
                this.originalPoints[i].push({x, y, z});
            }
            i++;
        }
    }

    render() {
        this.hue += 0.2;

        this.points.forEach((group) => {
            for (let i = 0; i < group.length; i++) {
                let point1 = this.convertTo2D(group[i]);
                let point2 = this.convertTo2D(group[(i + 1) % group.length]);
                lineHSL(point1.x, point1.y, point2.x, point2.y, this.hue, 100, 50, 2);
            }
        });

        for (let i = 0; i < this.points[0].length; i++) {
            for (let j = 0; j < this.points.length; j++) {
                let point1 = this.convertTo2D(this.points[j][i]);
                let point2 = this.convertTo2D(this.points[(j + 1) % this.points.length][i]);
                lineHSL(point1.x, point1.y, point2.x, point2.y, this.hue, 100, 50, 2);
            }
        }
    }

    convertTo2D(point) {
        let x = point.x;
        let y = point.y;
        let z = point.z;

        let scale = 1000 / (1000 + z);

        x = x * scale + canvas.width / 2;
        y = y * scale + canvas.height / 2;

        return {x, y};
    }

    rotateX(points, angle) {
        return points.map(group => 
            group.map(point => {
                const y = point.y * Math.cos(angle) - point.z * Math.sin(angle);
                const z = point.y * Math.sin(angle) + point.z * Math.cos(angle); 
                return {...point, y, z};
            })
        );
    }

    rotateY(points, angle) {
        return points.map(group => 
            group.map(point => {
                const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
                const z = -point.x * Math.sin(angle) + point.z * Math.cos(angle);
                return {...point, x, z};
            })
        );
    }

    rotateZ(points, angle) {
        return points.map(group => 
            group.map(point => {
                const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
                const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
                return {...point, x, y};
            })
        );
    }

    updatePoints() {
        let rotatedPoints = this.originalPoints;
        rotatedPoints = this.rotateX(rotatedPoints, this.rotationX);
        rotatedPoints = this.rotateY(rotatedPoints, this.rotationY);
        rotatedPoints = this.rotateZ(rotatedPoints, this.rotationZ);
        this.points = rotatedPoints;
    }

    updateRotation(deltaAngle) {
        this.rotationX += deltaAngle.x;
        this.rotationY += deltaAngle.y;
        this.rotationZ += deltaAngle.z;
    }
}

const torus = new Torus();
torus.getPoints();

function tick() {
    clearScreen(0, 0, 0);
    torus.updateRotation({x: 0.01, y: 0.01, z: 0.01});
    torus.updatePoints();
    torus.render();
    requestAnimationFrame(tick);
} tick();

document.addEventListener('keydown', (e) => {
    if (e.key?.toLowerCase() == 'w') torus.wKey = true;
    if (e.key?.toLowerCase() == 's') torus.sKey = true;
    if (e.key?.toLowerCase() == 'd') torus.aKey = true;
    if (e.key?.toLowerCase() == 'a') torus.dKey = true;
    if (e.key == 'Shift') torus.shift = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key?.toLowerCase() == 'w') torus.wKey = false;
    if (e.key?.toLowerCase() == 's') torus.sKey = false;
    if (e.key?.toLowerCase() == 'd') torus.aKey = false;
    if (e.key?.toLowerCase() == 'a') torus.dKey = false;
    if (e.key == 'Shift') torus.shift = false;
});
