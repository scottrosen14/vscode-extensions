'use strict';
// The module 'vscode' contains the VS Code extensibility API
var vscode = require('vscode');
var copyPaste = require('copy-paste');
var path = require('path');
var pasteAndShowMessage = function (fileName) {
    copyPaste.copy(fileName);
    vscode.window.setStatusBarMessage("The filename \"" + fileName + "\" was copied to the clipboard.", 3000);
};
function activate(context) {
    var disposable = vscode.commands.registerCommand('copy-file-name.copyFileName', function () {
        var fullPath = vscode.window.activeTextEditor.document.fileName;
        var extName = path.extname(fullPath);
        var fileName = path.basename(fullPath, extName);
        pasteAndShowMessage(fileName);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('copy-file-name.copyFileNameWithExtension', function () {
        var fullPath = vscode.window.activeTextEditor.document.fileName;
        var fileName = path.basename(fullPath);
        pasteAndShowMessage(fileName);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map