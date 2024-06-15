
module.exports = {
    "description": "Displays a greeting message",
    "adminRequired": false,
    "category": "fun",
    "callback": function(args, context) {
        console.log(`Hello, ${context.account.username}!`);
    }
}