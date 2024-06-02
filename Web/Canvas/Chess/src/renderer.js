import * as draw from './drawing.js';

export class Renderer {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.cellSize = [100, 100];

        this.imagePath = './../assets/';
    }

    init(board) {
        draw.init(this.ctx);

        this.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); };
        this.canvas.width = window.screen.width;
        this.canvas.height = window.screen.height;
        document.body.classList.add("remove-scrolling");

        this.images = {};

        this.update();
        this.initChessPieces(board);
    }

    update(board = 0) {
        draw.clearScreen(135, 206, 235, 1);

        this.drawBoard();
    }

    initChessPieces(board) {
        ['Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King'].forEach((piece) => {
            let white = new Image();
            white.src = this.imagePath + `White ${piece}.png`;
            white.onload = () => {
                this.images[`White ${piece}`] = white;

                if (Object.keys(this.images).length == 12) {
                    console.log(this.images);
                    this.drawPieces(board);
                }
            };

            let black = new Image();
            black.src = this.imagePath + `Black ${piece}.png`;
            black.onload = () => {
                this.images[`Black ${piece}`] = black;

                if (Object.keys(this.images).length == 12) {
                    console.log(this.images);
                    this.drawPieces(board);
                }
            };
        });
    }

    drawBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 == 0) {
                    draw.rect(i * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4, j * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4, this.cellSize[0], this.cellSize[1], 255, 206, 158, 1);
                } else {
                    draw.rect(i * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4, j * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4, this.cellSize[0], this.cellSize[1], 209, 139, 71, 1);
                }
            }
        }
    }

    drawPieces(board) {
        if (board) {
            board.forEach((row) => {
                row.forEach((piece) => {
                    if (piece != 0) {
                        let colour = piece.colour == 0 ? "White" : "Black";
                        let type = piece.type;

                        console.log(piece);
                        console.log(`Drawing ${colour} ${type} at ${piece.x}, ${piece.y}`)

                        this.ctx.drawImage(this.images[`${colour} ${type}`], piece.x * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4, piece.y * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4, this.cellSize[0], this.cellSize[1]);
                    }
                });
            });
        }
    }
}