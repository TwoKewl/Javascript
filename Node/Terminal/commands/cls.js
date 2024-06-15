
module.exports = {
    "description": "Clears the terminal.",
    "adminRequired": false,
    "category": "misc",
    "callback": function(args, context) {
        console.clear();
        process.stdout.write(`${context.account.username}@${context.device}\n\n`);
    }
}