
export class Move {
    constructor(piece, x, y, isEnPassant = false, isCastleLeft = false, isCastleRight = false) {
        this.piece = piece;
        this.x = x;
        this.y = y;

        this.isEnPassant = isEnPassant;
        this.isCastleLeft = isCastleLeft;
        this.isCastleRight = isCastleRight;
    }
}