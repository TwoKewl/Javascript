import { rect } from './drawing.js';
import * as piece from './piece.js';
import { Renderer } from './renderer.js';

export class Board {
    constructor(loadString) {
        this.board = this.loadBoard(loadString);
        this.pieces = [];
        this.renderer = new Renderer();
        console.log(this.board);
        this.renderer.init(this.board);
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

        return board;
    }
}