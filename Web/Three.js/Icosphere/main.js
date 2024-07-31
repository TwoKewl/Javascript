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
    constructor(pos1, pos2, pos3) {
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.pos3 = pos3;
    }

    render() {
        const pos1 = convertTo2D(this.pos1);
        const pos2 = convertTo2D(this.pos2);
        const pos3 = convertTo2D(this.pos3);

        line(pos1.x, pos1.y, pos2.x, pos2.y, 255, 255, 255, 1, 2);
        line(pos2.x, pos2.y, pos3.x, pos3.y, 255, 255, 255, 1, 2);
        line(pos3.x, pos3.y, pos1.x, pos1.y, 255, 255, 255, 1, 2);
    }

    getMidpoint(pos1, pos2) {
        return new THREE.Vector3((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2, (pos1.z + pos2.z) / 2);
    }

    split() {
        const mid1 = this.getMidpoint(this.pos1, this.pos2);
        const mid2 = this.getMidpoint(this.pos2, this.pos3);
        const mid3 = this.getMidpoint(this.pos3, this.pos1);

        return [
            new Triangle(this.pos1, mid1, mid3),
            new Triangle(mid1, this.pos2, mid2),
            new Triangle(mid3, mid2, this.pos3),
            new Triangle(mid1, mid2, mid3)
        ];
    }
}

function convertTo2D(pos) {
    const scale = 2000;
    const x = (pos.x / (pos.z + 5) * scale) + canvas.width / 2;
    const y = (pos.y / (pos.z + 5) * scale) + canvas.height / 2;

    return { x, y };
}

class Tetrahedron {
    constructor() {
        this.triangles = [];
        this.vertices = [];

        this.addStartingTriangles();
        this.addVertices();

        this.centroid = this.calculateCentroid();

        this.maxDistance = 1;

        this.triangles = this.triangles.map((t) => {
            t.pos1.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            t.pos2.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            t.pos3.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

            return t;
        });
    }

    calculateCentroid() {
        const center = new THREE.Vector3(0, 0, 0);

        this.vertices.forEach(v => {
            center.add(v);
        });

        return center;
    }

    addStartingTriangles() {
        const c1 = new THREE.Vector3(Math.sin(0), Math.cos(0), 1);
        const c2 = new THREE.Vector3(Math.sin(Math.PI * 2 / 3), Math.cos(Math.PI * 2 / 3), 1);
        const c3 = new THREE.Vector3(Math.sin(Math.PI * 4 / 3), Math.cos(Math.PI * 4 / 3), 1);
        const c4 = new THREE.Vector3(0, 0, -1/3);

        c1.add(new THREE.Vector3(0, 0, -2/3));
        c2.add(new THREE.Vector3(0, 0, -2/3));
        c3.add(new THREE.Vector3(0, 0, -2/3));
        c4.add(new THREE.Vector3(0, 0, -2/3));

        this.triangles.push(new Triangle(c1, c2, c3));
        this.triangles.push(new Triangle(c1, c2, c4));
        this.triangles.push(new Triangle(c2, c3, c4));
        this.triangles.push(new Triangle(c3, c1, c4));
    }

    rotate() {
        this.triangles = this.triangles.map((t) => {
            t.pos1.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0025);
            t.pos2.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0025);
            t.pos3.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0025);

            return t;
        });
    }

    split() {
        const newTriangles = [];

        this.triangles.forEach(t => {
            newTriangles.push(...t.split());
        });

        this.triangles = newTriangles;

        this.addVertices();
    }

    addVertices() {
        this.vertices = new Set();

        this.triangles.forEach(t => {
            this.vertices.add(t.pos1);
            this.vertices.add(t.pos2);
            this.vertices.add(t.pos3);
        });

        this.vertices = Array.from(this.vertices);
    }

    render() {
        this.rotate();
        this.triangles.forEach(t => t.render());

        const c = convertTo2D(this.centroid);
        circle(c.x, c.y, 5, 255, 0, 0, 1);
    }

    pushOut() {
        this.vertices = this.vertices.map(v => {
            v.normalize();
        });
    }

    getFurthestFromCenter(pos1, pos2, pos3) {
        const center = new THREE.Vector3(0, 0, 0);
        const dist1 = pos1.distanceTo(center);
        const dist2 = pos2.distanceTo(center);
        const dist3 = pos3.distanceTo(center);

        if (dist1 > dist2 && dist1 > dist3) {
            return pos1;
        } else if (dist2 > dist1 && dist2 > dist3) {
            return pos2;
        } else {
            return pos3;
        }
    }
}

const tetrahedron = new Tetrahedron();
tetrahedron.split();
tetrahedron.split();
tetrahedron.split();
tetrahedron.split();


tetrahedron.pushOut();

function tick() {
    clearScreen(0, 0, 0);

    tetrahedron.render();

    requestAnimationFrame(tick);
}

tick();