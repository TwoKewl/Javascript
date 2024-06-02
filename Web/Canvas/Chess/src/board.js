import * as piece from './piece.js';
import { Renderer } from './renderer.js';

export class Board {
    constructor(loadString) {
        this.renderer = new Renderer();
        this.board = this.loadBoard(loadString);
        this.renderer.init(this.board);

        this.getAllMoves(1);

        this.pieces = [];
        
        // this.renderer.initChessPieces(this.board);
    }

    loadBoard(input) {
        var board = [];
        var row = [];
        var x = 0;
        var y = 0;

        if (input[input.length - 1] != "/") {
            input += '/';
        }

        input.split('').forEach((char) => {
            if (char == '/') {
                for (let i = x; i < 8; i++) {
                    row.push(0);
                }

                x = 0;
                y++;

                board.push(row);
                row = [];
            } else if (!isNaN(char)) {
                for (let i = 0; i < parseInt(char); i++) row.push(0);
                x += parseInt(char);
            } else {
                switch (char) {
                    case "p":
                        row.push(new piece.Pawn(x, y, 0));
                        break;
                    case "P":
                        row.push(new piece.Pawn(x, y, 1));
                        break;
                    case "n":
                        row.push(new piece.Knight(x, y, 0));
                        break;
                    case "N":
                        row.push(new piece.Knight(x, y, 1));
                        break;
                    case "b":
                        row.push(new piece.Bishop(x, y, 0));
                        break;
                    case "B":
                        row.push(new piece.Bishop(x, y, 1));
                        break;
                    case "r":
                        row.push(new piece.Rook(x, y, 0));
                        break;
                    case "R":
                        row.push(new piece.Rook(x, y, 1));
                        break;
                    case "q":
                        row.push(new piece.Queen(x, y, 0));
                        break;
                    case "Q":
                        row.push(new piece.Queen(x, y, 1));
                        break;
                    case "k":
                        row.push(new piece.King(x, y, 0));
                        break;
                    case "K":
                        row.push(new piece.King(x, y, 1));
                        break;
                    default:
                        row.push(0);
                }

                x++;
            }

        });

        board.forEach(row => {
            row.forEach(piece => {
                if (piece != 0 && piece.type == 'Pawn') {
                    piece.setBoard(board);
                }
            });
        });

        return board;
    }

    getAllMoves(colour) {
        var moves = [];

        this.board.forEach(row => {
            row.forEach(piece => {
                if (piece != 0 && piece.type == "Pawn" && piece.colour == colour) {
                    moves.push(...piece.getMoves());
                }
            });
        });

        this.renderer.showMoves(moves);

        return moves;
    }
}