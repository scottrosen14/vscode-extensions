'use strict';
const vscode = require("vscode");
class TimePeriodController {
    constructor(timeCalculator) {
        this._timeCalculator = timeCalculator;
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }
        // subscribe to selection change and editor activation events
        const subscriptions = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this.updateTimePeriod(this._statusBarItem);
        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }
    updateTimePeriod(statusBarItem) {
        // Get the current text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        const doc = editor.document;
        // Only update status if an log file
        if (doc.languageId === 'log') {
            this._statusBarItem.text = '';
            const timePeriod = this._timeCalculator.getTimePeriod(doc.getText(editor.selection));
            if (timePeriod !== undefined) {
                // Update the status bar
                this._statusBarItem.text = this._timeCalculator.convertToDisplayString(timePeriod);
                this._statusBarItem.show();
            }
            else {
                this._statusBarItem.hide();
            }
        }
        else {
            this._statusBarItem.hide();
        }
    }
    _onEvent() {
        this.updateTimePeriod(this._statusBarItem);
    }
}
module.exports = TimePeriodController;
//# sourceMappingURL=TimePeriodController.js.map