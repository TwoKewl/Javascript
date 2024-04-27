const fs = require('fs');
const path = require('path');
const readline = require('readline');
const cheerio = require('cheerio');

const envFilePath = path.resolve(__dirname, '.env');

const headers = {
    'Accept': 'application/smhw.v2021.5+json',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Authorization': '',
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

const taskHeaders = {
    'Accept': 'application/smhw.v2021.5+json',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Authorization': '',
    'Cache-Control': 'no-cache',
    'Origin': 'https://www.satchelone.com',
    'Pragma': 'no-cache',
    'Priority': 'u=1, i',
    'Referer': 'https://www.satchelone.com/todos/upcoming',
    'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'X-Platform': 'web'
}

const tickHeaders = {
    "Accept": "application/smhw.v2021.5+json",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    "Authorization": '',
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    "Origin": "https://www.satchelone.com",
    "Pragma": "no-cache",
    "Priority": "u=1, i",
    "Referer": "https://www.satchelone.com/todos/upcoming",
    "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Windows\"",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "X-Platform": "web"
}

function main(token){
    let date = new Date();
    today = date.toISOString().split('T')[0];
    future = getDateIn2Weeks();

    headers['Authorization'] = token;
    taskHeaders['Authorization'] = token;
    tickHeaders['Authorization'] = token;

    fetch(`https://api.satchelone.com/api/todos?add_dateless=true&from=${today}&to=${future}`, {
        method: 'GET',
        headers: headers
    })
    .then(res => res.text())
    .then(res => JSON.parse(res).todos)
    .then(data => {
        var allTaskIDS = [];
        console.clear();
        data.forEach(task => {
            console.log(`${task.subject} - ${task.class_task_title}`);
            console.log(`Task ID: ${task.id}\n`);
            allTaskIDS.push(task.id.toString());
        });

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('Enter Task ID: ', (response) => {
            response = response.toString();
            if (allTaskIDS.includes(response)){
                console.clear();

                rl.question('Actions: \n1. View Due Date \n2. View Teacher \n3. View Description \n4. Tick/Untick off Task \n\nEnter Number: ', (action) => {
                    action = action.toString();
                    if (['1', '2', '3', '4'].includes(action)){
                        data.forEach(task => {
                            if (task.id.toString() == response){
                                if (action == '1'){
                                    dueDate = getDueDate(task);
                                    console.log(`The Task is due on: ${dueDate}.`);
                                } else if (action == '2'){
                                    console.log(`The Teacher that set the homework is: ${task.teacher_name}.`);
                                } else if (action == '3'){
                                    fetchTask(task.class_task_id.toString());
                                } else {
                                    toggleTaskCompleted(task);
                                }
                            }
                        })
                        
                        rl.close();
                    } else {
                        console.log(`Action ${action} is invalid.`);
                        rl.close()
                    }
                });
            } else {
                if (response == 'exit') process.exit(0);
                console.log(`Task ID ${response} not found.`);
                rl.close();
            }
        });
    });
}

fs.readFile(envFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading .env file:', err);
        return;
    }

    const envVariables = parseEnvFile(data);

    Object.entries(envVariables).forEach(([key, value]) => {
        process.env[key] = value;
    });

    main(process.env.TOKEN);
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

function getDueDate(task){
    let dueDate = task.due_on.toString().split('').splice(0, 10).join('');
    dueDate = replaceAllChars(dueDate, '-', '/');
    return dueDate;
}

function replaceAllChars(str, searchValue, replaceValue){
    const regex = new RegExp(searchValue, 'g');
    return str.replace(regex, replaceValue);
}

function fetchTask(id){
    fetch(`https://api.satchelone.com/api/homeworks/${id}`, {
        method: "GET",
        headers: taskHeaders
    })
    .then(data => data.json())
    .then(data => {
        data = data.homework;
        description = data.description;
        description = removeHTMLTags(description);
        console.log(description);
    })
}

function removeHTMLTags(str){
    const $ = cheerio.load(str);
    const text = wrapText($.text().split(' '), process.stdout.columns);
    return text;
}

function wrapText(words, maxWidth) {
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        if (currentLine.length + word.length > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += (word + ' ');
    });

    if (currentLine.length > 0) {
        lines.push(currentLine.trim());
    }

    return lines.join('\n');
}

function toggleTaskCompleted(task){
    completed = task.completed
    payload = {completed: !task.completed};
    url = `https://api.satchelone.com/api/todos/${task.id}`;

    fetch(url, {
        method: "PUT",
        headers: tickHeaders,
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok){
            console.log(`Error: Code ${res.status}`);
        }

        return res.text();
    })
    .then(data => {
        if (completed){
            console.log(`Task has been set to: Not Complete.`);
        } else {
            console.log(`Task has been set to: Complete.`)
        }
    })
}