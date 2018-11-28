'use strict';
const vscode = require("vscode");
class CustomPatternController {
    constructor(decorator) {
        this.LOG_ID = 'log';
        this._decorator = decorator;
        const subscriptions = [];
        // Subscribe to the events.
        vscode.workspace.onDidChangeConfiguration(() => {
            this.onDidChangeConfiguration();
        }, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument((changedEvent) => {
            this.onDidChangeTextDocument(changedEvent);
        }, this, subscriptions);
        vscode.window.onDidChangeVisibleTextEditors((editors) => {
            this.onDidChangeVisibleTextEditors(editors);
        }, this, subscriptions);
        this._disposable = vscode.Disposable.from(...subscriptions);
        // Initial call.
        this.onDidChangeConfiguration();
    }
    dispose() {
        this._disposable.dispose();
        this._decorator.dispose();
    }
    onDidChangeConfiguration() {
        this._decorator.updateConfiguration();
        const logEditors = vscode.window.visibleTextEditors.filter((editor) => {
            return editor.document.languageId === this.LOG_ID;
        });
        if (logEditors.length !== 0) {
            this._decorator.decorateEditors(logEditors);
        }
    }
    onDidChangeTextDocument(changedEvent) {
        if (changedEvent.document.languageId === this.LOG_ID) {
            this._decorator.decorateDocument(changedEvent);
        }
    }
    onDidChangeVisibleTextEditors(editors) {
        const logEditors = editors.filter((editor) => {
            return editor.document.languageId === this.LOG_ID;
        });
        if (logEditors.length !== 0) {
            this._decorator.decorateEditors(logEditors);
        }
    }
}
module.exports = CustomPatternController;
//# sourceMappingURL=CustomPatternController.js.map