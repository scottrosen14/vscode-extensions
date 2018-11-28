"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const command_1 = require("./command");
const Cache_1 = require("./lib/Cache");
function handleError(err) {
    if (err) {
        vscode.window.showErrorMessage(err);
    }
    return err;
}
function register(context, command, commandName) {
    const proxy = (...args) => command.execute(...args).catch(handleError);
    const disposable = vscode.commands.registerCommand(`fileutils.${commandName}`, proxy);
    context.subscriptions.push(disposable);
}
function activate(context) {
    Cache_1.Cache.context = context;
    register(context, new command_1.MoveFileCommand(), 'moveFile');
    register(context, new command_1.RenameFileCommand(), 'renameFile');
    register(context, new command_1.DuplicateFileCommand(), 'duplicateFile');
    register(context, new command_1.RemoveFileCommand(), 'removeFile');
    register(context, new command_1.NewFileCommand(), 'newFile');
    register(context, new command_1.NewFileAtRootCommand(), 'newFileAtRoot');
    register(context, new command_1.NewFolderCommand(), 'newFolder');
    register(context, new command_1.NewFolderAtRootCommand(), 'newFolderAtRoot');
    register(context, new command_1.CopyFileNameCommand(), 'copyFileName');
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map