import * as Piece from './piece.js';

export class Board {
    constructor(ctx, width, height) {
        this.board = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.ctx = ctx;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.images = [];
        this.init();
    }

    init() {
        this.initBoard();
        this.loadPieces();
    }

    initBoard() {
        this.board = new Array(8).fill(null).map(() => new Array(8).fill(null));

        for (let x = 0; x < 8; x++) {
            this.board[6][x] = new Piece.Pawn('White', x, 6);
            this.board[1][x] = new Piece.Pawn('Black', x, 1);
        }

        this.board[7][0] = new Piece.Rook('White', 0, 7);
        this.board[7][7] = new Piece.Rook('White', 7, 7);
        this.board[0][0] = new Piece.Rook('Black', 0, 0);
        this.board[0][7] = new Piece.Rook('Black', 7, 0);

        this.board[7][1] = new Piece.Knight('White', 1, 7);
        this.board[7][6] = new Piece.Knight('White', 6, 7);
        this.board[0][1] = new Piece.Knight('Black', 1, 0);
        this.board[0][6] = new Piece.Knight('Black', 6, 0);

        this.board[7][2] = new Piece.Bishop('White', 2, 7);
        this.board[7][5] = new Piece.Bishop('White', 5, 7);
        this.board[0][2] = new Piece.Bishop('Black', 2, 0);
        this.board[0][5] = new Piece.Bishop('Black', 5, 0);

        this.board[7][3] = new Piece.Queen('White', 3, 7);
        this.board[0][3] = new Piece.Queen('Black', 3, 0);

        this.board[7][4] = new Piece.King('White', 4, 7);
        this.board[0][4] = new Piece.King('Black', 4, 0);
    }

    renderBoard() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const isWhiteSquare = (x + y) % 2 === 0;
                const squareColour = isWhiteSquare ? '#EBBB83' : '#B16E41'
                this.ctx.fillStyle = squareColour;
                const squareSize = this.canvasWidth / 8;
                this.ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
            }
        }
    }

    renderPieces() {
        this.board.forEach((row) => {
            row.forEach((piece) => {
                if (piece) {
                    const image = this.images.find((img) => img.name === `${piece.colour} ${piece.type}`).img;
                    const squareSize = this.canvasWidth / 8;
                    this.ctx.drawImage(image, piece.x * squareSize, piece.y * squareSize, squareSize, squareSize);
                }
            });
        });
    }

    loadPieces() {
        const pieceLocation = '../assets/pieces/';
        const pieces = ['Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King'];
        const colours = ['White', 'Black'];
        const totalImages = pieces.length * colours.length;

        for (const colour of colours) {
            for (const piece of pieces) {
                const filename = `${pieceLocation}${colour} ${piece}.png`;
                const img = new Image();
                img.src = filename;
                img.onload = () => {
                    this.images.push({ name: `${colour} ${piece}`, img });
                    if (this.images.length === totalImages) {
                        this.renderBoard();
                        this.renderPieces();
                    }
                }
            }
        }
    }

    renderMoves(piece) {
        this.renderBoard();
        this.renderPieces();

        const moves = piece.getMoves(this.board);
        const squareSize = this.canvasWidth / 8;
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        moves.forEach((move) => {
            this.ctx.fillRect(move.x * squareSize, move.y * squareSize, squareSize, squareSize);
        });
    }

    makeMove(piece, move) {
        // Remove en passant
        const allPieces = this.board.flat().filter((piece) => piece);
        allPieces.filter((piece) => piece.type == 'Pawn' && piece.colour === move.piece.colour).forEach((piece) => piece.justMovedTwo = false);

        if (piece instanceof Piece.Pawn) {
            if (move.y == 0 || move.y == 7) { // Handle Promotion
                piece = new Piece.Queen(piece.colour, piece.x, piece.y);
                this.board[piece.y][piece.x] = piece;
            } else if (move.isEnPassant) { // Handle En Passant
                this.board[piece.y][move.x] = null;
            } else if (Math.abs(piece.y - move.y) == 2) { // Handle Enable En Passant
                piece.justMovedTwo = true;
            }
        } else if (piece.type == 'King') {
            if (move.isCastleLeft) {
                const rook = this.board[piece.y][0];
                this.board[piece.y][3] = rook;
                this.board[piece.y][0] = null;
                rook.x = 3;
                rook.y = piece.y;
            } else if (move.isCastleRight) {
                const rook = this.board[piece.y][7];
                this.board[piece.y][5] = rook;
                this.board[piece.y][7] = null;
                rook.x = 5;
                rook.y = piece.y;
            }
        }

        piece.onMove();

        this.board[move.y][move.x] = piece;
        this.board[piece.y][piece.x] = null;
        piece.x = move.x;
        piece.y = move.y;

        new Audio('../assets/sounds/move.mp3').play();
        this.renderBoard();
        this.renderPieces();

        const kingTaken = this.checkKingTaken();
        if (kingTaken) {
            alert(`${kingTaken} wins!`);
            this.init();
        }
    }

    checkKingTaken() {
        const kings = this.board.flat().filter((piece) => piece && piece.type === 'King');
        if (kings.length < 2) {
            return 'White' === kings[0].colour ? 'White' : 'Black';
        }

        return null;
    }
}