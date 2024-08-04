import { Move } from "./move.js";

export class Piece {
    constructor(colour, type, x, y) {
        this.colour = colour;
        this.type = type;
        this.x = x;
        this.y = y;
    }

    getMoves(board) { }

    onMove() { }
}

export class Pawn extends Piece {
    constructor(colour, x, y) {
        super(colour, 'Pawn', x, y);

        this.justMovedTwo = false;
    }

    getMoves(board) {
        const moves = [];
        const direction = this.colour === 'White' ? -1 : 1;
        const x = this.x;
        const y = this.y;

        // Return if y is out of bounds
        if (y <= 0 || y >= 7) return moves;

        // Move forwards
        if (board[y + direction][x] === null) {
            moves.push(new Move(this, x, y + direction));
            if (((this.colour === 'White') === (y === 6)) && board[y + direction * 2][x] === null) {
                moves.push(new Move(this, x, y + direction * 2));
            }
        }

        // Capture diagonally
        if (x + 1 < 8) {
            if (board[y + direction][x + 1] !== null && board[y + direction][x + 1].colour !== this.colour) {
                moves.push(new Move(this, x + 1, y + direction));
            }
        }
        if (x - 1 > -1) {
            if (board[y + direction][x - 1] !== null && board[y + direction][x - 1].colour !== this.colour) {
                moves.push(new Move(this, x - 1, y + direction));
            }
        }
        
        // En Passant
        if (x + 1 < 8) {
            if (board[y][x + 1] !== null && board[y][x + 1].type == 'Pawn') {
                if (board[y][x + 1].justMovedTwo) {
                    moves.push(new Move(this, x + 1, y + direction, true));
                }
            }
        }
        if (x - 1 > -1) {
            if (board[y][x - 1] !== null && board[y][x - 1].type == 'Pawn') {
                if (board[y][x - 1].justMovedTwo) {
                    moves.push(new Move(this, x - 1, y + direction, true));
                }
            }
        }

        return moves;
    }
}

export class Knight extends Piece {
    constructor(colour, x, y) {
        super(colour, 'Knight', x, y);
    }

    getMoves(board) {
        const moves = [];
        
        const options = [
            new Move(this, this.x + 2, this.y + 1),
            new Move(this, this.x + 2, this.y - 1),
            new Move(this, this.x - 2, this.y + 1),
            new Move(this, this.x - 2, this.y - 1),
            new Move(this, this.x + 1, this.y + 2),
            new Move(this, this.x + 1, this.y - 2),
            new Move(this, this.x - 1, this.y + 2),
            new Move(this, this.x - 1, this.y - 2)
        ];

        for (const move of options) {
            if (move.x > -1 && move.x < 8 && move.y > -1 && move.y < 8) {
                if (board[move.y][move.x] === null) {
                    moves.push(move);
                    continue;
                }

                if (board[move.y][move.x].colour !== this.colour) {
                    moves.push(move);
                }
            }
        }

        return moves;
    }
}

export class Rook extends Piece {
    constructor(colour, x, y) {
        super(colour, 'Rook', x, y);

        this.canCastle = (this.x == 0 || this.x == 7) && ((this.colour == 'White') == (this.y == 7));
    }

    getMoves(board) {
        const moves = [];

        for (let x = this.x + 1; x < 8; x++) {
            if (board[this.y][x] == null) {
                moves.push(new Move(this, x, this.y))
                continue;
            }

            if (board[this.y][x].colour == this.colour) {
                break;
            } else {
                moves.push(new Move(this, x, this.y));
                break;
            }
        }

        for (let x = this.x - 1; x > -1; x--) {
            if (board[this.y][x] == null) {
                moves.push(new Move(this, x, this.y))
                continue;
            }

            if (board[this.y][x].colour == this.colour) {
                break;
            } else {
                moves.push(new Move(this, x, this.y));
                break;
            }
        }

        for (let y = this.y + 1; y < 8; y++) {
            if (board[y][this.x] == null) {
                moves.push(new Move(this, this.x, y))
                continue;
            }

            if (board[y][this.x].colour == this.colour) {
                break;
            } else {
                moves.push(new Move(this, this.x, y));
                break;
            }
        }

        for (let y = this.y - 1; y > -1; y--) {
            if (board[y][this.x] == null) {
                moves.push(new Move(this, this.x, y))
                continue;
            }

            if (board[y][this.x].colour == this.colour) {
                break;
            } else {
                moves.push(new Move(this, this.x, y));
                break;
            }
        }

        return moves;
    }

    onMove() {
        this.canCastle = false;
    }
}

export class Bishop extends Piece {
    constructor(colour, x, y) {
        super(colour, 'Bishop', x, y);
    }

    getMoves(board) {
        const moves = [];

        for (let delta = 1; this.x + delta < 8 && this.y + delta < 8; delta++) {
            if (board[this.y + delta][this.x + delta] == null) {
                moves.push(new Move(this, this.x + delta, this.y + delta));
            } else {
                if (board[this.y + delta][this.x + delta].colour !== this.colour) {
                    moves.push(new Move(this, this.x + delta, this.y + delta));
                }
                break;
            }
        }

        for (let delta = 1; this.x - delta > -1 && this.y + delta < 8; delta++) {
            if (board[this.y + delta][this.x - delta] == null) {
                moves.push(new Move(this, this.x - delta, this.y + delta));
            } else {
                if (board[this.y + delta][this.x - delta].colour !== this.colour) {
                    moves.push(new Move(this, this.x - delta, this.y + delta));
                }
                break;
            }
        }

        for (let delta = 1; this.x + delta < 8 && this.y - delta > -1; delta++) {
            if (board[this.y - delta][this.x + delta] == null) {
                moves.push(new Move(this, this.x + delta, this.y - delta));
            } else {
                if (board[this.y - delta][this.x + delta].colour !== this.colour) {
                    moves.push(new Move(this, this.x + delta, this.y - delta));
                }
                break;
            }
        }

        for (let delta = 1; this.x - delta > -1 && this.y - delta > -1; delta++) {
            if (board[this.y - delta][this.x - delta] == null) {
                moves.push(new Move(this, this.x - delta, this.y - delta));
            } else {
                if (board[this.y - delta][this.x - delta].colour !== this.colour) {
                    moves.push(new Move(this, this.x - delta, this.y - delta));
                }
                break;
            }
        }

        return moves;
    }
}

export class Queen extends Piece {
    constructor(colour, x, y) {
        super(colour, 'Queen', x, y);
    }

    getMoves(board) {
        const moves = [];

        new Rook(this.colour, this.x, this.y).getMoves(board).forEach((move) => moves.push(move));
        new Bishop(this.colour, this.x, this.y).getMoves(board).forEach((move) => moves.push(move));

        return moves;
    }
}

export class King extends Piece {
    constructor(colour, x, y) {
        super(colour, 'King', x, y);

        this.canCastle = this.x == 4 && ((this.colour == 'White') == (this.y == 7));
    }

    getMoves(board) {
        const moves = [];

        const options = [
            new Move(this, this.x + 1, this.y + 1),
            new Move(this, this.x + 1, this.y - 1),
            new Move(this, this.x - 1, this.y + 1),
            new Move(this, this.x - 1, this.y - 1),
            new Move(this, this.x + 1, this.y),
            new Move(this, this.x - 1, this.y),
            new Move(this, this.x, this.y + 1),
            new Move(this, this.x, this.y - 1)
        ];

        for (const move of options) {
            if (move.x > -1 && move.x < 8 && move.y > -1 && move.y < 8) {
                if (board[move.y][move.x] === null) {
                    moves.push(move);
                    continue;
                }

                if (board[move.y][move.x].colour !== this.colour) {
                    moves.push(move);
                }
            }
        }

        // Handle castling
        if (board[this.y][0] !== null && board[this.y][0].type == 'Rook' && board[this.y][0].canCastle && this.canCastle) {
            if (board[this.y][1] === null && board[this.y][2] === null && board[this.y][3] === null) {
                moves.push(new Move(this, this.x - 2, this.y, false, true));
            }
        }
        if (board[this.y][7] !== null && board[this.y][7].type == 'Rook' && board[this.y][7].canCastle && this.canCastle) {
            if (board[this.y][6] === null && board[this.y][5] === null) {
                moves.push(new Move(this, this.x + 2, this.y, false, false, true));
            }
        }

        return moves
    }

    onMove() {
        this.canCastle = false;
    }
}