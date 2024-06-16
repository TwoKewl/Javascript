const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

class Terminal {
    constructor() {
        this.account = null;
        this.commands = new Map();
        this.path = `${os.userInfo().homedir}`;
        this.registerCommands();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.attemptLogin();
    }

    attemptLogin() {
        this.rl.question("Enter your username: ", (username) => {
            this.rl.question("Enter your password: ", (password) => {
                if (this.login(username, password)) {
                    console.clear();
                    console.log(`${this.account.username}@${os.hostname()}`);
                    this.startTerminal();
                } else {
                    console.log(chalk.redBright("Login failed. Please try again."));
                    this.attemptLogin();
                }
            });
        });
    }

    login(username, password) {
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            this.account = user;
            return true;
        }
        return false;
    }

    startTerminal() {
        this.rl.question(`\n${this.path} :~$ `, (command) => {
            this.handleCommand(command);
        });
    }

    handleCommand(command) {
        this.registerCommands();

        const [commandName, ...args] = command.split(' ');
        const commandInfo = this.commands.get(commandName);

        if (!commandInfo) {
            console.log(chalk.redBright(`Command '${commandName}' not found.`));
            this.startTerminal();
            return;
        }

        const { callback, adminRequired } = commandInfo;

        if (callback) {
            if (adminRequired && !this.account.admin) {
                console.log("You do not have permission to run this command.");
                this.startTerminal();
                return;
            }

            const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));

            const context = {
                account: this.account,
                device: os.hostname(),
                users: users,
                path: this.path,
                commands: this.commands
            };

            if (this.checkAsync(callback)) {
                callback(args, context)
                .then(() => this.startTerminal());
            } else {
                callback(args, context);
                this.startTerminal();
            }
        }
    }

    checkAsync(callback) {
        return callback.constructor.name === 'AsyncFunction';
    }

    addCommand(command, callback) {
        this.commands.set(command, callback);

        this.commands = new Map([...this.commands.entries()].sort());
    }

    registerCommands() {
        this.registerBuiltInCommands();

        const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = file.split('.')[0];
            const commandPath = path.join(__dirname, '..', 'commands', file);
            delete require.cache[require.resolve(commandPath)];
            const contents = require(commandPath);
            const callback = {"callback": contents.callback, "adminRequired": contents.adminRequired, "description": contents.description, "category": contents.category};

            this.addCommand(command, callback);
        }
    }

    registerBuiltInCommands() {
        this.addCommand('exit', {
            "description": "Exits the terminal.",
            "adminRequired": false,
            "category": "utility",
            "callback": () => {
                console.clear();
                this.rl.close();
                process.exit();
            }
        });

        this.addCommand('cd', {
            "description": "Changes the current directory.",
            "adminRequired": false,
            "category": "utility",
            "callback": (args, context) => {
                if (args.length != 1) { console.log(`Usage: cd <directory>`); return; };
                if (args[0] === '..') {
                    this.path = this.path.split(path.sep).slice(0, -1).join(path.sep);
                } else {
                    const newPath = path.join(this.path, args[0]);
                    if (fs.existsSync(newPath)) {
                        const directories = fs.readdirSync(this.path, { withFileTypes: true })
                            .filter(dirent => dirent.isDirectory())
                            .map(dirent => dirent.name);
        
                        const match = directories.find(dir => dir.toLowerCase() === args[0].toLowerCase());
        
                        if (match) {
                            this.path = path.join(this.path, match);
                        } else {
                            console.log(`Directory ${args[0]} does not exist.`);
                        }
                    } else {
                        console.log(`Directory ${args[0]} does not exist.`);
                    }
                }
            }
        });
        
        this.addCommand('setAdmin', { 
            "description": "Sets a user as an admin.",
            "adminRequired": true,
            "category": "admin",
            "callback": (args, context) => {
                if (args.length != 2) return;
    
                const [username, admin] = args;
            
                const fs = require('fs');
                const { join } = require('path');
    
                const users = JSON.parse(fs.readFileSync(join(__dirname, '..', 'src', 'users.json'), 'utf8'));
    
                if (username) {
                    if (context.account.admin === false) {
                        console.log("You do not have permission to run this command.");
                        return;
                    }
                    const user = users.find(user => user.username === username);
    
                    if (!user) {
                        console.log("User not found.");
                        return;
                    } else {
                        user.admin = admin === 'true' ? true : false;
                        fs.writeFileSync(join(__dirname, '..', 'src', 'users.json'), JSON.stringify(users, null, 4), 'utf-8');
                        
                        if (this.account.username === username) {
                            this.account.admin = admin === 'true' ? true : false;
                        }
    
                        admin === 'true' ? console.log(chalk.green(`User ${username} is now an admin!`)) : console.log(chalk.red(`User ${username} is no longer an admin!`));
                    }
                }
            }
        });

        this.addCommand('refreshCommands',  {
            "description": "Refreshes the list of commands, so if any changes are made to the commands, you do not need to restart. You do not need to call this command as it updates every time you run a command.",
            "adminRequired": false,
            "category": "utility",
            "callback": () => {
                this.commands.clear();
                this.registerCommands();
            }
        });
    }
}

const terminal = new Terminal();
