import * as piece from './piece.js';
import { Renderer } from './renderer.js';

export class Board {
    constructor(loadString) {
        this.renderer = new Renderer();
        this.board = this.loadBoard(loadString);
        this.renderer.init(this.board);

        var moves = this.getAllMoves(1);
        this.renderer.showMoves(moves);

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
                if (piece != 0) {
                    piece.setBoard(board);
                }
            });
        });

        return board;
    }
    
    setBoardForAllPieces() {
        this.board.forEach(row => {
            row.forEach(piece => {
                if (piece != 0) {
                    piece.setBoard(this.board);
                }
            });
        });
    }

    getAllMoves(colour) {
        var moves = [];

        this.board.forEach(row => {
            row.forEach(piece => {
                if (piece != 0 && piece.colour == colour) {
                    moves.push(...piece.getMoves());
                }
            });
        });

        return moves;
    }

    makeMove(x, y, nx, ny) {
        var piece = this.board[y][x];
        if (piece) {
            // console.log(piece);

            this.board[y][x] = 0;
            this.board[ny][nx] = piece;
            piece.x = nx;
            piece.y = ny;

            if (piece.type == "Pawn" && (ny == 0 || ny == 7)) {
                console.log("PROMOTION");
                this.handlePawnPromotion(nx, ny);
            }
            
            var moves = this.getAllMoves(1);
            this.renderer.onPieceMove(this.board, moves);
        }
    }

    handlePawnPromotion(x, y) {
        var pieceOnBoard = this.board[y][x];

        console.log(pieceOnBoard);

        if (pieceOnBoard) {
            console.log(`Pawn at ${x}, ${y} is being promoted`);
            this.board[y][x] = new piece.Queen(x, y, pieceOnBoard.colour);
            this.setBoardForAllPieces();
        }
    }
}