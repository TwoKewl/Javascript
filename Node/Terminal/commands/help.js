
module.exports = {
    "description": "Displays a list of commands",
    "adminRequired": false,
    "category": "misc",
    "callback": function(args, context) {
        if (args.length == 0) {
            console.log(`All Command Categories: `);
            const categories = new Set();
            for (const [key, value] of context.commands) {
                if (context.account.admin == value.adminRequired || context.account.admin) {
                    categories.add(value.category);
                }
            }

            for (const category of categories) {
                console.log(`- ${category}`);
            }
        } else {
            if (args[0] == 'admin' && !context.account.admin) console.log(`You do not have permission to view this category.`);
            console.log(`All Commands in the '${args[0][0].toUpperCase()}${args[0].slice(1, args[0].length)}' Category Available: `);

            for (const [key, value] of context.commands) {
                if (context.account.admin == value.adminRequired || context.account.admin) {
                    if (args[0] == value.category) console.log(`- ${key}: ${value.description}`);
                }
            }
        }
    }
}