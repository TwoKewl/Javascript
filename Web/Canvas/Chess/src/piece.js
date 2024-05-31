import { drawImage, line, circle } from "./drawing.js";


export class Piece {
    constructor(pieceType, color, x, y, ctx) {
        this.type = pieceType;
        this.colour = color;
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.image = null;
        this.imagePath = './../Resources/';
        this.setImage();
    }

    setBoard(board) {
        this.board = board;
    }

    setImage() {
        switch (this.type) {
            case "p":
                var image = new Image();
                image.src = this.imagePath + (this.colour == 0 ? 'Black Pawn.png' : 'White Pawn.png');
                image.onload = () => {
                    this.image = image;
                    this.renderPiece();
                };
                break;
            case "b":
                var image = new Image();
                image.src = this.imagePath + (this.colour == 0 ? 'Black Bishop.png' : 'White Bishop.png');
                image.onload = () => {
                    this.image = image;
                    this.renderPiece();
                };
                break;
            case "n":
                var image = new Image();
                image.src = this.imagePath + (this.colour == 0 ? 'Black Knight.png' : 'White Knight.png');
                image.onload = () => {
                    this.image = image;
                    this.renderPiece();
                };
                break;
            case "r":
                var image = new Image();
                image.src = this.imagePath + (this.colour == 0 ? 'Black Rook.png' : 'White Rook.png');
                image.onload = () => {
                    this.image = image;
                    this.renderPiece();
                };
                break;
            case "q":
                var image = new Image();
                image.src = this.imagePath + (this.colour == 0 ? 'Black Queen.png' : 'White Queen.png');
                image.onload = () => {
                    this.image = image;
                    this.renderPiece();
                };
                break;
            case "k":
                var image = new Image();
                image.src = this.imagePath + (this.colour == 0 ? 'Black King.png' : 'White King.png');
                image.onload = () => {
                    this.image = image;
                    this.renderPiece();
                };
                break;
        }
    }

    renderPiece() {
        var dx = (this.x - 4) * 100 + window.screen.width / 2;
        var dy = (this.y - 4) * 100 + window.screen.height / 2;

        if (this.image) {
            drawImage(this.image, dx, dy, 100, 100);
        }
    }
}