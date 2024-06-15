
module.exports = {
    "description": "Adds a user to this device.",
    "adminRequired": true,
    "category": "admin",
    "callback": function(args, context) {
        if (args.length != 2) return;
        if (context.account.admin === false) { console.log("You do not have permission to run this command."); return; };

        const [username, password] = args;
    
        const fs = require('fs');
        const { join } = require('path');

        const users = JSON.parse(fs.readFileSync(join(__dirname, '..', 'src', 'users.json'), 'utf8'));

        if (username && password) {
            if (users.find(user => user.username === username)) {
                return;
            }

            users.push({ username, password, "admin": false });
            fs.writeFileSync(join(__dirname, '..', 'src', 'users.json'), JSON.stringify(users, null, 4), 'utf-8');
            console.log(`User ${username} added successfully!`);
        }
    }
}