
class Complex {
    constructor(x, y) { this.x = x; this.y = y; }
    add(c) { return new Complex(this.x + c.x, this.y + c.y); }
    square() { return new Complex(this.x * this.x - this.y * this.y, 2 * this.x * this.y); }
}

self.addEventListener('message', async (event) => {
    const { xMin, xMax, yMin, yMax, y, h, maxWidth, maxHeight, maxIterations } = event.data;
    
    var pixels = [];

    for (let j = y; j < y + h; j++) {
        for (let i = 0; i < maxWidth; i++) {
            const x = xMin + (xMax - xMin) * i / maxWidth;
            const y = yMin + (yMax - yMin) * j / maxHeight;
            const n = mandelbrot(x, y, maxIterations);
            pixels.push(getColour(n, maxIterations));
        }

        self.postMessage({ j, pixels });
        pixels = [];
    }
});

const mandelbrot = (x, y, maxIterations) => {
    var c = new Complex(x, y);
    var z = new Complex(0, 0);
    var n = 0;

    while (n < maxIterations) {
        z = z.square().add(c);
        if (z.x * z.x + z.y * z.y > 4) return n;
        n++;
    }

    return maxIterations;
};

const getColour = (n, maxIterations) => {
    if (n === maxIterations) return [0, 0, 0];
    var blue = 255 * Math.sqrt(n / maxIterations);
    blue = Math.min(255, blue * 1.5);
    if (blue == 0) return [0, 0, 30];

    return [blue / 5, blue / 5, blue];
};