const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { Renderer } from './renderer.js';
import { Simulation } from './simulation.js';

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

export function line(sx, sy, ex, ey, r, g, b, a, thickness){
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.stroke();
}

function clearScreen(r, g, b){
    rect(0, 0, canvas.width, canvas.height, r, g, b, 1);
}

export const simulation = new Simulation(50, 20);
export const renderer = new Renderer(simulation, 20);

function tick() {
    clearScreen(0, 0, 20);
    renderer.render();
    simulation.tick();
}

setInterval(tick, 1000/60, false);