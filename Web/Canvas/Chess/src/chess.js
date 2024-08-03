const canvas = document.getElementById('chessBoard');
const ctx = canvas.getContext('2d');

import { Board } from "./board.js";

const b = new Board(ctx);
b.loadPieces();

canvas.addEventListener('click', (e) => {
    b.renderBoard();
    b.renderPieces();

    const x = Math.floor(e.offsetX / 100);
    const y = Math.floor(e.offsetY / 100);
    const piece = b.getPieceAt(x, y);
    
    piece ? b.renderLegalMoves(piece) : console.log('No piece found');
});