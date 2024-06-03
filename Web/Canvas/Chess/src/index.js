import { Board } from './board.js';

var b = new Board("rnbqkbnr/pppppppp/////PPPPPPPP/RNBQKBNR/");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


setInterval(() => {
    var moves = b.getAllMoves(1);
    if (moves.length != 0) {
        var move = moves[Math.floor(Math.random() * moves.length)];
        b.makeMove(move[0][0], move[0][1], move[1][0], move[1][1])
    }
}, 250);
