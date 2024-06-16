
module.exports = {
    "description": "Runs the .bat file at the specified path.",
    "adminRequired": false,
    "category": "utility",
    "callback": async function(args, context) {
        if (args.length < 1) {
            console.log('Usage: bat <path> <args> \nNote: The path must be relative to the terminal directory.');
            return;
        }

        const util = require('util');
        const exec = util.promisify(require('child_process').exec);

        await exec(`start ${__dirname}\\${args[0]}`);
    }
}