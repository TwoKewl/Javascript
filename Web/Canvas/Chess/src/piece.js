
const capitaliseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export class Pawn {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.imageName = `${capitaliseFirstLetter(color)} Pawn.png`
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    getLegalMoves(board) {
        const moves = [];
        const dy = this.color === 'white' ? -1 : 1;

        if (this.y + dy < 0 || this.y + dy > 7) {
            return moves;
        }

        if (board[this.x][this.y + dy] === null) {
            moves.push([this.x, this.y + dy]);
            if (board[this.x][this.y + dy * 2] === null && this.color === 'white' ? this.y === 6 : this.y === 1) {
                moves.push([this.x, this.y + dy * 2]);
            }
        }

        if (this.x - 1 >= 0 && (board[this.x - 1][this.y + dy] !== null && board[this.x - 1][this.y + dy].color !== this.color)) {
            moves.push([this.x - 1, this.y + dy]);
        }
        if (this.x + 1 < 8 && (board[this.x + 1][this.y + dy] !== null && board[this.x + 1][this.y + dy].color !== this.color)) {
            moves.push([this.x + 1, this.y + dy]);
        }

        return moves;
    }
}

export class Rook {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.imageName = `${capitaliseFirstLetter(color)} Rook.png`
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    getLegalMoves(board) {
        const moves = [];

        for (let i = this.x + 1; i < 8; i++) {
            if (board[i][this.y] === null) {
                moves.push([i, this.y]);
            } else {
                if (board[i][this.y].color !== this.color) {
                    moves.push([i, this.y]);
                }
                break;
            }
        }

        for (let i = this.x - 1; i >= 0; i--) {
            if (board[i][this.y] === null) {
                moves.push([i, this.y]);
            } else {
                if (board[i][this.y].color !== this.color) {
                    moves.push([i, this.y]);
                }
                break;
            }
        }

        for (let i = this.y + 1; i < 8; i++) {
            if (board[this.x][i] === null) {
                moves.push([this.x, i]);
            } else {
                if (board[this.x][i].color !== this.color) {
                    moves.push([this.x, i]);
                }
                break;
            }
        }

        for (let i = this.y - 1; i >= 0; i--) {
            if (board[this.x][i] === null) {
                moves.push([this.x, i]);
            } else {
                if (board[this.x][i].color !== this.color) {
                    moves.push([this.x, i]);
                }
                break;
            }
        }

        return moves;
    }
}

export class Knight {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.imageName = `${capitaliseFirstLetter(color)} Knight.png`
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    getLegalMoves(board) {
        const moves = [];
        const delta = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]

        for (const [dx, dy] of delta) {
            const newX = this.x + dx;
            const newY = this.y + dy;

            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && (board[newX][newY] === null || board[newX][newY].color !== this.color)) {
                moves.push([newX, newY]);
            }
        }

        return moves;
    }
}

export class Bishop {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.imageName = `${capitaliseFirstLetter(color)} Bishop.png`
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Queen {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.imageName = `${capitaliseFirstLetter(color)} Queen.png`
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class King {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.imageName = `${capitaliseFirstLetter(color)} King.png`
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}