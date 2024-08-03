import * as Piece from './piece.js';

export class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.board = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.setBoard();
        this.images = new Map();
    }

    setBoard() {
        this.board[4][5] = new Piece.Rook(this.ctx, 4, 5, 'black');
        this.board[5][6] = new Piece.Pawn(this.ctx, 5, 6, 'white')
    }

    defaultBoard() {
        for (let x = 0; x < 8; x++) {
            this.board[x][1] = new Piece.Pawn(this.ctx, x, 1, 'black');
            this.board[x][6] = new Piece.Pawn(this.ctx, x, 6, 'white');
        }

        this.board[0][0] = new Piece.Rook(this.ctx, 0, 0, 'black');
        this.board[7][0] = new Piece.Rook(this.ctx, 7, 0, 'black');
        this.board[0][7] = new Piece.Rook(this.ctx, 0, 7, 'white');
        this.board[7][7] = new Piece.Rook(this.ctx, 7, 7, 'white');

        this.board[1][0] = new Piece.Knight(this.ctx, 1, 0, 'black');
        this.board[6][0] = new Piece.Knight(this.ctx, 6, 0, 'black');
        this.board[1][7] = new Piece.Knight(this.ctx, 1, 7, 'white');
        this.board[6][7] = new Piece.Knight(this.ctx, 6, 7, 'white');

        this.board[2][0] = new Piece.Bishop(this.ctx, 2, 0, 'black');
        this.board[5][0] = new Piece.Bishop(this.ctx, 5, 0, 'black');
        this.board[2][7] = new Piece.Bishop(this.ctx, 2, 7, 'white');
        this.board[5][7] = new Piece.Bishop(this.ctx, 5, 7, 'white');

        this.board[3][0] = new Piece.Queen(this.ctx, 3, 0, 'black');
        this.board[4][0] = new Piece.King(this.ctx, 4, 0, 'black');
        this.board[3][7] = new Piece.Queen(this.ctx, 3, 7, 'white');
        this.board[4][7] = new Piece.King(this.ctx, 4, 7, 'white');
    }

    renderBoard() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.ctx.fillStyle = (x + y) % 2 === 0 ? '#f0d9b5' : '#b58863';
                this.ctx.fillRect(x * 100, y * 100, 100, 100);
            }
        }
    }

    renderPieces() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const piece = this.getPieceAt(x, y);
                if (piece) {
                    const image = this.images.get(piece.imageName);
                    this.ctx.drawImage(image, x * 100, y * 100, 100, 100);
                }
            }
        }
    }

    playMoveSound() {
        const audio = new Audio('../assets/sounds/move.mp3');
        audio.play();
    }

    loadPieces() {
        const imagePath = '../assets/pieces/';
        const filenames = [
            'Black Pawn.png', 'White Pawn.png',
            'Black Rook.png', 'White Rook.png',
            'Black Knight.png', 'White Knight.png',
            'Black Bishop.png', 'White Bishop.png',
            'Black Queen.png', 'White Queen.png',
            'Black King.png', 'White King.png'
        ];
        const imageCount = filenames.length;
        this.images = new Map();

        filenames.forEach((filename) => {
            const img = new Image();
            img.src = imagePath + filename;
            img.onload = () => {
                this.images.set(filename, img);
                if (this.images.size === imageCount) {
                    this.renderBoard();
                    this.renderPieces();
                }
            };
        });
    }

    getPieceAt(x, y) {
        return this.board[x][y];
    }

    makeRandomMove() {
        const moves = this.getAllLegalMoves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        if (move) {
            const [piece, [x, y]] = move;
            this.makeMove(piece, x, y);
        } else {
            console.log('No legal moves available');
        }
    }

    getAllLegalMoves() {
        const pieces = this.board.flat().filter((p) => p !== null && (p instanceof Piece.Pawn || p instanceof Piece.Knight || p instanceof Piece.Rook));
        const moves = [];

        pieces.forEach((piece) => {
            const legalMoves = piece.getLegalMoves(this.board);
            legalMoves.forEach((move) => {
                moves.push([piece, move]);
            });
        });

        return moves;
    }

    makeMove(piece, x, y) {
        if (this.checkIfMoveIsValid(piece, x, y)) {
            this.board[piece.x][piece.y] = null;
            this.board[x][y] = piece;
            piece.moveTo(x, y);

            this.renderBoard();
            this.renderPieces();
            this.playMoveSound();
        }
    }

    checkIfMoveIsValid(piece, x, y) {
        return true;
    }

    renderLegalMoves(piece) {
        const legalMoves = piece.getLegalMoves(this.board);
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        legalMoves.forEach(([x, y]) => {
            this.ctx.fillRect(x * 100, y * 100, 100, 100);
        });
    }
}