
module.exports = {
    "description": "Runs this program inside of an external terminal.",
    "adminRequired": false,
    "category": "utility",
    "callback": function(args, context) {
        const { exec } = require('child_process');

        exec(`start powershell -NoExit -Command "node ${__dirname}\\..\\src\\index.js"`, (error, stdout, stderr) => {
            console.log(`Running in PowerShell. Exiting now.`);
            process.exit();
        });
    }
}