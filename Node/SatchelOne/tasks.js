const fs = require('fs');
const path = require('path');

function main(token, renderer){
    let date = new Date();
    today = date.toISOString().split('T')[0];
    future = getDateIn2Weeks();

    fetch(`https://api.satchelone.com/api/todos?add_dateless=true&from=${today}&to=${future}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/smhw.v2021.5+json',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Origin': 'https://www.satchelone.com',
            'Pragma': 'no-cache',
            'Priority': 'u=1, i',
            'Referer': 'https://www.satchelone.com/homeworks/',
            'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'X-Platform': 'web'
        }
    })
    .then(res => res.text())
    .then(res => JSON.parse(res).todos)
    .then(data => {
        var completed = [];
        var notCompleted = [];
        data.forEach(task => {
            if (!task.completed){
                notCompleted.push(task);
            } else {
                completed.push(task);
            }
        });

        notCompleted.forEach(task => {
            renderer.render(task);
        })
    })
}


class Renderer{
    constructor(){
        process.stdout.write('\x1Bc');
    }

    replaceChars(str, searchValue, replaceValue){
        const regex = new RegExp(searchValue, 'g');
        return str.replace(regex, replaceValue);
    }

    render(task){
        console.log(`Title: ${task.class_task_title}`);
        console.log(`Subject: ${task.subject}`);
        console.log(`Due on: ${this.replaceChars(task.due_on.slice(0, 10), '-', '/')}`);
        console.log(`Set by: ${task.teacher_name}`);
        console.log(``);
    }
}

const envFilePath = path.resolve(__dirname, '.env');

fs.readFile(envFilePath, 'utf8', (err, data) => {
    var renderer = new Renderer();
    if (err) {
        console.error('Error reading .env file:', err);
        return;
    }

    const envVariables = parseEnvFile(data);

    Object.entries(envVariables).forEach(([key, value]) => {
        process.env[key] = value;
    });

    main(process.env.TOKEN, renderer);
});

function parseEnvFile(data) {
    const envVariables = {};
    const lines = data.split('\n');

    lines.forEach(line => {
        const [key, value] = line.split('=');
        envVariables[key.trim()] = value.trim();
    });

    return envVariables;
}

function getDateIn2Weeks(){
    const date = new Date();
    date.setDate(date.getDate() + 14)
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    return formattedDate;
}