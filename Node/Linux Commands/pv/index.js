
const input = process.argv[2];

function printLetter(input, index) {
    if (input) {
        if (index > input.length - 1) return false;

        process.stdout.write(input[index]);
        return true;
    }

    return false;
}

var index = 0;

setInterval(() => {
    var res = printLetter(process.argv[2], index);
    if (!res) process.exit();
    index++;
}, 100);