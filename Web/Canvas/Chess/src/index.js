const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import * as draw from './drawing.js';
import { Board } from './board.js';

draw.init(ctx);

canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.classList.add("remove-scrolling");

var b = new Board("rnbqkbnr/pppppppp/////PPPPPPPP/RNBQKBNR", ctx);

function tick() {
    draw.clearScreen(85, 51, 17, 1);
    b.drawBoard();
}

tick();