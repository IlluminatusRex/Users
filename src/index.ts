const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
    List = "list",
    Add = "add",
    Remove = "remove",
    Quit = "quit"
}

type InquirerAnswers = {
    action: Action
}

enum Status {
    Success = "Success",
    Error = "Error",
    Info = "Info"
}

class Message {
    content: string;

    constructor(content: string) {this.content = content;}
    public show(): void {console.log(this.content);}
    public capitalize(): void {this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();}
    public toUpperCase(): void {this.content = this.content.toUpperCase();}
    public toLowerCase(): void {this.content = this.content.toLowerCase();}
    public showColorized(status: Status, text: string): void {
        const consolaFunction = {
            [Status.Success]: consola.success,
            [Status.Error]: consola.error,
            [Status.Info]: consola.info,
        }[status];

        consolaFunction(text);
    }
}

interface User {
    name: string;
    age: number;
}

class UsersData {
    data: User[] = [];

    public showAll(): void {
        const message = new Message("Users data");
        message.showColorized(Status.Info, "Users data");

        if (this.data.length > 0) {
            console.table(this.data);
        } else {
            console.log("No data...");
        }
    }

    public add(user: User): void {
        if (typeof user.name === 'string' && user.name.length > 0 && typeof user.age === 'number' && user.age > 0) {
            this.data.push(user);
            const successMessage = new Message("User has been successfully added!");
            successMessage.showColorized(Status.Success, "User has been successfully added!");
        } else {
            const errorMessage = new Message("Wrong data!");
            errorMessage.showColorized(Status.Error, "Wrong data!");
        }
    }

    public remove(userName: string): void {
        const index = this.data.findIndex(user => user.name === userName);
        if (index !== -1) {
            this.data.splice(index, 1);
            const successMessage = new Message("User deleted!");
            successMessage.showColorized(Status.Success, "User deleted!");
        } else {
            const errorMessage = new Message("User not found...");
            errorMessage.showColorized(Status.Error, "User not found...");
        }
    }
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
const infoMessage = new Message("Available actions");
infoMessage.showColorized(Status.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
    inquirer.prompt([{
        name: 'action',
        type: 'input',
        message: 'How can I help you?',
    }]).then(async (answers: InquirerAnswers) => {
        switch (answers.action) {
            case Action.List:
                users.showAll();
                break;
            case Action.Add:
                const user = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name',
                }, {
                    name: 'age',
                    type: 'number',
                    message: 'Enter age',
                }]);
                users.add(user);
                break;
            case Action.Remove:
                const name = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name',
                }]);
                users.remove(name.name);
                break;
            case Action.Quit:
                const byeMessage = new Message("Bye bye!");
                byeMessage.showColorized(Status.Info, "Bye bye!");
                return;
        }

        startApp();
    });
};

startApp();