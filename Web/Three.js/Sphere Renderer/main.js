
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.screen.width / window.screen.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.screen.width, window.screen.height);
document.body.appendChild(renderer.domElement);

camera.position.z = 10;

class Circle {
    constructor() {
        this.position = generateSphericalPosition(5);
        this.radius = 0.05;

		this.red = Math.random() * 150;
        this.green = 0;
        this.blue = Math.random() * 150 + 50;

        this.multi = 255 / (Math.max(this.red, this.green, this.blue) + 1);

        this.red *= this.multi;
        this.green *= this.multi;
        this.blue *= this.multi;

        this.colour = 0xffffff;

        this.geometry = new THREE.CircleGeometry(this.radius, 128);
        this.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(this.getColour()) });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        scene.add(this.mesh);
    }

    rotateX(angle) {
        const sin = Math.sin, cos = Math.cos;
        const matrix = [
            [cos(angle), 0, sin(angle)],
            [0, 1, 0],
            [-sin(angle), 0, cos(angle)]
        ];

        this.multiplyPosByMatrix(matrix);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

	rotateY(angle) {
		const sin = Math.sin, cos = Math.cos;
		const matrix = [
			[1, 0, 0],
			[0, cos(angle), -sin(angle)],
			[0, sin(angle), cos(angle)]
		];

		this.multiplyPosByMatrix(matrix);
		this.mesh.position.set(this.position.x, this.position.y, this.position.z);
	}
	
	rotateZ(angle) {
		const sin = Math.sin, cos = Math.cos;
		const matrix = [
			[cos(angle), -sin(angle), 0],
			[sin(angle), cos(angle), 0],
			[0, 0, 1]
		];

		this.multiplyPosByMatrix(matrix);
		this.mesh.position.set(this.position.x, this.position.y, this.position.z);
	}

    multiplyPosByMatrix(matrix) {
        const position = this.position;
        const x = position.x * matrix[0][0] + position.y * matrix[0][1] + position.z * matrix[0][2];
        const y = position.x * matrix[1][0] + position.y * matrix[1][1] + position.z * matrix[1][2];
        const z = position.x * matrix[2][0] + position.y * matrix[2][1] + position.z * matrix[2][2];

        this.position = new THREE.Vector3(x, y, z);
    }

	getColour() {
		var r = Math.random() * 150;
		var g = 50
		var b = Math.random() * 150 + 50;

		var multi = 255 / (Math.max(r, g, b) + 1);

		r *= multi;
		g *= multi;
		b *= multi;

		r = Math.floor(r);
		g = Math.floor(g);
		b = Math.floor(b);

		return `rgb(${r}, ${g}, ${b})`;
	}
}

function generateSphericalPosition(circleRadius) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = circleRadius * Math.sin(phi) * Math.cos(theta);
    const y = circleRadius * Math.sin(phi) * Math.sin(theta);
    const z = circleRadius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

const circles = [];
for (let i = 0; i < 1000; i++) {
    circles.push(new Circle());
}

function saveCanvasAsImage(fileName) {
    const canvas = renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getFrameAsString(frame) {
    return frame.toString().padStart(4, '0');
}

var frame = 0;

function animate() {
    circles.forEach(circle => {
		circle.rotateX(0.0025);
    });

    renderer.render(scene, camera);

    // saveCanvasAsImage(`${getFrameAsString(frame)}.png`);
    frame += 1;

	if (frame < 5000) setTimeout(() => requestAnimationFrame(animate), 0);
} animate();