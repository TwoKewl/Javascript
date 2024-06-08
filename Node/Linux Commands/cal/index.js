
const getNumDays = (m, y) => new Date(y, m, 0).getDate();
const getDay = (d, m, y) => new Date(y, m - 1, d).getDay();
const getMonth = (m) => {
    const date = new Date(0, m, 0);

    return date.toLocaleString('default', { month: 'long' });
};

function showCalender(m, y) {
    const title = `${getMonth(m)} ${y}`;
    const titleLength = title.length;
    const spaces = Math.floor((20 - titleLength) / 2);

    console.log(' '.repeat(spaces) + title);

    console.log(`Mo Tu We Th Fr Sa Su`);

    const days = getNumDays(m, y);

    for (let i = 0; i < days; i++) {
        const day = getDay(i + 1, m, y);
        if (i == 0) {
            for (let j = 0; j < day; j++) {
                process.stdout.write('   ');
            }
        }

        var dayStr = (i + 1).toString();
        if (i + 1 <= 9) {
            dayStr = '0' + dayStr;
        }

        process.stdout.write(dayStr + ' ');

        if (day === 6) {
            console.log();
        }
    
    }
}

if (process.argv[2] && process.argv[3]) {
    if (!isNaN(process.argv[2]) && !isNaN(process.argv[3])) showCalender(parseInt(process.argv[2]), parseInt(process.argv[3]));
} else {
    const now = new Date();
    showCalender(now.getMonth() + 1, now.getFullYear());
}