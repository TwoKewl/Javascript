import * as draw from './drawing.js';

draw.init(document.getElementById('canvas').getContext('2d'));

export class Renderer {
    constructor(copy) {
        this.copy = copy;
        if (!copy) {
            this.canvas = document.getElementById('canvas');
            this.ctx = document.getElementById('canvas').getContext('2d');
            draw.init(this.ctx);
            this.cellSize = [100, 100];
    
            this.imagePath = './../assets/pieces/';
            this.soundPath = './../assets/sounds/';
        }
    }

    init(board) {
        if (!this.copy) {
            this.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); };
            this.canvas.width = window.screen.width;
            this.canvas.height = window.screen.height;
            document.body.classList.add("remove-scrolling");

            this.images = {};

            this.update();
            this.initChessPieces(board);
        }
    }

    update() {
        if (!this.copy) {
            draw.clearScreen(135, 206, 235, 1);

            this.drawBoard();
            this.drawPieces();
        }
    }

    initChessPieces(board) {
        if (!this.copy) {
            ['Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King'].forEach((piece) => {
                let white = new Image();
                white.src = this.imagePath + `White ${piece}.png`;
                white.onload = () => {
                    this.images[`White ${piece}`] = white;
    
                    if (Object.keys(this.images).length == 12) {
                        this.drawPieces(board);
                    }
                };
    
                let black = new Image();
                black.src = this.imagePath + `Black ${piece}.png`;
                black.onload = () => {
                    this.images[`Black ${piece}`] = black;
    
                    if (Object.keys(this.images).length == 12) {
                        this.drawPieces(board);
                    }
                };
            });
        }   
    }

    drawBoard() {
        if (!this.copy) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    this.drawSquare(i, j, false);
                }
            }
        }
    }

    drawPieces(board) {
        if (!this.copy) {
            if (board) {
                board.forEach((row) => {
                    row.forEach((piece) => {
                        if (piece != 0) {
                            let colour = piece.colour == 1 ? "White" : "Black";
                            let type = piece.type;
    
                            this.ctx.drawImage(this.images[`${colour} ${type}`], piece.x * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4, piece.y * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4, this.cellSize[0], this.cellSize[1]);
                        }
                    });
                });
            }
        }
    }

    showMoves(moves) {
        if (!this.copy) {
            moves.forEach((move) => {
                let start = move[0];
                let end = move[1];
    
                let x1 = start[0] * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4 + this.cellSize[0] / 2;
                let y1 = start[1] * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4 + this.cellSize[1] / 2;
                let x2 = end[0] * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4 + this.cellSize[0] / 2;
                let y2 = end[1] * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4 + this.cellSize[1] / 2;
    
                draw.line(x1, y1, x2, y2, 255, 0, 0, 1, 2);
                draw.circle(x2, y2, 3, 255, 0, 0, 1);
            });
        }
    }

    onPieceMove(board, moves) {
        if (!this.copy) {
            var moveSound = new Audio(this.soundPath + 'move.mp3');
            moveSound.play();
    
            this.drawBoard();
            this.checkHandler(moves, board);
            // this.showMoves(moves);
            this.drawPieces(board);
        }
    }

    checkHandler(moves, board) {
        if (!this.copy) {
            for (let i = 0; i < 2; i++) {
                var row = board.find((row) => row.find((piece) => piece.type == 'King' && piece.colour == i));
                if (row) {
                    var king = row.find((piece) => piece.type == 'King' && piece.colour == i);
                    if (king) {
                        var kingLocation = [king.x, king.y];
    
                        for (const move of moves) {
                            if (move[1][0] == kingLocation[0] && move[1][1] == kingLocation[1]) {
                                console.log(`Check for ${i == 0 ? 'Black' : 'White'} at (${move[1][0]}, ${move[1][1]})`);
                                this.drawSquare(move[1][0], move[1][1], true);
                                break;
                            }
                        }
                    }
                }
            }   
        } 
    }

    drawSquare(x, y, check) {
        if (!this.copy) {
            if (!check) {
                if ((x + y) % 2 == 0) {
                    draw.rect(x * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4, y * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4, this.cellSize[0], this.cellSize[1], 255, 206, 158, 1);
                } else {
                    draw.rect(x * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4, y * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4, this.cellSize[0], this.cellSize[1], 209, 139, 71, 1);
                }
            } else {
                draw.rect(x * this.cellSize[0] + window.screen.width / 2 - this.cellSize[0] * 4, y * this.cellSize[1] + window.screen.height / 2 - this.cellSize[1] * 4, this.cellSize[0], this.cellSize[1], 245, 87, 66, 1);
            } 
        }  
    }
}