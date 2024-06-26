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

                if (this.x > 0) {
                    if (this.board[this.y + 1][this.x - 1] != 0 && this.board[this.y + 1][this.x - 1].colour != this.colour) { // If one square forward and one square left is not empty
                        moves.push([[this.x, this.y], [this.x - 1, this.y + 1]]);
                    }
                }
                if (this.x < 7) {
                    if (this.board[this.y + 1][this.x + 1] != 0 && this.board[this.y + 1][this.x + 1].colour != this.colour) { // If one square forward and one square right is not empty
                        moves.push([[this.x, this.y], [this.x + 1, this.y + 1]]);
                    }
                }               
            }
        } else { // White Pieces
            if (this.board[this.y - 1]) { // If one square forward is empty
                if (this.board[this.y - 1][this.x] == 0) {
                    moves.push([[this.x, this.y], [this.x, this.y - 1]]);

                    if (this.board[this.y - 2] && this.board[this.y - 2][this.x] == 0 && this.y == 6) { // If two squares forward is empty
                        moves.push([[this.x, this.y], [this.x, this.y - 2]]);
                    }
                }

                if (this.x > 0) {
                    if (this.board[this.y - 1][this.x - 1] != 0 && this.board[this.y - 1][this.x - 1].colour != this.colour) { // If one square forward and one square left is not empty
                        moves.push([[this.x, this.y], [this.x - 1, this.y - 1]]);
                    }
                }
                if (this.x < 7) {
                    if (this.board[this.y - 1][this.x + 1] != 0 && this.board[this.y - 1][this.x + 1].colour != this.colour) { // If one square forward and one square right is not empty
                        moves.push([[this.x, this.y], [this.x + 1, this.y - 1]]);
                    }
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

    setBoard(board) {
        this.board = board;
    }

    getMoves() {
        var moves = [];

        if (this.board[this.y + 2]) {
            if (this.x + 1 < 8) {
                if ((this.board[this.y + 2][this.x + 1] != 0 && this.board[this.y + 2][this.x + 1].colour != this.colour) || this.board[this.y + 2][this.x + 1] == 0) {
                    moves.push([[this.x, this.y], [this.x + 1, this.y + 2]]);
                }
            }
            if (this.x - 1 >= 0) {
                if ((this.board[this.y + 2][this.x - 1] != 0 && this.board[this.y + 2][this.x - 1].colour != this.colour) || this.board[this.y + 2][this.x - 1] == 0) {
                    moves.push([[this.x, this.y], [this.x - 1, this.y + 2]]);
                }
            }
        }
        if (this.board[this.y - 2]) {
            if (this.x + 1 < 8) {
                if ((this.board[this.y - 2][this.x + 1] != 0 && this.board[this.y - 2][this.x + 1].colour != this.colour) || this.board[this.y - 2][this.x + 1] == 0) {
                    moves.push([[this.x, this.y], [this.x + 1, this.y - 2]]);
                }
            }
            if (this.x - 1 >= 0) {
                if ((this.board[this.y - 2][this.x - 1] != 0 && this.board[this.y - 2][this.x - 1].colour != this.colour) || this.board[this.y - 2][this.x - 1] == 0) {
                    moves.push([[this.x, this.y], [this.x - 1, this.y - 2]]);
                }
            }
        }
        if (this.board[this.y + 1]) {
            if (this.x + 2 < 8) {
                if ((this.board[this.y + 1][this.x + 2] != 0 && this.board[this.y + 1][this.x + 2].colour != this.colour) || this.board[this.y + 1][this.x + 2] == 0) {
                    moves.push([[this.x, this.y], [this.x + 2, this.y + 1]]);
                }
            }
            if (this.x - 2 >= 0) {
                if ((this.board[this.y + 1][this.x - 2] != 0 && this.board[this.y + 1][this.x - 2].colour != this.colour) || this.board[this.y + 1][this.x - 2] == 0) {
                    moves.push([[this.x, this.y], [this.x - 2, this.y + 1]]);
                }
            }
        }
        if (this.board[this.y - 1]) {
            if (this.x + 2 < 8) {
                if ((this.board[this.y - 1][this.x + 2] != 0 && this.board[this.y - 1][this.x + 2].colour != this.colour) || this.board[this.y - 1][this.x + 2] == 0) {
                    moves.push([[this.x, this.y], [this.x + 2, this.y - 1]]);
                }
            }
            if (this.x - 2 >= 0) {
                if ((this.board[this.y - 1][this.x - 2] != 0 && this.board[this.y - 1][this.x - 2].colour != this.colour) || this.board[this.y - 1][this.x - 2] == 0) {
                    moves.push([[this.x, this.y], [this.x - 2, this.y - 1]]);
                }
            }
        }

        return moves;
    }
}

export class Bishop {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Bishop";
    }

    setBoard(board) {
        this.board = board;
    }

    getMoves() {
        var moves = [];

        for (let i = 1; i < 8; i++) {
            if (this.y + i < 8 && this.x + i < 8) {
                if (this.board[this.y + i][this.x + i] == 0) {
                    moves.push([[this.x, this.y], [this.x + i, this.y + i]]);
                } else if (this.board[this.y + i][this.x + i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x + i, this.y + i]]);
                    break;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8; i++) {
            if (this.y + i < 8 && this.x - i >= 0) {
                if (this.board[this.y + i][this.x - i] == 0) {
                    moves.push([[this.x, this.y], [this.x - i, this.y + i]]);
                } else if (this.board[this.y + i][this.x - i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x - i, this.y + i]]);
                    break;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0 && this.x + i < 8) {
                if (this.board[this.y - i][this.x + i] == 0) {
                    moves.push([[this.x, this.y], [this.x + i, this.y - i]]);
                } else if (this.board[this.y - i][this.x + i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x + i, this.y - i]]);
                    break;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0 && this.x - i >= 0) {
                if (this.board[this.y - i][this.x - i] == 0) {
                    moves.push([[this.x, this.y], [this.x - i, this.y - i]]);
                } else if (this.board[this.y - i][this.x - i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x - i, this.y - i]]);
                    break;
                } else {
                    break;
                }
            }
        }

        return moves;
    }
}

export class Rook {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Rook";
    }
    
    setBoard(board) {
        this.board = board;
    }

    getMoves() {
        var moves = [];

        for (let i = 1; i < 8; i++) {
            if (this.y + i <= 7) {
                if (this.board[this.y + i][this.x] == 0) {
                    moves.push([[this.x, this.y], [this.x, this.y + i]]);
                } else if (this.board[this.y + i][this.x].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x, this.y + i]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0) {
                if (this.board[this.y - i][this.x] == 0) {
                    moves.push([[this.x, this.y], [this.x, this.y - i]]);
                } else if (this.board[this.y - i][this.x].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x, this.y - i]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.x + i <= 7) {
                if (this.board[this.y][this.x + i] == 0) {
                    moves.push([[this.x, this.y], [this.x + i, this.y]]);
                } else if (this.board[this.y][this.x + i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x + i, this.y]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.x - i >= 0) {
                if (this.board[this.y][this.x - i] == 0) {
                    moves.push([[this.x, this.y], [this.x - i, this.y]]);
                } else if (this.board[this.y][this.x - i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x - i, this.y]]);
                    break;
                } else break;
            } else break;
        }

        return moves;
    }
}

export class Queen {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Queen";
    }
    
    setBoard(board) {
        this.board = board;
    }

    getMoves() {
        var moves = [];

        for (let i = 1; i < 8; i++) {
            if (this.y + i <= 7) {
                if (this.board[this.y + i][this.x] == 0) {
                    moves.push([[this.x, this.y], [this.x, this.y + i]]);
                } else if (this.board[this.y + i][this.x].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x, this.y + i]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0) {
                if (this.board[this.y - i][this.x] == 0) {
                    moves.push([[this.x, this.y], [this.x, this.y - i]]);
                } else if (this.board[this.y - i][this.x].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x, this.y - i]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.x + i <= 7) {
                if (this.board[this.y][this.x + i] == 0) {
                    moves.push([[this.x, this.y], [this.x + i, this.y]]);
                } else if (this.board[this.y][this.x + i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x + i, this.y]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.x - i >= 0) {
                if (this.board[this.y][this.x - i] == 0) {
                    moves.push([[this.x, this.y], [this.x - i, this.y]]);
                } else if (this.board[this.y][this.x - i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x - i, this.y]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.y + i <= 7 && this.x + i <= 7) {
                if (this.board[this.y + i][this.x + i] == 0) {
                    moves.push([[this.x, this.y], [this.x + i, this.y + i]]);
                } else if (this.board[this.y + i][this.x + i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x + i, this.y + i]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.y + i <= 7 && this.x - i >= 0) {
                if (this.board[this.y + i][this.x - i] == 0) {
                    moves.push([[this.x, this.y], [this.x - i, this.y + i]]);
                } else if (this.board[this.y + i][this.x - i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x - i, this.y + i]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0 && this.x + i <= 7) {
                if (this.board[this.y - i][this.x + i] == 0) {
                    moves.push([[this.x, this.y], [this.x + i, this.y - i]]);
                } else if (this.board[this.y - i][this.x + i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x + i, this.y - i]]);
                    break;
                } else break;
            } else break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0 && this.x - i >= 0) {
                if (this.board[this.y - i][this.x - i] == 0) {
                    moves.push([[this.x, this.y], [this.x - i, this.y - i]]);
                } else if (this.board[this.y - i][this.x - i].colour != this.colour) {
                    moves.push([[this.x, this.y], [this.x - i, this.y - i]]);
                    break;
                } else break;
            } else break;
        }

        return moves;
    }
}

export class King {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "King";
    }
    
    setBoard(board) {
        this.board = board;
    }

    getMoves() {
        var moves = [];

        if (this.y - 1 >= 0 && this.x + 1 < 8) {
            if (this.board[this.y - 1][this.x + 1] == 0 || this.board[this.y - 1][this.x + 1].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x + 1, this.y - 1]]);
            }
        }
        if (this.y - 1 >= 0) {
            if (this.board[this.y - 1][this.x] == 0 || this.board[this.y - 1][this.x].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x, this.y - 1]]);
            }
        }
        if (this.y - 1 >= 0 && this.x - 1 >= 0) {
            if (this.board[this.y - 1][this.x - 1] == 0 || this.board[this.y - 1][this.x - 1].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x - 1, this.y - 1]]);
            }
        }
        if (this.x + 1 < 8) {
            if (this.board[this.y][this.x + 1] == 0 || this.board[this.y][this.x + 1].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x + 1, this.y]]);
            }
        }
        if (this.x - 1 >= 0) {
            if (this.board[this.y][this.x - 1] == 0 || this.board[this.y][this.x - 1].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x - 1, this.y]]);
            }
        }
        if (this.y + 1 < 8 && this.x + 1 < 8) {
            if (this.board[this.y + 1][this.x + 1] == 0 || this.board[this.y + 1][this.x + 1].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x + 1, this.y + 1]]);
            }
        }
        if (this.y + 1 < 8) {
            if (this.board[this.y + 1][this.x] == 0 || this.board[this.y + 1][this.x].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x, this.y + 1]]);
            }
        }
        if (this.y + 1 < 8 && this.x - 1 >= 0) {
            if (this.board[this.y + 1][this.x - 1] == 0 || this.board[this.y + 1][this.x - 1].colour != this.colour) {
                moves.push([[this.x, this.y], [this.x - 1, this.y + 1]]);
            }
        }

        return moves;
    }
}