const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { BlackHole } from "./classes.js";

canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.classList.add("remove-scrolling");

function rect(x, y, width, height, r, g, b, a, fill = true){
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

export function circle(x, y, radius, r, g, b, a, fill = true, thickness = 2){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill){
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    }
    else{
        ctx.lineWidth = thickness;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.stroke();
    }
}

function clearScreen(r, g, b){
    rect(0, 0, canvas.width, canvas.height, r, g, b, 1);
}

const blackHoles = [];

for (let i = 0; i < 15; i++) {
    if (Math.random() < 1) {
        blackHoles.push(new BlackHole(Math.random() * 5))
    }
}

function tick() {
    clearScreen(0, 0, 10);
    
    blackHoles.forEach((blackHole) => {
        blackHole.getVelocity(blackHoles);
    });
}

setInterval(tick, 1000/60, false);