import chalk from 'chalk';
import readline from 'readline';

var characterList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$£%&#@~?';

class Matrix{
    constructor(){
        this.matrix = [];

        for (let y = 0; y < process.stdout.rows; y++){
            this.matrix.push('');
            for (let x = 0; x < process.stdout.columns; x++){
                if (Math.random() < 0.1){
                    this.matrix[y] += characterList[Math.floor(Math.random() * characterList.length)];
                } else {
                    this.matrix[y] += ' ';
                }
            }
        }
    }

    update(){
        print(this.matrix);

        this.matrix.shift();
        this.matrix.push('');
        for (let x = 0; x < process.stdout.columns; x++){
            if (Math.random() < 0.1){
                this.matrix[this.matrix.length - 1] += characterList[Math.floor(Math.random() * characterList.length)];
            } else {
                this.matrix[this.matrix.length - 1] += ' ';
            }
        }
    }
}

function print(matrix){
    readline.moveCursor(process.stdout, 0, -process.stdout.rows);
    readline.cursorTo(process.stdout, 0);

    process.stdout.write(chalk.green(matrix.join('\n')));
}

var m = new Matrix();

function main(){
    m.update();
}

process.on('SIGINT', () => {
    console.clear();
    process.exit(0);
});

setInterval(main, 100, false);