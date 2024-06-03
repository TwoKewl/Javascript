import { Board } from './board.js';
import { AI } from './ai.js';

var b = new Board("rnbqkbnr/pppppppp/////PPPPPPPP/RNBQKBNR/");
var ai = new AI(b.board);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var turn = 1;
var selectedPiece;
var selectedPieceMoves;

canvas.addEventListener('mousedown', (e) => {
    var kingCount = 0;
    b.board.forEach(row => {
        row.forEach(piece => {
            if (piece != 0 && piece.type == "King") {
                kingCount++;
            }
        });
    });

    if (kingCount != 2) {
        console.log("GAME OVER");
        return;
    }

    var x = Math.floor((e.x - window.screen.width / 2 + 400) / 100);
    var y = Math.floor((e.y - window.screen.height / 2 + 400) / 100);

    if (turn == 1) {
        if (selectedPiece && selectedPiece.colour == turn && (b.board[y] && (b.board[y][x] == 0 || (b.board[y][x] && b.board[y][x].colour != selectedPiece.colour)))) {
            console.log(selectedPieceMoves);
            if (selectedPieceMoves.find(move => move[0] == x && move[1] == y)) {
                b.makeMove(selectedPiece.x, selectedPiece.y, x, y, false);
                turn += 1;
                turn %= 2;

                                    
                ai.setBoard(b.board);
                var move = ai.pickMove();
                var start = move[0];
                var end = move[1];

                b.makeMove(start[0], start[1], end[0], end[1], false);

                turn += 1;
                turn %= 2;
            }
        } else {
            b.renderer.drawBoard();
            b.renderer.drawPieces(b.board);
            selectedPiece = b.board[y][x];
            if (selectedPiece && selectedPiece.colour == turn) {
                b.renderer.showMoves(selectedPiece.getMoves());
                selectedPieceMoves = [];
        
                selectedPiece.getMoves().forEach(move => {
                    selectedPieceMoves.push(move[1]);
                });
            }
        }
    }
});