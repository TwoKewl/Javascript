
export class AI {
    constructor(board) {
        this.board = board;
        this.depth = 3;
        this.colour = 0;
    }

    setBoard(board) {
        this.board = board;
        this.evaluate();
    }

    pickMove(boardInstance) {
        var moves = this.getAllMoves();
        var evaluations = [];

        moves.forEach(move => {
            var pieces = this.makeMove(boardInstance, move[0][0], move[0][1], move[1][0], move[1][1]);
            evaluations.push([move, this.evaluate()]);
            this.undoMove(boardInstance, pieces[0], pieces[1], move[0][0], move[0][1], move[1][0], move[1][1]);
        });

        var bestMove = evaluations.reduce((a, b) => a[1] < b[1] ? a : b);

        return bestMove[0];
    }

    getAllMoves() {
        var moves = [];

        this.board.forEach(row => {
            row.forEach(piece => {
                if (piece != 0 && piece.colour == this.colour) {
                    moves.push(...piece.getMoves());
                }
            });
        });

        return moves;
    }

    evaluate() {
        var pawnValue = 1;
        var knightValue = 3;
        var bishopValue = 3;
        var rookValue = 5;
        var queenValue = 9;
        var kingValue = 100;

        var blackEval = this.countMaterial(0, pawnValue, knightValue, bishopValue, rookValue, queenValue, kingValue);
        var whiteEval = this.countMaterial(1, pawnValue, knightValue, bishopValue, rookValue, queenValue, kingValue);

        var evaluation = whiteEval - blackEval;

        return evaluation;
    }

    countMaterial(colour, pawnValue, knightValue, bishopValue, rookValue, queenValue, kingValue) {
        var material = 0;

        this.board.forEach(row => {
            row.forEach(piece => {
                if (piece != 0) {
                    if (piece.colour == colour) {
                        switch (piece.type) {
                            case "Pawn":
                                material += pawnValue;
                                break;
                            case "Knight":
                                material += knightValue;
                                break;
                            case "Bishop":
                                material += bishopValue;
                                break;
                            case "Rook":
                                material += rookValue;
                                break;
                            case "Queen":
                                material += queenValue;
                                break;
                            case "King":
                                material += kingValue;
                                break;
                        }
                    }
                }
            });
        });

        return material;
    }

    search(boardInstance, depth) {
        
    }

    checkInCheck() {
        var kingPos = this.getKingPos();
        var kingX = kingPos[0];
        var kingY = kingPos[1];

        var moves = this.getAllMoves();

        var check = moves.find(move => move[1][0] == kingX && move[1][1] == kingY);

        if (check) {
            
        }
    }

    makeMove(boardInstance, x, y, nx, ny) {
        var piece = boardInstance.board[y][x];
        var takenPiece = boardInstance.board[ny][nx];
        if (piece) {
            boardInstance.board[y][x] = 0;
            boardInstance.board[ny][nx] = piece;
            piece.x = nx;
            piece.y = ny;
        }

        return [piece, takenPiece];
    }

    undoMove(boardInstance, piece, takenPiece, px, py, tx, ty) {
        if (piece) {
            boardInstance.board[py][px] = piece;
            piece.x = px;
            piece.y = py;
            boardInstance.board[ty][tx] = takenPiece;
            if (takenPiece) {
                takenPiece.x = tx;
                takenPiece.y = ty;
            }
        }
    }
}