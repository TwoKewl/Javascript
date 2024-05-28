
export class Connection {
    constructor(dot1, dot2, maxLength) {
        this.dot1 = dot1;
        this.dot2 = dot2;
        this.length = this.getDistance();
    }

    tick() {
    		// work out how much to scale the length of the link to bring it back to the correct size
			let scale = this.length / this.getDistance();
            scale *=1;
		
			// and now nudge both points to get there
            let midX = (this.dot1.x + this.dot2.x)/2;
            let midY = (this.dot1.y + this.dot2.y)/2;

			if (!this.dot1.fixed) {
                
                this.dot1.x = midX + (this.dot1.x- midX) * scale;
                this.dot1.y = midY + (this.dot1.y- midY) * scale;
            }

            if (!this.dot2.fixed) {
                
                this.dot2.x = midX + (this.dot2.x- midX) * scale;
                this.dot2.y = midY + (this.dot2.y- midY) * scale;
            }

    }

    getDistance() {
        return Math.sqrt((this.dot1.x - this.dot2.x)**2 + (this.dot1.y - this.dot2.y)**2);
    }
}