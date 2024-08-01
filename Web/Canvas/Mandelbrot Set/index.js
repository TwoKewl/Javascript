const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.classList.add("remove-scrolling");

let xMin = -2.5, xMax = 1, yMin = -1, yMax = 1;
const maxIterations = 100;
const zoomFactor = 5;
const zoomCenter = { x: -0.9493185084853583, y: -0.25015574495841725 };

function clearScreen(r, g, b) {
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getColor(n) {
    const hue = Math.floor(360 * n / maxIterations);
    const saturation = 100;
    const lightness = n < maxIterations ? 50 : 0;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

class Complex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    squared() {
        return new Complex(this.x * this.x - this.y * this.y, 2 * this.x * this.y);
    }

    add(c) {
        return new Complex(this.x + c.x, this.y + c.y);
    }
}

function hslToRgb(hsl) {
    let [h, s, l] = hsl.match(/\d+/g).map(Number);
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

function mandelbrot(c) {
    let z = new Complex(0, 0);
    let n = 0;

    while (n < maxIterations) {
        z = z.squared().add(c);

        if (z.x * z.x + z.y * z.y > 4) {
            return n;
        }

        n++;
    }

    return maxIterations;
}

function render() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const complexX = xMin + x / canvas.width * (xMax - xMin);
            const complexY = yMin + y / canvas.height * (yMax - yMin);
            const n = mandelbrot(new Complex(complexX, complexY));
            const color = getColor(n);
            const rgb = hslToRgb(color);
            const index = (y * canvas.width + x) * 4;
            imageData.data[index] = rgb.r;
            imageData.data[index + 1] = rgb.g;
            imageData.data[index + 2] = rgb.b;
            imageData.data[index + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function zoomIn(centerX, centerY) {
    const newWidth = (xMax - xMin) / zoomFactor;
    const newHeight = (yMax - yMin) / zoomFactor;

    console.log(centerX, centerY);

    xMin = centerX - newWidth / 2;
    xMax = centerX + newWidth / 2;
    yMin = centerY - newHeight / 2;
    yMax = centerY + newHeight / 2;
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

var frame = 0;

function animate() {
    render();
    zoomIn(zoomCenter.x, zoomCenter.y);
    
    saveCanvasAsImage(`${getFrameAsString(frame)}.png`);
    frame++;

    requestAnimationFrame(animate);
}

function main() {
    clearScreen(0, 0, 0);
    // animate();
}

canvas.addEventListener('click', (event) => {
    const x = xMin + event.offsetX / canvas.width * (xMax - xMin);
    const y = yMin + event.offsetY / canvas.height * (yMax - yMin);
    zoomIn(x, y);
    render();
});

render();
