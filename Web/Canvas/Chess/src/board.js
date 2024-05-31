import { rect, circle } from './drawing.js';
import { Piece } from './piece.js';

const cellSize = [100, 100];

export class Board {
    constructor(loadString, ) {
        this.board = this.loadBoard(loadString);
        this.pieces = [];
    }

    drawSquare(x, y) {
        var dx = (x - 4) * cellSize[0] + window.screen.width / 2;
        var dy = (y - 4) * cellSize[1] + window.screen.height / 2;

        if ((x + y) % 2 == 0) {
            rect(dx, dy, cellSize[0], cellSize[1], 238, 238, 210, 1);
        } else {
            rect(dx, dy, cellSize[0], cellSize[1], 58, 86, 150, 1);
        }
    }

    drawBoard() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                this.drawSquare(i, j);
            }
        }

        this.board.forEach((row) => {
            row.forEach((piece) => {
                if (piece != -1) {
                    piece.renderPiece();
                }
            });
        });
    }

    loadBoard(input) {
        var board = [];
        let row = [];
        let x = 0;

        let y = 0;
        if (input[input.length - 1] != '/') {
            input += '/';
        }

        input.split('').forEach((char) => {
            if (char == '/') {
                for (let i = x; i < 8; i++) {
                    row.push(-1);
                }

                x = 0;
                y++;

                board.push(row);
                row = [];
            } else {
                if (!isNaN(char)) {
                    for (let i = x; i < parseInt(char); i++) {
                        row.push(-1);
                    }
                    x++;
                } else {
                    if ('rnbqkp'.includes(char.toLowerCase())) {
                        row.push(new Piece(char.toLowerCase(), char == char.toLowerCase() ? 0 : 1, x, y, this.ctx));
                        x++;
                    }
                }
            }
        });

        board.forEach((row) => {
            row.forEach((piece) => {
                if (piece != -1) {
                    piece.setBoard(board);
                }
            });
        });

        return board;
    }

    getAllMoves(colour) {
        let moves = [];

        this.board.forEach((row) => {
            row.forEach((piece) => {
                if (piece != -1 && piece.colour == colour) {
                    let pieceMoves = piece.getMoves(colour);
                    if (pieceMoves) {
                        moves.push(...pieceMoves);
                    }
                }
            });
        });

        return moves;
    }
}