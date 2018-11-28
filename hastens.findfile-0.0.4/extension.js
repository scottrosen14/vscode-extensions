// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var finder=require('./src/filefinder.js');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // This line of code will only be executed once when your extension is activated
      let disposable = vscode.commands.registerCommand('extension.findFile', () => {
        finder.showFileFinder(vscode);
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;