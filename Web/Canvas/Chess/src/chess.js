const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
import { Board } from "./board.js";

const board = new Board(ctx, canvas.width, canvas.height);
var selectedPiece = null;
var moves = [];
var isWhiteTurn = true;

canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / (canvas.width / 8));
    const y = Math.floor(e.offsetY / (canvas.height / 8));

    const piece = board.board[y][x];

    board.renderBoard();
    board.renderPieces();

    if (!selectedPiece) {
        if (!piece || ((piece.colour != 'White') == isWhiteTurn)) return;
        selectedPiece = piece;
        moves = selectedPiece.getMoves(board.board);
        board.renderMoves(selectedPiece);
    } else {
        if (piece && piece.colour == selectedPiece.colour) {
            selectedPiece = piece;
            moves = selectedPiece.getMoves(board.board);
            board.renderMoves(selectedPiece);
        } else {
            const move = moves.find((move) => move.x == x && move.y == y);
            if (move) {
                board.makeMove(selectedPiece, move);
                isWhiteTurn = !isWhiteTurn;
            }
            selectedPiece = null;
        }
    }
});