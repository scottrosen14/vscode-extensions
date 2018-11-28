"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const open_file_provider_1 = require("./open-file.provider");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    context.subscriptions.push(vscode_1.languages.registerDefinitionProvider({ language: "*", scheme: "file" }, new open_file_provider_1.OpenRelativeFileDefinitionProvider()));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map