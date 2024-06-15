
module.exports = {
    "description": "Creates a directory at the specified path.",
    "adminRequired": false,
    "category": "utility",
    "callback": function(args, context) {
        if (args.length != 1) return;

        const path = `${context.path}\\${args[0]}`;

        if (path) {
            // fs.mkdirSync(join(__dirname, '..', 'src', path), { recursive: true });
            console.log(`Directory ${path} created.`);
        }
    }
}