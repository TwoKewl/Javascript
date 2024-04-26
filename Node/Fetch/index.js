import os from 'os';
import chalk from 'chalk';
import si from 'systeminformation';
import readline from 'readline';

var logo = `${chalk.green(`    
                    .;cllc;.                
                 .';cc:;;:cc;'.
             ..,:c:;'.    .';cc:,..         
          .';cc:,..           .,:cc;'.      
      ..,:c:;'.                  .';cc:,..  
    .;cc:,..                        ..,:cc;.
    cc;.                                .;lc
    cc;.                                .;lc
    lc.        .,'.   .',,;::::;;'.      'cl
    lc.        ,l:. .,cc:;''..'';cc:.    'cl
    lc.        ,l:. .cl;..       .;c;.   .cl
    lc.        ,l:. .:lc:;'...... ...    .cl
    lc.        ,l:.  .',;;:ccccc::;'.    .cl
    lc.        ,l:.  .     ......,:lc'   .cl
    lc.        ,l:..,c;.          'cl,   'cl
    lc.        ,l:. .:l:;,.......,:c:.   'cl
    lc.        ,l:.  ..,;;:ccccc:;,..    'cl
    cc;.       ,l:.        .....         'cl
    cc;.       ,l:.                     .;lc
    .;cc:,.....:l:.                  .,:cc;.
      ..,:cc:ccc:.               .';cc:,..  
          .......            ..,:cc;'.      
                .,:;'.    .';cc:,..         
                 .';:c:;;:cc;'.             
                    .,:ccc;.

`)}`.split('\n');

function main(){
    process.stdout.write('\x1Bc');

    logLogo();

    getAllInfo().then(data => {
        printInfo(data);
    });

    getCPUInfo().then(data => {
        printInfo(data);
    });

    getGPUInfo().then(data => {
        printInfo(data);
    });

    getResolution().then(data => {
        printInfo(data);
    })
}

var printLine = 1;

async function printInfo(info){
    process.stdout.write('\u001B[?25l');
    for (let i = 0; i < info.length; i++){
        readline.cursorTo(process.stdout, 50, printLine);
        process.stdout.write('|')
        console.log(info[i]);
        readline.cursorTo(process.stdout, 91, printLine);
        console.log('|');
        readline.cursorTo(process.stdout, 0, printLine);
        printLine += 1;
    }

    readline.cursorTo(process.stdout, 0, logo.length);
}

function logLogo(){
    for (let i = 0; i < logo.length; i++){
        console.log(logo[i]);
    }
}

async function getAllInfo(){
    var info = [];
    let date = new Date();
    let hours = date.getHours() % 12;
    let minutes = date.getMinutes();

    if (minutes < 10) minutes = '0' + minutes;
    if (hours < 10) hours = '0' + hours;

    let time = `${hours}:${minutes}`;
    if (date.getHours() <= 12){
        time += `am`;
    } else {
        time += `pm`;
    }

    let uptimeDays = Math.floor(os.uptime() / 86400).toString();
    let uptimeHours = Math.floor(os.uptime() / 3600 % 24).toString();
    let uptimeMinutes = Math.floor(os.uptime() / 60 % 60).toString();

    let bar = '';
    for (let i = 0; i < 40; i++){
        bar += '-';
    }
    info.push(bar);

    info.push(`${chalk.green('NODE-FETCH')} - ${time}`);
    info.push(`${bar}`);
    info.push(`${chalk.blueBright(`${chalk.bold(`USER: ${chalk.reset(os.userInfo().username)}`)}`)}`);
    info.push(`${chalk.blueBright(`${chalk.bold(`DEVICE: ${chalk.reset(os.hostname())}`)}`)}`);
    info.push(`${chalk.blueBright(`${chalk.bold(`UPTIME: ${chalk.reset(`${uptimeDays} days, ${uptimeHours} hours, ${uptimeMinutes} mins`)}`)}`)}`);

    bar = '';
    for (let i = 0; i < 40; i++){
        bar += '-';
    }
    info.push(bar);

    return info;
}

async function getCPUInfo(){
    const info = [];
    const cpu = (await si.cpu()).brand;

    info.push(`${chalk.blueBright(`${chalk.bold(`CPU: ${chalk.reset(cpu)}`)}`)}`);

    var bar = '';
    for (let i = 0; i < 40; i++){
        bar += '-';
    }
    info.push(bar);

    return info;
}

async function getGPUInfo(){
    const info = [];
    var gpu = (await si.graphics()).controllers;

    gpu.forEach((e) => {
        info.push(`${chalk.blueBright(`${chalk.bold(`GPU: ${chalk.reset(e.model)}`)}`)}`);
    });

    var bar = '';
    for (let i = 0; i < 40; i++){
        bar += '-';
    }
    info.push(bar);

    return info;
}

async function getResolution(){
    const info = [];
    const graphics = await si.graphics();

    graphics.displays.forEach(e => {
        info.push(`${chalk.blueBright(`${chalk.bold(`DISPLAY ${graphics.displays.indexOf(e)}:`)}`)}`);
        info.push(`RESOLUTION: ${e.resolutionX}x${e.resolutionY}`);
        info.push(`HZ: ${e.currentRefreshRate}`);
    });

    var bar = '';
    for (let i = 0; i < 40; i++){
        bar += '-';
    }
    info.push(bar);

    return info;
}

process.on('SIGINT', () => {
    console.clear();
    process.stdout.write('\u001B[?25h');
    process.exit(0);
});

main();