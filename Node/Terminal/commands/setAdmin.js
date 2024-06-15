
module.exports = {
    "description": "Sets a user as an admin.",
    "adminRequired": true,
    "category": "admin",
    "callback": function(args, context) {
        if (args.length != 2) return;

        const [username, admin] = args;
    
        const fs = require('fs');
        const { join } = require('path');

        const users = JSON.parse(fs.readFileSync(join(__dirname, '..', 'src', 'users.json'), 'utf8'));

        if (username) {
            if (username === context.account.username) {
                console.log("You cannot change your own admin status.");
                return;
            }
            if (context.account.admin === false) {
                console.log("You do not have permission to run this command.");
                return;
            }
            if (!users.find(user => user.username === username)) {
                console.log("User not found.");
                return;
            }

            const user = users.find(user => user.username === username);
            if (user) {
                user.admin = admin === 'true' ? true : false;
                fs.writeFileSync(join(__dirname, '..', 'src', 'users.json'), JSON.stringify(users, null, 4), 'utf-8');
                
                admin === 'true' ? console.log(`User ${username} is now an admin!`) : console.log(`User ${username} is no longer an admin!`);
            }
        }
    }
}