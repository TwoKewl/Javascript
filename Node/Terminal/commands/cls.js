
module.exports = {
    "description": "Clears the terminal.",
    "adminRequired": false,
    "category": "misc",
    "callback": function(args, context) {
        console.clear();
        console.log(`${context.account.username}@${context.device}`);
    }
}