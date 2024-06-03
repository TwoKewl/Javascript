
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

    pickMove() {
        var moves = this.getAllMoves();
        return moves[Math.floor(Math.random() * moves.length)];
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
        console.log(evaluation);
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

    search(depth) {
        if (depth == 0) {
            return this.evaluate();
        }
    }
}