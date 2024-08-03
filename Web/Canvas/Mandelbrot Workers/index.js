const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.classList.add("remove-scrolling");

const WIDTH = canvas.width, HEIGHT = canvas.height;

let xMin = -5, xMax = 2, yMin = -2, yMax = 2;
[xMin, xMax, yMin, yMax].map((v) => {
    return BigInt(v);
});
const maxIterations = 1000;
const zoomCenter = { x: -0.5238097111941732, y: 0.6084824262963815 };

var workers = [];
var workerPromises = [];

const render = async (numWorkers) => {
    const imageData = ctx.createImageData(WIDTH, HEIGHT);

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker('worker.js');
        workers.push(worker);
        workerPromises.push(new Promise((resolve) => {
            const returnCount = HEIGHT / numWorkers;
            let n = 0;
            worker.onmessage = (e) => {
                n += 1;
                const { j, pixels } = e.data;
                for (let x = 0; x < pixels.length; x++) {
                    const i = (j * WIDTH + x) * 4;
                    imageData.data[i] = pixels[x][0];
                    imageData.data[i + 1] = pixels[x][1];
                    imageData.data[i + 2] = pixels[x][2];
                    imageData.data[i + 3] = 255;
                }

                if (n >= returnCount) resolve();
            };
        }));

        worker.postMessage({
            xMin,
            xMax,
            yMin,
            yMax,
            y: i * Math.floor(HEIGHT / numWorkers),
            h: Math.floor(HEIGHT / numWorkers),
            maxWidth: WIDTH,
            maxHeight: HEIGHT,
            maxIterations
        });
    }

    return Promise.all(workerPromises).then(() => {
        workers.forEach((worker) => worker.terminate());
        workers = [];
        workerPromises = [];
        return imageData;
    });
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

// canvas.addEventListener('click', async (e) => {
//     const x = xMin + (xMax - xMin) * e.offsetX / WIDTH;
//     const y = yMin + (yMax - yMin) * e.offsetY / HEIGHT;

//     console.log(x, y);

//     zoomIn({ x, y }, 100);

//     const imageData = await render(8);
//     ctx.putImageData(imageData, 0, 0);
// });

function zoomIn(zoomCenter, zoomFactor) {
    const dx = (xMax - xMin) / zoomFactor;
    const dy = (yMax - yMin) / zoomFactor;

    const newXMin = zoomCenter.x - dx / 2;
    const newXMax = zoomCenter.x + dx / 2;
    const newYMin = zoomCenter.y - dy / 2;
    const newYMax = zoomCenter.y + dy / 2;

    xMin = newXMin;
    xMax = newXMax;
    yMin = newYMin;
    yMax = newYMax;
}

var frame = 0;

async function update() {
    zoomIn(zoomCenter, 1.005);

    const imageData = await render(6);
    ctx.putImageData(imageData, 0, 0);

    saveCanvasAsImage(`${getFrameAsString(frame)}.png`);
    frame++;

    requestAnimationFrame(update);
}

(async function() {
    const initialImageData = await render(8);
    ctx.putImageData(initialImageData, 0, 0);

    update();
})();