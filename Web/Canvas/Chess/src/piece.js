import { drawImage, line, circle } from "./drawing.js";

export class Pawn {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Pawn";
    }
}

export class Knight {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Knight";
    }
}

export class Bishop {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Bishop";
    }
}

export class Rook {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Rook";
    }
}

export class Queen {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "Queen";
    }
}

export class King {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "King";
    }
}