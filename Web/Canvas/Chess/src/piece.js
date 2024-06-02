import * as draw from './drawing.js';

export class Pawn {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Pawn";
        this.enPassant = true;
    }

    setBoard(board) {
        this.board = board;
    }

    getMoves() {
        var moves = [];

        if (this.colour == 0) { // Black Pieces
            if (this.board[this.y + 1] && this.board[this.y + 1][this.x] == 0) { // If one square forward is empty
                moves.push([[this.x, this.y], [this.x, this.y + 1]]);

                if (this.board[this.y + 2] && this.board[this.y + 2][this.x] == 0 && this.y == 1) { // If two squares forward is empty
                    moves.push([[this.x, this.y], [this.x, this.y + 2]]);
                }
            }
        } else {
            if (this.board[this.y - 1] && this.board[this.y - 1][this.x] == 0) { // If one square forward is empty
                moves.push([[this.x, this.y], [this.x, this.y - 1]]);

                if (this.board[this.y - 2] && this.board[this.y - 2][this.x] == 0 && this.y == 6) { // If two squares forward is empty
                    moves.push([[this.x, this.y], [this.x, this.y - 2]]);
                }
            }
        }

        return moves;
    }
}

export class Knight {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Knight";
    }
}

export class Bishop {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Bishop";
    }
}

export class Rook {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Rook";
    }
}

export class Queen {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Queen";
    }
}

export class King {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "King";
    }
}