import { simulation, renderer } from "./index.js";

console.log(simulation);

var mouseDown = false;
var closest;

document.addEventListener('mousemove', (evt) => handleMouseMove(evt));
document.addEventListener('mousedown', (evt) => {
    mouseDown = true;



    closest = getClosestPoint(evt.x, evt.y);
    closest.setFixed(true);
});
document.addEventListener('mouseup', (evt) => {
    mouseDown = false;
    closest.setFixed(false);
});

function handleMouseMove(evt) {
    const x = evt.x
    const y = evt.y

    if (mouseDown) {
        closest.x = (x - renderer.offset[0]) / renderer.scale;
        closest.y = (y - renderer.offset[1]) / renderer.scale;
    } else {
        closest = null;
    }
}

function getClosestPoint(x, y) {
    var closestPoint

    for (const dot of simulation.dots) {
        const dx = dot.x * renderer.scale + renderer.offset[0];
        const dy = dot.y * renderer.scale + renderer.offset[1];
        const dist = Math.sqrt((x - dx)**2 + (y - dy)**2);

        if (!closestPoint || dist < closestPoint[0]) {
            closestPoint = [dist, dot];
        }
    }

    return closestPoint[1];
}