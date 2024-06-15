
module.exports = {
    "description": "Lists all users",
    "adminRequired": false,
    "category": "misc",
    "callback": function(args, context) {
        const chalk = require('chalk');
        console.log(`All Users: `);
        for (const user of context.users) {
            if (user.admin) {
                console.log(`- ${user.username === context.account.username ? chalk.blue(user.username) : user.username} \n - Admin: ${user.admin} \n - Password: ${user.password}`);
            } else {
                console.log(`- ${user.username}`);
            }
        }
    }
}